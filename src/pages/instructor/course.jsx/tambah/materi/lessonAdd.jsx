import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorTemplate from '../../../../../template/templateInstructor';
import Icon from '../../../../../components/icons/icon';
import TextInput from '../../../../../components/form/textInput';
import SelectOption from '../../../../../components/form/selectOption';
import WysiwygInput from '../../../../../components/form/wysiwygInput';
import QuizBuilder from '../../../../../components/quizBuilder/quizBuilder';

export default function LessonAdd() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: '',
    questions: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = {
      title: formData.title,
      type: formData.type,
      ...(formData.type === 'material' && { content: formData.content }),
      ...(formData.type === 'quiz' && { questions: formData.questions }),
    };

    console.log('Submitted Data:', JSON.stringify(result, null, 2));
  };

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="p-4 bg-white-100 rounded-lg shadow">
        <button
          className="flex items-center gap-2 mb-4 bg-secondary-900 text-white-100 px-3 py-2 rounded hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="size-[1rem]" />
          <span>Kembali</span>
        </button>

        <h2 className="text-xl font-bold text-primary-700 mb-4">Tambah Materi Kursus</h2>

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
          />
          {formData.type === 'material' && (
            <WysiwygInput
              label="Konten Materi"
              name="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            />
          )}
          {formData.type === 'quiz' && (
            <QuizBuilder
              questions={formData.questions}
              setQuestions={(q) => setFormData((prev) => ({ ...prev, questions: q }))}
            />
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary-700 text-white-100 px-4 py-2 rounded hover:bg-primary-600"
            >
              Simpan Materi
            </button>
          </div>
        </form>
      </div>
    </InstructorTemplate>
  );
}
