import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../../../template/templateAdmin';
import Icon from '../../../../../components/icons/icon';
import TextInput from '../../../../../components/form/textInput';
import ImagePicker from '../../../../../components/form/imagePicker';
import Button from '../../../../../components/button/button';
import useConfirmationModalStore from '../../../../../zustand/confirmationModalStore';
import useCategoryStore from '../../../../../zustand/categoryStore';
import { toast } from 'react-toastify';

export default function CategoryAdd() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Kategori', path: '/admin/kategori' },
    { label: 'Tambah Kategori', path: location.pathname },
  ];

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    image: null,
  });

  const { openModal, closeModal } = useConfirmationModalStore();
  const { addCategory } = useCategoryStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    openModal({
      title: 'Konfirmasi Simpan',
      message: 'Apakah Anda yakin ingin menyimpan kategori ini?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('image', formData.image);

        const result = await addCategory(formDataToSend);
        console.log(result);
        if (result.success) {
          toast.success('Kategori berhasil ditambahkan');
          navigate('/admin/kategori');
        } else {
          toast.error(`Gagal menambahkan kategori: ${result.message}`);
        }
      },
      onCancel: () => {
        closeModal();
      },
    });
  };

  return (
    <AdminTemplate activeNav="kategori" breadcrumbItems={breadcrumbItems}>
      <div className="wf-full bg-white p-6 rounded-lg shadow-md">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
          <span>Kembali</span>
        </button>
        <h2 className="text-2xl font-bold">Tambah Kategori</h2>
        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4">
          <TextInput
            label="Nama Kategori"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Masukkan nama kategori"
          />
          <ImagePicker
            label="Gambar Kategori"
            name="image"
            onChange={handleFileChange}
            crop={true}
            cropAspect={16 / 9}
          />
          <div className="w-full flex justify-end">
            <Button type="submit" variant="form">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </AdminTemplate>
  );
}
