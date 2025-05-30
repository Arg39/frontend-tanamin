import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorTemplate from '../../../../template/templateInstructor';
import Icon from '../../../../components/icons/icon';
import useCourseStore from '../../../../zustand/courseStore';
import ImagePicker from '../../../../components/form/imagePicker';
import TextInput from '../../../../components/form/textInput';
import SelectOption from '../../../../components/form/selectOption';

const LEVEL_OPTIONS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

export default function InformasiutamaEdit() {
  const { id, tab } = useParams();
  const navigate = useNavigate();
  const {
    fetchCourseDetailByTab,
    courseDetailByTab,
    courseDetailLoading,
    courseDetailError,
    updateCourseDetail,
  } = useCourseStore();

  const [form, setForm] = useState({
    title: '',
    level: '',
    price: '',
    requirement: '',
    description: '',
    detail: '',
    image_video: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch data awal
  useEffect(() => {
    if (id && tab) {
      fetchCourseDetailByTab({ tab, id });
    }
  }, [id, tab, fetchCourseDetailByTab]);

  // Set form dari data store
  useEffect(() => {
    if (courseDetailByTab) {
      setForm({
        title: courseDetailByTab.title || '',
        level: courseDetailByTab.level || '',
        price: courseDetailByTab.price || '',
        requirement: courseDetailByTab.requirement || '',
        description: courseDetailByTab.description || '',
        detail: courseDetailByTab.detail || '',
        image_video: courseDetailByTab.image_video || '',
      });
      setImagePreview(courseDetailByTab.image_video || '');
    }
  }, [courseDetailByTab]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image_video: file }));
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
      let payload;
      if (form.image_video instanceof File) {
        payload = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          payload.append(key, value);
        });
      } else {
        payload = { ...form };
      }
      await updateCourseDetail({ id, tab, data: payload });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 2000);
    } catch (err) {
      setSubmitError('Gagal menyimpan perubahan.');
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
        <div className="p-8 text-red-500">{courseDetailError}</div>
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
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white-100 p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
        <button
          className="w-fit flex items-center gap-2 bg-secondary-900 text-white-100 px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
          onClick={() => navigate(-1)}
          type="button"
        >
          <Icon type="arrow-left" className="size-[1rem] text-white-100" />
          Kembali
        </button>
        <h1 className="text-2xl font-bold mb-4 text-primary-900">Edit Informasi Utama</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Nama Kursus */}
          <TextInput
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
              type="text"
              value={courseDetailByTab.instructor?.full_name || ''}
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
          />
          {/* Harga */}
          <div>
            <label className="mb-2 text-sm font-medium text-gray-700 block">Harga</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
              min={0}
              required
              placeholder="Masukkan harga"
            />
          </div>
          {/* Persyaratan */}
          <div>
            <label className="mb-2 text-sm font-medium text-gray-700 block">Persyaratan</label>
            <textarea
              name="requirement"
              value={form.requirement}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
              rows={2}
              placeholder="Masukkan persyaratan"
            />
          </div>
          {/* Deskripsi */}
          <div>
            <label className="mb-2 text-sm font-medium text-gray-700 block">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
              rows={3}
              placeholder="Masukkan deskripsi"
            />
          </div>
          {/* Gambar */}
          <ImagePicker
            label="Gambar"
            name="image_video"
            onChange={handleImageChange}
            preview={form.image_video instanceof File ? imagePreview : form.image_video}
          />
          {/* Detail yang akan dipelajari */}
          <div>
            <label className="mb-2 text-sm font-medium text-gray-700 block">
              Detail yang akan dipelajari
            </label>
            <textarea
              name="detail"
              value={form.detail}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
              rows={3}
              placeholder="Masukkan detail yang akan dipelajari"
            />
          </div>
          {/* Submit */}
          <div className="flex gap-4 items-center">
            <button
              type="submit"
              className="bg-primary-700 text-white-100 px-6 py-2 rounded hover:bg-primary-800 font-semibold"
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            {submitSuccess && (
              <span className="text-green-600 font-semibold">Berhasil disimpan!</span>
            )}
            {submitError && <span className="text-red-600 font-semibold">{submitError}</span>}
          </div>
        </form>
      </div>
    </InstructorTemplate>
  );
}
