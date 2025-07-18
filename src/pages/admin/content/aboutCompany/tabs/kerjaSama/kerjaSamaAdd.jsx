import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../../../../template/templateAdmin';
import Icon from '../../../../../../components/icons/icon';
import ImagePicker from '../../../../../../components/form/imagePicker';
import TextInput from '../../../../../../components/form/textInput';
import { toast } from 'react-toastify';
import useConfirmationModalStore from '../../../../../../zustand/confirmationModalStore';
import useCompanyPartnershipStore from '../../../../../../zustand/companyPartnershipStore';

export default function KerjaSamaAdd() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal, closeModal } = useConfirmationModalStore();
  const { addPartnership } = useCompanyPartnershipStore();

  const breadcrumbItems = [
    { label: 'Tentang Perusahaan', path: '/admin/tentang-perusahaan/kerja-sama' },
    { label: 'Tambah Kerja Sama Perusahaan', path: location.pathname },
  ];

  const [form, setForm] = useState({
    logo: null,
    partner_name: '',
    website_url: '',
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
      message: 'Apakah Anda yakin ingin menyimpan data kerja sama ini?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        try {
          await addPartnership(form); // Panggil fungsi dari store
          toast.success('Kerja sama perusahaan berhasil ditambahkan');
          navigate(-1);
        } catch (error) {
          toast.error(error.message || 'Gagal menyimpan kerja sama perusahaan');
        }
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
              Tambah Kerja Sama Perusahaan
            </h2>
          </div>

          {/* content */}
          <div className="flex flex-col gap-4">
            <ImagePicker
              label="Logo"
              name="logo"
              onChange={handleChange}
              preview={form.logo}
            />
            <TextInput
              label="Nama Partner"
              name="partner_name"
              value={form.partner_name}
              onChange={handleChange}
              placeholder="Masukkan nama partner"
              required
            />
            <TextInput
              label="Website"
              name="website_url"
              value={form.website_url}
              onChange={handleChange}
              placeholder="Masukkan URL website (opsional)"
              type="url"
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
