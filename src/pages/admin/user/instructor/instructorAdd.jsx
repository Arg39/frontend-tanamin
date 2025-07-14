import React, { useState } from 'react';
import AdminTemplate from '../../../../template/templateAdmin';
import TextInput from '../../../../components/form/textInput';
import ImagePicker from '../../../../components/form/imagePicker';
import Button from '../../../../components/button/button';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../../components/icons/icon';
import PasswordInputGenerator from '../../../../components/form/passwordInputGenerator';
import useInstructorStore from '../../../../zustand/instructorStore';

export default function InstructorAdd() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Instruktur', path: '/admin/instruktur' },
    { label: 'Tambah Instruktur', path: location.pathname },
  ];

  const navigate = useNavigate();
  const addInstructor = useInstructorStore((state) => state.addInstructor);
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Password dan konfirmasi password tidak sama');
      return;
    }
    setLoading(true);
    const result = await addInstructor(form);
    setLoading(false);
    if (result.success) {
      navigate('/admin/instruktur');
    }
  };

  return (
    <AdminTemplate activeNav="instruktur" breadcrumbItems={breadcrumbItems}>
      <div className="wf-full bg-white p-6 rounded-lg shadow-md">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
          <span>Kembali</span>
        </button>
        <h2 className="text-2xl font-bold">Tambah Instruktur</h2>
        <form className="w-full mt-4 space-y-4" onSubmit={handleSubmit}>
          <TextInput
            label="Nama Instruktur"
            name="name"
            placeholder="Masukkan nama instruktur"
            value={form.name}
            onChange={handleChange}
          />
          <TextInput
            label="Username"
            name="username"
            placeholder="Masukkan usernane"
            value={form.username}
            onChange={handleChange}
          />
          <TextInput
            label="Email"
            name="email"
            placeholder="Masukkan email"
            value={form.email}
            onChange={handleChange}
          />
          <PasswordInputGenerator
            label="Password"
            name="password"
            placeholder="Masukkan password"
            value={form.password}
            onChange={handleChange}
            className="w-full"
          />
          <PasswordInputGenerator
            label="Konfirmasi Password"
            name="confirmPassword"
            placeholder="Konfirmasi password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full"
            showGenerate={false}
          />
          <div className="w-full flex justify-end">
            <Button type="submit" variant="form" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </AdminTemplate>
  );
}
