import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorTemplate from '../../../../../template/templateInstructor';
import TextInput from '../../../../../components/form/textInput';
import SelectOption from '../../../../../components/form/selectOption';
import Icon from '../../../../../components/icons/icon';
import useModuleStore from '../../../../../zustand/material/moduleStore';

export default function ModulAdd() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
  });

  const { addModule, loading, error } = useModuleStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addModule({ courseId: courseId, title: formData.title });
      navigate(-1);
    } catch (err) {
      // Error sudah di-handle oleh store, bisa tampilkan pesan jika mau
    }
  };

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
        <div>
          <button
            className="flex items-center gap-2 bg-secondary-900 text-white px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
            onClick={() => {
              navigate(-1);
            }}
          >
            <Icon type="arrow-left" className="size-[1rem] text-white" />
            <span className="text-white">Kembali</span>
          </button>
          <h4 className="text-primary-700 text-lg sm:text-2xl font-bold">Tambah modul kursus</h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInput
            label="Judul Modul"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Masukkan judul modul"
            disabled={loading}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-fit bg-primary-700 text-white px-4 py-2 rounded-md hover:bg-primary-600"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan Modul'}
            </button>
          </div>
        </form>
      </div>
    </InstructorTemplate>
  );
}
