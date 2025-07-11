import React, { useState } from 'react';
import InstructorTemplate from '../../../template/templateInstructor';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/icons/icon';
import TextInput from '../../../components/form/textInput';
import ImagePicker from '../../../components/form/imagePicker';

// Dummy data (same as profile.jsx)
const dummyProfile = {
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  first_name: 'Banu',
  last_name: 'Pratama',
  username: 'banupra',
  email: 'banu.pratama@email.com',
  telephone: '+628123456789',
  expertise: 'Web Development, React, Node.js',
  about: 'Instruktur berpengalaman di bidang pengembangan web dan teknologi modern.',
  social_media: [
    { type: 'instagram', url: 'https://instagram.com/banupra' },
    { type: 'linkedin', url: 'https://linkedin.com/in/banupra' },
    { type: 'twitter-x', url: 'https://twitter.com/banupra' },
  ],
};

export default function InstructorProfileEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbItems = [{ label: 'Profile', path: location.pathname }];

  const [form, setForm] = useState(dummyProfile);

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

  const handleSocialChange = (idx, value) => {
    setForm((prev) => {
      const updated = [...prev.social_media];
      updated[idx] = { ...updated[idx], url: value };
      return { ...prev, social_media: updated };
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated!\n' + JSON.stringify(form, null, 2));
    navigate(-1);
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

        <form
          className="flex flex-col md:flex-row gap-8 items-stretch" // add items-stretch
          onSubmit={handleSubmit}
        >
          {/* Photo & Social */}
          <div className="flex-shrink-0 w-full md:w-64 flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-100 h-full">
            <ImagePicker
              label="Foto Profil"
              name="photo"
              preview={form.photo}
              onChange={handleImageChange}
              crop
              cropAspect={1}
            />
            <div className="mt-8 flex flex-col gap-2 w-full">
              <p className="text-base">Sosial Media</p>
              {form.social_media.map((sm, idx) => (
                <TextInput
                  key={sm.type}
                  label={sm.type.charAt(0).toUpperCase() + sm.type.slice(1)}
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
            {' '}
            {/* add h-full */}
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
              />
              <TextInput
                label="Keahlian"
                name="expertise"
                value={form.expertise}
                onChange={handleChange}
                placeholder="Masukkan Keahlian khusus yang dimiliki..."
              />
              <TextInput
                textarea
                label="Tentang Instruktur"
                name="about"
                value={form.about}
                onChange={handleChange}
                placeholder="Ceritakan tentang dirimu sebagai instruktur..."
                rows={4}
              />
            </div>
            {/* ...existing code... */}
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
