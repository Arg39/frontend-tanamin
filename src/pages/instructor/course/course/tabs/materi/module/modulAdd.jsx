import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorTemplate from '../../../../../../../template/templateInstructor';
import TextInput from '../../../../../../../components/form/textInput';
import SelectOption from '../../../../../../../components/form/selectOption';
import Icon from '../../../../../../../components/icons/icon';
import useModuleStore from '../../../../../../../zustand/material/moduleStore';
import useConfirmationModalStore from '../../../../../../../zustand/confirmationModalStore';
import { toast } from 'react-toastify';

export default function ModulAdd() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
  });

  const { addModule, loading, error } = useModuleStore();
  const { openModal, closeModal } = useConfirmationModalStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    openModal({
      title: 'Konfirmasi Simpan',
      message: 'Apakah Anda yakin ingin menyimpan modul ini?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        try {
          await addModule({ courseId: courseId, title: formData.title });
          toast.success('Modul berhasil ditambahkan');
          navigate(-1);
        } catch (err) {
          toast.error('Gagal menambahkan modul');
        }
      },
      onCancel: () => {
        closeModal();
      },
    });
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
          <h4 className="text-black text-lg sm:text-2xl font-bold">Tambah modul kursus</h4>
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
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </InstructorTemplate>
  );
}
