import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';
import Icon from '../../../../components/icons/icon';
import TextInput from '../../../../components/form/textInput';
import ImagePicker from '../../../../components/form/imagePicker';
import Button from '../../../../components/button/button';
import useConfirmationModalStore from '../../../../zustand/confirmationModalStore';
import useCategoryStore from '../../../../zustand/categoryStore';

export default function CategoryEdit() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Kategori', path: '/admin/kategori' },
    { label: 'Edit Kategori', path: location.pathname },
  ];

  const { id } = useParams();
  const navigate = useNavigate();
  const { openModal, closeModal } = useConfirmationModalStore();
  const { fetchCategoryById, updateCategory } = useCategoryStore();

  const [formData, setFormData] = useState({
    name: '',
    image: null,
    existingImage: null,
  });

  useEffect(() => {
    const loadCategory = async () => {
      const category = await fetchCategoryById(id);
      if (category) {
        setFormData({
          name: category.name,
          image: null,
          existingImage: category.image,
        });
      }
    };
    loadCategory();
  }, [id, fetchCategoryById]);

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
      message: 'Apakah Anda yakin ingin menyimpan perubahan kategori ini?',
      variant: 'primary',
      onConfirm: () => {
        closeModal();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }

        updateCategory(id, formDataToSend).then(() => {
          navigate('/admin/kategori');
        });
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
        <h2 className="text-2xl font-bold">Edit Kategori</h2>
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
            preview={formData.existingImage}
            crop={true}
            cropAspect={16 / 9}
          />
          <div className="w-full flex justify-end">
            <Button type="submit" variant="form">
              Simpan perubahan
            </Button>
          </div>
        </form>
      </div>
    </AdminTemplate>
  );
}
