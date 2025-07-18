import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../template/templateAdmin';
import Icon from '../../../components/icons/icon';
import TextInput from '../../../components/form/textInput';
import Button from '../../../components/button/button';
import useConfirmationModalStore from '../../../zustand/confirmationModalStore';
import useCategoryStore from '../../../zustand/categoryStore';
import SelectOption from '../../../components/form/selectOption';
import useInstructorStore from '../../../zustand/instructorStore';
import useCourseStore from '../../../zustand/courseStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CourseAdd() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Kursus', path: '/admin/kursus' },
    { label: 'Tambah Kursus', path: location.pathname },
  ];

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    id_category: '',
    id_instructor: '',
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const { openModal, closeModal } = useConfirmationModalStore();
  const { fetchCategoryOptions } = useCategoryStore();
  const { fetchInstructorOptions } = useInstructorStore();
  const { addCourse } = useCourseStore();

  useEffect(() => {
    const loadCategories = async () => {
      const options = await fetchCategoryOptions();
      setCategoryOptions(options);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadInstructors = async () => {
      const options = await fetchInstructorOptions();
      setInstructorOptions(options);
    };
    loadInstructors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push('Judul kursus');
    if (!formData.id_category) errors.push('Kategori terkait');
    if (!formData.id_instructor) errors.push('Instruktur penanggung jawab');
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(`Gagal menambah kursus: ${errors.join(', ')} masih kosong.`, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    openModal({
      title: 'Konfirmasi Simpan',
      message: 'Apakah Anda yakin ingin menyimpan kursus ini?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        try {
          const result = await addCourse({
            title: formData.title,
            id_category: formData.id_category,
            id_instructor: formData.id_instructor,
          });
          navigate('/admin/kursus');
        } catch (err) {
          toast.error('Gagal menambah kursus: ' + err.message, {
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
    <AdminTemplate activeNav="kursus" breadcrumbItems={breadcrumbItems}>
      <ToastContainer />
      <div className="wf-full bg-white p-6 rounded-lg shadow-md">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
          <span>Kembali</span>
        </button>
        <h2 className="text-2xl font-bold">Tambah Kursus</h2>
        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4">
          <TextInput
            label="Judul Kursus"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Masukkan judul kursus"
          />
          <SelectOption
            label="Kategori terkait"
            name="id_category"
            value={formData.id_category}
            onChange={handleInputChange}
            options={categoryOptions}
            placeholder="Pilih kategori yang berkaitan dengan kursus"
          />
          <SelectOption
            label="Instruktur penanggung jawab"
            name="id_instructor"
            value={formData.id_instructor}
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
