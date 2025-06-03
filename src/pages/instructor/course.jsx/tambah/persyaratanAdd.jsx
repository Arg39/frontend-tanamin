import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorTemplate from '../../../../template/templateInstructor';
import Icon from '../../../../components/icons/icon';
import TextInput from '../../../../components/form/textInput';
import SelectOption from '../../../../components/form/selectOption';

export default function PersyaratanAdd() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk form
  const [form, setForm] = useState({
    title: '',
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
  const handleSave = () => {
    console.log('Data yang disimpan:', form);
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
        <div className="text-2xl font-bold">Tambah Persyaratan</div>
        {/* content add */}
        <TextInput
          type="text"
          label="Judul"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Masukkan persyaratan kursus"
        />
        <SelectOption
          label="Tipe"
          name="type"
          value={form.type}
          onChange={handleChange}
          options={[
            { value: 'persyaratan', label: 'Persyaratan' },
            { value: 'deskripsi', label: 'Deskripsi' },
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
