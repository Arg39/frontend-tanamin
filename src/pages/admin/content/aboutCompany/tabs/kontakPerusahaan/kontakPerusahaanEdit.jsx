import React, { useState, useEffect } from 'react';
import AdminTemplate from '../../../../../../template/templateAdmin';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../../../../components/icons/icon';
import TextInput from '../../../../../../components/form/textInput';
import { toast } from 'react-toastify';
import useCompanyContactStore from '../../../../../../zustand/companyContactStore'; // import store

export default function AdminKontakPerusahaanEdit() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Tentang Perusahaan', path: '/admin/tentang-perusahaan' },
    { label: 'Edit Tentang Perusahaan', path: location.pathname },
  ];
  const navigate = useNavigate();

  // Get zustand actions and state
  const fetchContact = useCompanyContactStore((state) => state.fetchContact);
  const updateContact = useCompanyContactStore((state) => state.updateContact);
  const loading = useCompanyContactStore((state) => state.loading);
  const contact = useCompanyContactStore((state) => state.contact);

  const [form, setForm] = useState({
    telephone: '',
    email: '',
    address: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      linkedin: '',
      twitter: '',
    },
  });

  useEffect(() => {
    const getContact = async () => {
      try {
        const data = await fetchContact();
        setForm({
          telephone: data.telephone || '',
          email: data.email || '',
          address: data.address || '',
          socialMedia: {
            instagram: data.social_media?.instagram || '',
            facebook: data.social_media?.facebook || '',
            linkedin: data.social_media?.linkedin || '',
            twitter: data.social_media?.twitter || '',
          },
        });
      } catch (err) {
        toast.error(`Gagal mengambil data: ${err.message}`);
      }
    };
    getContact();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const socialMediaTypes = ['instagram', 'facebook', 'linkedin', 'twitter'];
    if (socialMediaTypes.includes(name)) {
      setForm((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      telephone: form.telephone,
      email: form.email,
      address: form.address,
      social_media: { ...form.socialMedia },
    };
    try {
      const res = await updateContact(payload);
      if (res.status === 'success') {
        toast.success('Data berhasil disimpan!');
        navigate(-1);
      } else {
        toast.error(`Gagal menyimpan data: ${res.message || 'Unknown error'}`);
      }
    } catch (err) {
      toast.error(`Gagal menyimpan data: ${err.message}`);
    }
  };

  return (
    <AdminTemplate activeNav={'tentang perusahaan'} breadcrumbItems={breadcrumbItems}>
      <form
        className="w-full bg-white rounded-md flex flex-col p-3 sm:p-6 shadow-md"
        onSubmit={handleSubmit}
      >
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
            Edit Profil Perusahaan
          </h2>
        </div>

        <div className="flex flex-col gap-2 bg-white rounded-lg p-4 sm:p-6 shadow border mb-6">
          <TextInput
            label="Nomor Telepon Perusahaan"
            name="telephone"
            placeholder="Nomor telepon perusahaan"
            value={form.telephone}
            onChange={handleInputChange}
          />
          <TextInput
            label="Email Perusahaan"
            name="email"
            placeholder="Email perusahaan"
            value={form.email}
            onChange={handleInputChange}
          />
          <TextInput
            label="Alamat Perusahaan"
            name="address"
            placeholder="Alamat perusahaan"
            textarea
            rows={3}
            value={form.address}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(form.socialMedia).map(([type, value]) => (
              <TextInput
                key={type}
                label={
                  type === 'twitter' ? 'X-twitter' : type.charAt(0).toUpperCase() + type.slice(1)
                }
                name={type}
                placeholder={`Link Sosial media ${
                  type.charAt(0).toUpperCase() + type.slice(1)
                } perusahaan`}
                value={value}
                onChange={handleInputChange}
              />
            ))}
          </div>
        </div>
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="bg-primary-700 text-white px-4 py-2 rounded-md hover:bg-primary-600"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </AdminTemplate>
  );
}
