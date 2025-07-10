import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorTemplate from '../../../../template/templateInstructor';
import Icon from '../../../../components/icons/icon';
import useCourseStore from '../../../../zustand/courseStore';
import ImagePicker from '../../../../components/form/imagePicker';
import TextInput from '../../../../components/form/textInput';
import SelectOption from '../../../../components/form/selectOption';
import WysiwygInput from '../../../../components/form/wysiwygInput';
import useAuthStore from '../../../../zustand/authStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Pemula' },
  { value: 'intermediate', label: 'Menengah' },
  { value: 'advance', label: 'Mahir' },
];

export default function RingkasanEdit() {
  const role = useAuthStore((state) => state.user.role);
  const { id } = useParams();
  const tab = 'overview';
  const navigate = useNavigate();
  const {
    fetchCourseDetailByTab,
    courseDetailByTab,
    courseDetailLoading,
    courseDetailError,
    updateCourseDetail,
  } = useCourseStore();
  const token = useAuthStore((state) => state.token);

  const [form, setForm] = useState({
    title: '',
    level: '',
    requirement: '',
    description: '',
    detail: '',
    image: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const wysiwygRef = useRef(null);

  // Fetch data awal
  useEffect(() => {
    if (id && tab) {
      fetchCourseDetailByTab({ tab, id });
    }
  }, [id, tab, fetchCourseDetailByTab]);

  useEffect(() => {
    if (courseDetailByTab) {
      setForm({
        title: courseDetailByTab.title || '',
        level: courseDetailByTab.level || '',
        price: courseDetailByTab.price || '',
        requirement: courseDetailByTab.requirement || '',
        description: courseDetailByTab.description || '',
        detail: courseDetailByTab.detail || '',
        image: courseDetailByTab.image || '',
      });
      setImagePreview(courseDetailByTab.image || '');
    }
  }, [courseDetailByTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const finalDetail = await wysiwygRef.current.uploadLocalImages(token);

      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('level', form.level);
      formData.append('price', form.price);
      formData.append('requirement', form.requirement);
      formData.append('description', form.description);
      formData.append('detail', finalDetail);
      if (form.image instanceof File) {
        formData.append('image', form.image);
      }
      formData.append('status', 'edited');

      // Call updateCourseSummary from store
      const res = await updateCourseDetail({
        id,
        data: formData,
      });

      if (res.status === 'success') {
        toast.success(res.message || 'Berhasil memperbarui ringkasan!');
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 2000);
        navigate(-1);
      } else {
        toast.error(res.message || 'Gagal memperbarui ringkasan');
        setSubmitError(res.message || 'Gagal memperbarui ringkasan');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Gagal menyimpan data');
      setSubmitError(err.message || 'Gagal menyimpan data');
    } finally {
      setSubmitting(false);
    }
  };

  if (courseDetailLoading) {
    return (
      <InstructorTemplate activeNav="kursus">
        <div className="p-8 text-center">Loading...</div>
      </InstructorTemplate>
    );
  }
  if (courseDetailError) {
    return (
      <InstructorTemplate activeNav="kursus">
        <div className="p-8 text-red-500">{submitError}</div>
      </InstructorTemplate>
    );
  }
  if (!courseDetailByTab) {
    return (
      <InstructorTemplate activeNav="kursus">
        <div className="p-8 text-gray-500">Data tidak ditemukan</div>
      </InstructorTemplate>
    );
  }

  return (
    <div>
      <div className="w-full bg-white p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
        <button
          className="w-fit flex items-center gap-2 bg-secondary-900 text-white px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
          onClick={() => navigate(-1)}
          type="button"
        >
          <Icon type="arrow-left" className="size-[1rem] text-white" />
          Kembali
        </button>
        <h1 className="text-2xl font-bold mb-4 text-primary-900">Edit Ringkasan</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Nama Kursus */}
          <TextInput
            type="text"
            label="Nama Kursus"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Masukkan nama kursus"
          />
          {/* Nama Instruktur */}
          <div>
            <label className="mb-2 text-sm font-medium text-gray-700 block">Nama Instruktur</label>
            <input
              value={courseDetailByTab.instructor?.full_name || ''}
              className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-100"
              readOnly
              tabIndex={-1}
            />
          </div>
          {/* Nama Instruktur */}
          <div>
            <label className="mb-2 text-sm font-medium text-gray-700 block">Kategori</label>
            <input
              value={courseDetailByTab.category?.name || ''}
              className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-100"
              readOnly
              tabIndex={-1}
            />
          </div>
          {/* Level */}
          <SelectOption
            label="Level"
            name="level"
            value={form.level}
            onChange={handleChange}
            options={LEVEL_OPTIONS}
            placeholder="Pilih Level"
            disabled={role === 'admin'}
          />
          {/* Harga */}
          <div>
            <label className="mb-2 text-sm font-medium text-gray-700 block">Harga</label>
            <TextInput
              name="price"
              value={String(form.price ?? '')}
              onChange={handleChange}
              placeholder="Masukkan harga"
              min={0}
              isPrice
              required
              disabled={role === 'instructor'}
            />
          </div>
          {/* Gambar */}
          <ImagePicker
            label="Gambar"
            name="image"
            onChange={handleImageChange}
            preview={form.image instanceof File ? imagePreview : form.image}
            crop={true}
            cropAspect={16 / 9}
            disabled={role === 'admin'}
          />
          {/* Detail yang akan dipelajari */}
          <div>
            <label className="mb-2 text-sm font-medium text-gray-700 block">
              Detail yang akan dipelajari
            </label>
            <WysiwygInput
              ref={wysiwygRef}
              name="detail"
              value={form.detail}
              onChange={(e) => setForm((prev) => ({ ...prev, detail: e.target.value }))}
              placeholder="Masukkan detail yang akan dipelajari"
              disabled={role === 'admin'}
            />
          </div>
          {/* Submit */}
          <div className="flex gap-4 items-center justify-end">
            <button
              type="submit"
              className="bg-primary-700 text-white px-6 py-2 rounded hover:bg-primary-800 font-semibold"
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            {submitSuccess && (
              <span className="text-green-600 font-semibold">Berhasil disimpan!</span>
            )}
            {/* {submitError && <span className="text-red-600 font-semibold">{submitError}</span>} */}
          </div>
        </form>
      </div>
    </div>
  );
}
