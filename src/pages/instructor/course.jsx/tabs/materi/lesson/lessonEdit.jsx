import React, { useEffect, useRef, useState } from 'react';
import InstructorTemplate from '../../../../../../template/templateInstructor';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../../../../../components/icons/icon';
import TextInput from '../../../../../../components/form/textInput';
import SelectOption from '../../../../../../components/form/selectOption';
import WysiwygInput from '../../../../../../components/form/wysiwygInput';
import QuizBuilder from '../../../../../../components/quizBuilder/quizBuilder';
import useLessonStore from '../../../../../../zustand/material/lessonStore';
import ConfirmationModal from '../../../../../../components/modal/confirmationModal';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../../../zustand/authStore';

export default function LessonEdit() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { lessonData, loading, error, fetchLessonDetail, updateLesson } = useLessonStore();
  const token = useAuthStore((state) => state.token);

  const [formData, setFormData] = useState({
    title: '',
    materialContent: '',
    type: '',
    quizContent: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(null);
  const wysiwygRef = useRef(null);

  // Prefill form when lessonData is loaded
  useEffect(() => {
    if (lessonData) {
      setFormData({
        title: lessonData.lesson_title || '',
        type: lessonData.type || '',
        materialContent: lessonData.type === 'material' ? lessonData.content?.material || '' : '',
        quizContent:
          lessonData.type === 'quiz'
            ? (lessonData.content || []).map((q) => ({
                question: q.question || '',
                options: (q.options || []).map((opt) => opt.answer || ''),
                correctAnswer: q.options?.findIndex((opt) => opt.is_correct === 1),
              }))
            : [],
      });
    }
  }, [lessonData]);

  // Fetch lesson detail on mount
  useEffect(() => {
    if (lessonId) {
      fetchLessonDetail(lessonId).catch((e) => {
        toast.error('Gagal mengambil detail materi: ' + e.message);
      });
    }
  }, [lessonId, fetchLessonDetail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPendingSubmit({ ...formData });
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsModalOpen(false);

    try {
      const token = useAuthStore.getState().token;
      let finalMaterialContent = pendingSubmit.materialContent;
      let quizContent = pendingSubmit.quizContent;

      if (pendingSubmit.type === 'material' && wysiwygRef.current) {
        finalMaterialContent = await wysiwygRef.current.uploadLocalImages(token);
      }

      if (pendingSubmit.type === 'quiz') {
        const baseUrlRaw = process.env.REACT_APP_BACKEND_BASE_URL || '';
        const baseUrl = baseUrlRaw.endsWith('/') ? baseUrlRaw.slice(0, -1) : baseUrlRaw;

        quizContent = await Promise.all(
          pendingSubmit.quizContent.map(async (q) => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = q.question;

            const imgElements = Array.from(wrapper.querySelectorAll('img'));

            await Promise.all(
              imgElements.map(async (img) => {
                const src = img.getAttribute('src');
                if (!src || src.startsWith('http')) return;

                try {
                  const blob = await (await fetch(src)).blob();
                  const formData = new FormData();
                  formData.append('image', blob, `quizimg_${Date.now()}_${Math.random()}.png`);

                  const res = await fetch(`${baseUrl}/api/image`, {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      Accept: 'application/json',
                    },
                    body: formData,
                  });

                  if (!res.ok) throw new Error('Upload gambar gagal');

                  const data = await res.json();
                  let finalUrl = data.url;
                  if (finalUrl && !finalUrl.startsWith('http')) {
                    finalUrl = finalUrl.startsWith('/')
                      ? baseUrl + finalUrl
                      : baseUrl + '/' + finalUrl;
                  }
                  img.setAttribute('src', finalUrl);
                } catch (e) {
                  console.warn('Upload gagal untuk gambar di quiz:', e);
                }
              })
            );

            return {
              ...q,
              question: wrapper.innerHTML,
              correctAnswer:
                q.correctAnswer === null || q.correctAnswer === undefined || q.correctAnswer === ''
                  ? null
                  : Number(q.correctAnswer),
            };
          })
        );
      }

      const result = {
        title: pendingSubmit.title,
        type: pendingSubmit.type,
        ...(pendingSubmit.type === 'material' && { materialContent: finalMaterialContent }),
        ...(pendingSubmit.type === 'quiz' && { quizContent }),
      };

      await updateLesson({ lessonId, data: result });

      toast.success('Materi berhasil diupdate');
      navigate(-1);
    } catch (err) {
      console.error('Gagal update materi:', err);
      toast.error('Gagal update materi: ' + err.message);
    }
  };

  const handleCancelSubmit = () => {
    setIsModalOpen(false);
    setPendingSubmit(null);
  };

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="p-4 bg-white rounded-lg shadow">
        <button
          className="flex items-center gap-2 mb-4 bg-secondary-900 text-white px-3 py-2 rounded hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="size-[1rem]" />
          <span>Kembali</span>
        </button>

        <h2 className="text-xl font-bold text-primary-700 mb-4">Edit Materi Kursus</h2>

        {loading && <div className="text-gray-500 mb-4">Memuat data materi...</div>}
        {error && <div className="text-red-500 mb-4">Error: {error}</div>}

        {!loading && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <TextInput
              label="Judul materi"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan judul materi"
            />
            <SelectOption
              label="Jenis Pembelajaran"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={[
                { value: 'material', label: 'Materi' },
                { value: 'quiz', label: 'Quiz' },
              ]}
              placeholder="Pilih jenis pembelajaran"
              disabled // type is not editable
            />
            {formData.type === 'material' && (
              <WysiwygInput
                ref={wysiwygRef}
                label="Konten Materi"
                name="materialContent"
                value={formData.materialContent}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, materialContent: e.target.value }))
                }
              />
            )}
            {formData.type === 'quiz' && (
              <QuizBuilder
                quizContent={formData.quizContent}
                setQuizContent={(q) => setFormData((prev) => ({ ...prev, quizContent: q }))}
              />
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-600"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Konfirmasi Simpan Materi"
        message="Apakah Anda yakin ingin menyimpan perubahan materi ini?"
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        closeModal={handleCancelSubmit}
        variant="primary"
      />
    </InstructorTemplate>
  );
}
