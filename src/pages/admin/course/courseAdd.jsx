import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../template/templateAdmin';
import Icon from '../../../components/icons/icon';
import TextInput from '../../../components/form/textInput';
import Button from '../../../components/button/button';
import useConfirmationModalStore from '../../../zustand/confirmationModalStore';
import useCategoryStore from '../../../zustand/categoryStore';
import SelectOption from '../../../components/form/selectOption';
import useInstructorStore from '../../../zustand/instructorStore';

export default function CourseAdd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    category: '',
    instructor: '', // add instructor to formData
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const { openModal, closeModal } = useConfirmationModalStore();
  const { addCategory, fetchCategoryOptions } = useCategoryStore();
  const { fetchInstructorSelectOptions } = useInstructorStore();

  useEffect(() => {
    const loadCategories = async () => {
      const options = await fetchCategoryOptions();
      setCategoryOptions(options);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadInstructors = async () => {
      const options = await fetchInstructorSelectOptions();
      setInstructorOptions(options);
    };
    loadInstructors();
  }, []);

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
      onConfirm: () => {
        closeModal();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('image', formData.image);

        addCategory(formDataToSend).then(() => {
          // navigate('/admin/kategori');
          console.log(formDataToSend);
        });
      },
      onCancel: () => {
        closeModal();
        console.log('Aksi dibatalkan');
      },
    });
  };

  return (
    <AdminTemplate activeNav="kursus">
      <div className="wf-full bg-white-100 p-6 rounded-lg shadow-md">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 bg-secondary-900 text-white-100 px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="size-4" color="currentColor" />
          <span>Kembali</span>
        </button>
        <h2 className="text-2xl font-bold">Tambah Kursus</h2>
        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4">
          <TextInput
            label="Nama Kursus"
            name="name-course"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Masukkan nama kursus"
          />
          <SelectOption
            label="Kategori terkait"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={categoryOptions}
            placeholder="Pilih kategori yang berkaitan dengan kursus"
          />
          <SelectOption
            label="Instruktur penanggung jawab"
            name="instructor"
            value={formData.instructor}
            onChange={handleInputChange}
            options={instructorOptions}
            placeholder="Pilih instruktur yang akan bertanggung jawab"
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
