import React, { useState, useEffect } from 'react';
import InstructorTemplate from '../../../template/templateInstructor';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/icons/icon';
import TextInput from '../../../components/form/textInput';
import ImagePicker from '../../../components/form/imagePicker';
import useProfileStore from '../../../zustand/profileStore';
import MultipleOption from '../../../components/form/multipleOption';
import { toast } from 'react-toastify';

const SOCIAL_TYPES = [
  { type: 'facebook', label: 'Facebook' },
  { type: 'instagram', label: 'Instagram' },
  { type: 'linkedin', label: 'LinkedIn' },
  { type: 'twitter-x', label: 'Twitter-X' },
];

function getInitialForm(profile) {
  return {
    photo: profile?.photo_profile || '',
    photo_cover: profile?.detail?.photo_cover || '',
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    username: profile?.username || '',
    email: profile?.email || '',
    telephone: profile?.telephone || '',
    expertise: profile?.detail?.expertise || '',
    about: profile?.detail?.about || '',
    social_media: SOCIAL_TYPES.map((s) => {
      const found = profile?.detail?.social_media?.find((sm) => sm.type === s.type);
      return { type: s.type, url: found?.url || '' };
    }),
  };
}

const EXPERTISE_OPTIONS = [
  { value: 'Teknologi & Pemrograman', label: 'Teknologi & Pemrograman' },
  { value: 'Bisnis & Manajemen', label: 'Bisnis & Manajemen' },
  { value: 'Desain & Kreatif', label: 'Desain & Kreatif' },
  { value: 'Pengembangan Diri', label: 'Pengembangan Diri' },
  { value: 'Bahasa', label: 'Bahasa' },
  { value: 'Akademik & Sains', label: 'Akademik & Sains' },
  { value: 'Lingkungan & Keberlanjutan', label: 'Lingkungan & Keberlanjutan' },
  { value: 'Kesehatan & Gaya Hidup', label: 'Kesehatan & Gaya Hidup' },
  { value: 'Seni & Musik', label: 'Seni & Musik' },
  { value: 'Teknik & Industri', label: 'Teknik & Industri' },
];

export default function InstructorProfileEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Profile', path: '/instruktur/profile' },
    { label: 'Edit Profile', path: location.pathname },
  ];

  const { profile, loading, error, fetchProfile, updateProfile } = useProfileStore();
  const [form, setForm] = useState(getInitialForm(profile));

  useEffect(() => {
    if (!profile && !loading) fetchProfile();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setForm(getInitialForm(profile));
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({
      ...prev,
      photo: file || prev.photo,
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({
      ...prev,
      photo_cover: file || prev.photo_cover,
    }));
  };

  const handleSocialChange = (idx, value) => {
    setForm((prev) => {
      const updated = [...prev.social_media];
      updated[idx] = { ...updated[idx], url: value };
      return { ...prev, social_media: updated };
    });
  };

  function getImagePreview(image) {
    if (!image) return '';
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    // Jika sudah berupa URL string
    return image;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('telephone', form.telephone);
    formData.append('expertise', form.expertise);
    formData.append('about', form.about);
    if (form.photo instanceof File) {
      formData.append('photo_profile', form.photo);
    }
    if (form.photo_cover instanceof File) {
      formData.append('photo_cover', form.photo_cover);
    }

    // Kirim hanya social_media yang url-nya terisi, jika semua kosong kirim null
    const filteredSocial = form.social_media.filter((sm) => sm.url && sm.url.trim() !== '');
    if (filteredSocial.length === 0) {
      formData.append('social_media', null);
    } else {
      formData.append('social_media', JSON.stringify(filteredSocial));
    }

    try {
      await updateProfile(formData);
      toast.success('Profile berhasil diperbarui!');
      navigate(-1);
    } catch (err) {
      toast.error('Gagal memperbarui profile: ' + (err?.message || 'Terjadi kesalahan'));
    }
  };

  return (
    <InstructorTemplate breadcrumbItems={breadcrumbItems}>
      <div className="w-full bg-white rounded-md flex flex-col p-6 shadow-md">
        {/* Back Button */}
        <button
          className="w-fit flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
          <span>Kembali</span>
        </button>

        <h2 className="text-2xl font-bold text-primary-700 mb-6">Edit Profile Instruktur</h2>

        {/* Photo Cover at the Top */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow border border-gray-100">
          <ImagePicker
            label="Foto Cover Profile"
            name="photo_cover"
            preview={getImagePreview(form.photo_cover)}
            onChange={handleCoverImageChange}
            crop
            cropAspect={3}
          />
        </div>

        <form className="flex flex-col md:flex-row gap-8 items-stretch" onSubmit={handleSubmit}>
          {/* Photo & Social */}
          <div className="flex-shrink-0 w-full md:w-64 flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-100 h-full">
            <ImagePicker
              label="Foto Profil"
              name="photo"
              preview={getImagePreview(form.photo)}
              onChange={handleImageChange}
              crop
              cropAspect={1}
            />
            <div className="mt-8 flex flex-col gap-2 w-full">
              <p className="text-base">Sosial Media</p>
              {form.social_media.map((sm, idx) => (
                <TextInput
                  key={sm.type}
                  label={SOCIAL_TYPES.find((s) => s.type === sm.type)?.label || sm.type}
                  name={`social_${sm.type}`}
                  value={sm.url}
                  onChange={(e) => handleSocialChange(idx, e.target.value)}
                  placeholder={`URL ${sm.type}`}
                />
              ))}
            </div>
          </div>

          {/* Detail Info */}
          <div className="flex-1 grid grid-cols-1 gap-6 h-full">
            <div className="bg-white rounded-lg p-6 shadow border space-y-4">
              <TextInput
                label="First Name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder={'Masukkan nama depan Anda...'}
                required
              />
              <TextInput
                label="Last Name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder={'Masukkan nama belakang Anda...'}
                required
              />
              <TextInput
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder={'Masukkan username Anda...'}
                required
              />
              <TextInput
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder={'Masukkan email Anda...'}
                required
              />
              <TextInput
                label="Telepon"
                name="telephone"
                value={form.telephone || ''}
                onChange={handleChange}
                placeholder="Masukkan nomor telepon Anda..."
                type="number"
              />
              <MultipleOption
                label="Keahlian"
                name="expertise"
                value={form.expertise}
                onChange={handleChange}
                options={EXPERTISE_OPTIONS}
                placeholder="Pilih keahlian khusus yang dimiliki..."
              />
              <TextInput
                textarea
                label="Tentang Saya"
                name="about"
                value={form.about}
                onChange={handleChange}
                placeholder="Ceritakan tentang dirimu..."
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 transition-colors font-semibold"
              >
                <Icon type="save" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </InstructorTemplate>
  );
}
