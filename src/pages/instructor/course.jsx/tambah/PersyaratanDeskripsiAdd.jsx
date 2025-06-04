import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorTemplate from '../../../../template/templateInstructor';
import Icon from '../../../../components/icons/icon';
import TextInput from '../../../../components/form/textInput';
import SelectOption from '../../../../components/form/selectOption';
import useCourseStore from '../../../../zustand/courseStore';
import { toast } from 'react-toastify';

export default function PersyaratanDeskripsiAdd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addCourseInfo = useCourseStore((state) => state.addCourseInfo);

  // State untuk form
  const [form, setForm] = useState({
    content: '',
    type: '',
  });

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle simpan
  const handleSave = async () => {
    try {
      const res = await addCourseInfo({
        id,
        content: form.content,
        type: form.type,
      });
      if (res.status === 'success') {
        toast.success(res.message || 'Berhasil menambah informasi');
        navigate(-1);
      } else {
        toast.error(res.message || 'Gagal menambah informasi');
      }
    } catch (e) {
      toast.error(e.message || 'Terjadi kesalahan');
    }
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
        <div className="text-2xl font-bold">Tambah Persyaratan/Deskripsi</div>
        {/* content add */}
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
        />
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-primary-700 text-white-100 px-6 py-2 rounded-lg shadow hover:bg-primary-800 transition font-medium text-base flex items-center"
          >
            Simpan
          </button>
        </div>
      </div>
    </InstructorTemplate>
  );
}
