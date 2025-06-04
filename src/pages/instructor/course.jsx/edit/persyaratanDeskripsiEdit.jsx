import { useEffect, useState } from 'react';
import InstructorTemplate from '../../../../template/templateInstructor';
import Icon from '../../../../components/icons/icon';
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from '../../../../components/form/textInput';
import SelectOption from '../../../../components/form/selectOption';
import useCourseStore from '../../../../zustand/courseStore';
import { toast } from 'react-toastify';

export default function PersyaratanDeskripsiEdit() {
  const navigate = useNavigate();
  const { id, id2 } = useParams();
  const { courseInfo, fetchCourseInfo, updateCourseInfo, courseInfoLoading } = useCourseStore();
  const [form, setForm] = useState({
    content: '',
    type: '',
  });
  const [loading, setLoading] = useState(false);

  // Find info by id2
  useEffect(() => {
    if (id) fetchCourseInfo({ id });
  }, [id, fetchCourseInfo]);

  useEffect(() => {
    if (courseInfo && id2) {
      let found = null;
      if (courseInfo.prerequisites) {
        found = courseInfo.prerequisites.find((item) => String(item.id) === String(id2));
        if (found) setForm({ content: found.content, type: 'prerequisite' });
      }
      if (!found && courseInfo.descriptions) {
        found = courseInfo.descriptions.find((item) => String(item.id) === String(id2));
        if (found) setForm({ content: found.content, type: 'description' });
      }
    }
  }, [courseInfo, id2]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateCourseInfo({
        id,
        id_info: id2,
        content: form.content,
        type: form.type,
      });
      if (res.status === 'success') {
        toast.success(res.message || 'Berhasil mengupdate informasi');
        navigate(-1);
      } else {
        toast.error(res.message || 'Gagal mengupdate informasi');
      }
    } catch (e) {
      toast.error(e.message || 'Terjadi kesalahan');
    }
    setLoading(false);
  };

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white-100 p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
        <button
          className="flex w-fit items-center gap-2 bg-secondary-900 text-white-100 px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="size-[1rem] text-white-100" />
          Kembali
        </button>
        <div className="text-2xl font-bold">Edit Persyaratan/Deskripsi {id2}</div>
        {courseInfoLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <TextInput
              type="text"
              label="Informasi"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Masukkan informasi kursus"
            />
            <SelectOption
              label="Tipe informasi"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={[
                { value: 'prerequisite', label: 'Persyaratan' },
                { value: 'description', label: 'Deskripsi' },
              ]}
              placeholder="Pilih tipe persyaratan"
              disabled
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSave}
                className="bg-primary-700 text-white-100 px-6 py-2 rounded-lg shadow hover:bg-primary-800 transition font-medium text-base flex items-center"
                disabled={loading}
              >
                Simpan
              </button>
            </div>
          </>
        )}
      </div>
    </InstructorTemplate>
  );
}
