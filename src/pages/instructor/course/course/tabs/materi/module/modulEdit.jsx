import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorTemplate from '../../../../../../../template/templateInstructor';
import TextInput from '../../../../../../../components/form/textInput';
import Icon from '../../../../../../../components/icons/icon';
import useModuleStore from '../../../../../../../zustand/material/moduleStore';
import useConfirmationModalStore from '../../../../../../../zustand/confirmationModalStore'; // <-- added
import { toast } from 'react-toastify'; // <-- added
import 'react-toastify/dist/ReactToastify.css'; // <-- added

export default function ModulEdit() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
  });

  const { getModuleById, updateModule, loading, error } = useModuleStore();
  const { openModal, closeModal } = useConfirmationModalStore(); // <-- added

  useEffect(() => {
    async function fetchModule() {
      try {
        const module = await getModuleById(moduleId, courseId);
        if (module) {
          setFormData({ title: module.title || '' });
        }
      } catch (e) {
        // Error handled by store
      }
    }
    fetchModule();
    // eslint-disable-next-line
  }, [moduleId, courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Modified: now opens confirmation modal
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      toast.error('Judul modul wajib diisi.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    openModal({
      title: 'Konfirmasi Simpan',
      message: 'Apakah Anda yakin ingin menyimpan perubahan modul?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        try {
          await updateModule({ moduleId, courseId, title: trimmedTitle });
          toast.success('Modul berhasil diperbarui.', { position: 'top-right', autoClose: 3000 });
          navigate(-1);
        } catch (err) {
          toast.error(`Gagal memperbarui modul: ${err.message || 'Terjadi kesalahan.'}`, {
            position: 'top-right',
            autoClose: 3000,
          });
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
          <h4 className="text-black text-lg sm:text-2xl font-bold">Edit modul kursus</h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInput
            label="Judul Modul"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Masukkan judul modul"
            disabled={loading}
            required
          />
          {!formData.title.trim() && (
            <div className="text-red-500 text-sm">Judul modul wajib diisi.</div>
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-fit bg-primary-700 text-white px-4 py-2 rounded-md hover:bg-primary-600"
              disabled={loading || !formData.title.trim()}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </InstructorTemplate>
  );
}
