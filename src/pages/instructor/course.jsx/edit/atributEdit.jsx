import { useEffect, useState } from 'react';
import InstructorTemplate from '../../../../template/templateInstructor';
import Icon from '../../../../components/icons/icon';
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from '../../../../components/form/textInput';
import SelectOption from '../../../../components/form/selectOption';
import useCourseAttributeStore from '../../../../zustand/courseAttributeStore'; // <-- use the correct store
import { toast } from 'react-toastify';

export default function CourseAttributeEdit() {
  const navigate = useNavigate();
  const { courseId, attributeId } = useParams();
  const { attribute, attributeLoading, fetchSingleAttribute, updateAttribute } =
    useCourseAttributeStore();
  const [form, setForm] = useState({
    content: '',
    type: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch single attribute by courseId and attributeId
  useEffect(() => {
    if (courseId && attributeId) {
      fetchSingleAttribute({ courseId, attributeId });
    }
  }, [courseId, attributeId, fetchSingleAttribute]);

  // Set form state when attribute is loaded
  useEffect(() => {
    if (attribute) {
      setForm({
        content: attribute.content || '',
        type: attribute.type || '',
      });
    }
  }, [attribute]);

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
      const res = await updateAttribute({
        courseId,
        attributeId,
        content: form.content,
        type: form.type,
      });
      if (res.status === 'success') {
        toast.success(res.message || 'Berhasil mengupdate atribut');
        navigate(-1);
      } else {
        toast.error(res.message || 'Gagal mengupdate atribut');
      }
    } catch (e) {
      toast.error(e.message || 'Terjadi kesalahan');
    }
    setLoading(false);
  };

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
        <button
          className="flex w-fit items-center gap-2 bg-secondary-900 text-white px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="w-4 h-4" />
          Kembali
        </button>
        <div className="text-2xl font-bold">Edit Atribut Kursus</div>
        {attributeLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <TextInput
              type="text"
              label="atribut"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Masukkan atribut kursus"
            />
            <SelectOption
              label="Tipe atribut"
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
                className="bg-primary-700 text-white px-6 py-2 rounded-lg shadow hover:bg-primary-800 transition font-medium text-base flex items-center"
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
