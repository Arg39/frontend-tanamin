import React, { useState } from 'react';
import AdminTemplate from '../../../../../../template/templateAdmin';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../../../../components/icons/icon';
import ImagePicker from '../../../../../../components/form/imagePicker';
import TextInput from '../../../../../../components/form/textInput';
import useCompanyActivityStore from '../../../../../../zustand/companyActivityStore';
import { toast } from 'react-toastify';
import useConfirmationModalStore from '../../../../../../zustand/confirmationModalStore';

export default function KegiatanPerusahaanAdd() {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Tentang Perusahaan', path: '/admin/tentang-perusahaan' },
    { label: 'Tambah Kegiatan Perusahaan', path: location.pathname },
  ];
  const { loading, error, notFound, addActivity } = useCompanyActivityStore();
  const { openModal, closeModal } = useConfirmationModalStore();

  const [form, setForm] = useState({
    image: null,
    title: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    openModal({
      title: 'Konfirmasi Simpan',
      message: 'Apakah Anda yakin ingin menyimpan kegiatan perusahaan dengan data ini?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        try {
          await addActivity({
            image: form.image,
            title: form.title,
            description: form.description,
          });
          toast.success('Kegiatan perusahaan berhasil ditambahkan');
        } catch (error) {
          toast.error('Error saving company profile:', error);
        }
        navigate(-1);
      },
      onCancel: () => {
        closeModal();
      },
    });
  };

  return (
    <AdminTemplate activeNav={'tentang perusahaan'} breadcrumbItems={breadcrumbItems}>
      <form onSubmit={handleSubmit}>
        <div className="w-full bg-white rounded-md flex flex-col p-3 sm:p-6 shadow-md">
          <button
            type="button"
            className="w-fit flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
            onClick={() => navigate(-1)}
          >
            <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
            <span>Kembali</span>
          </button>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg sm:text-2xl font-bold text-primary-700 mb-0">
              Tambah Kegiatan Perusahaan
            </h2>
          </div>

          {/* content */}
          <div className="flex flex-col gap-4">
            <ImagePicker
              label="Gambar"
              name="image"
              onChange={handleChange}
              preview={form.image}
              crop={true}
              cropAspect={16 / 9}
            />
            <TextInput
              label="Judul"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Masukkan judul kegiatan"
              required
            />
            <TextInput
              label="Deskripsi"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Masukkan deskripsi kegiatan"
              textarea
              rows={5}
              required
            />
          </div>
          <div className="wfull flex justify-end">
            <button
              type="submit"
              className="w-fit mt-4 bg-primary-700 hover:bg-primary-800 text-white px-6 py-2 rounded-md font-semibold"
            >
              Simpan
            </button>
          </div>
        </div>
      </form>
    </AdminTemplate>
  );
}
