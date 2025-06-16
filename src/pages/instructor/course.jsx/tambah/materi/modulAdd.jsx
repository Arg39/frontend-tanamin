import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorTemplate from '../../../../../template/templateInstructor';
import TextInput from '../../../../../components/form/textInput';
import SelectOption from '../../../../../components/form/selectOption';
import Icon from '../../../../../components/icons/icon';

export default function ModulAdd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    jenisPembelajaran: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simpan data modul (formData) ke server atau state management
    console.log('Data modul:', formData);
    // Navigasi kembali setelah berhasil menyimpan
    navigate(-1);
  };

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white-100 p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
        <div>
          <button
            className="flex items-center gap-2 bg-secondary-900 text-white-100 px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
            onClick={() => {
              navigate(-1);
            }}
          >
            <Icon type="arrow-left" className="size-[1rem] text-white-100" />
            <span className="text-white-100">Kembali</span>
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
          />
          <SelectOption
            label="Jenis Pembelajaran"
            name="jenisPembelajaran"
            value={formData.jenisPembelajaran}
            onChange={handleChange}
            options={[
              { value: 'material', label: 'Materi' },
              { value: 'quiz', label: 'Quiz' },
            ]}
            placeholder="Pilih jenis pembelajaran"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-fit bg-primary-700 text-white-100 px-4 py-2 rounded-md hover:bg-primary-600"
            >
              Simpan Modul
            </button>
          </div>
        </form>
      </div>
    </InstructorTemplate>
  );
}
