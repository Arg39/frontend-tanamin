import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LazyImage from '../components/image/lazyImage';
import Button from '../components/button/button';
import useAuthStore from '../zustand/authStore';
import Template from '../template/template';

export default function Register() {
  const [state, setState] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, username, email, password, password_confirmation } = state;

    if (password !== password_confirmation) {
      toast.error('Password dan konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const payload = { name, username, email, password, password_confirmation };
      const register = useAuthStore.getState().register;
      await toast.promise(register(payload), {
        pending: 'Sedang memproses pendaftaran...',
        success: 'Pendaftaran berhasil! Silakan login.',
        error: 'Terjadi kesalahan saat pendaftaran. Silakan coba lagi.',
      });
      navigate('/masuk');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Gagal mendaftar';
      toast.error(msg);
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Template activeNav="register">
      <div className="flex flex-col lg:flex-row justify-between items-center pt-12">
        {/* Left image */}
        <div className="w-full lg:w-1/2 flex justify-center mb-4 lg:mb-0">
          <LazyImage src="/images/daftar.png" alt="Daftar" className="w-full lg:w-[600px]" />
        </div>
        {/* Form */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full lg:w-[600px] p-6 lg:p-20 py-10 lg:py-24 bg-white shadow-lg rounded-lg">
            <h2 className="text-start text-xl lg:text-2xl text-primary-900 font-bold mb-6 lg:mb-10">
              Daftar Akun Baru
            </h2>
            <form onSubmit={handleSubmit}>
              {/** Name **/}
              <div className="mb-4 lg:mb-6">
                <input
                  type="text"
                  name="name"
                  value={state.name}
                  onChange={handleChange}
                  placeholder="Nama Lengkap"
                  disabled={loading}
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black-900 outline-none py-2"
                />
              </div>
              {/** Username **/}
              <div className="mb-4 lg:mb-6">
                <input
                  type="text"
                  name="username"
                  value={state.username}
                  onChange={handleChange}
                  placeholder="Username"
                  disabled={loading}
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black-900 outline-none py-2"
                />
              </div>
              {/** Email **/}
              <div className="mb-4 lg:mb-6">
                <input
                  type="email"
                  name="email"
                  value={state.email}
                  onChange={handleChange}
                  placeholder="Email"
                  disabled={loading}
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black-900 outline-none py-2"
                />
              </div>
              {/** Password **/}
              <div className="mb-4 lg:mb-6">
                <input
                  type="password"
                  name="password"
                  value={state.password}
                  onChange={handleChange}
                  placeholder="Password"
                  disabled={loading}
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black-900 outline-none py-2"
                />
              </div>
              {/** Confirm Password **/}
              <div className="mb-4 lg:mb-6">
                <input
                  type="password"
                  name="password_confirmation"
                  value={state.password_confirmation}
                  onChange={handleChange}
                  placeholder="Ulangi Password"
                  disabled={loading}
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black-900 outline-none py-2"
                />
              </div>
              {/** Link to login **/}
              <div className="text-start mb-6 lg:mb-10">
                <span>Sudah Memiliki Akun? </span>
                <Link to="/login" className="text-primary-800 font-semibold hover:underline">
                  Login ke Akun Saya
                </Link>
              </div>
              {/** Submit button **/}
              <Button variant="register" type="submit" className="w-full" disabled={loading}>
                {loading ? 'Memproses...' : 'Daftar'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Template>
  );
}
