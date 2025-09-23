import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LazyImage from '../../components/image/lazyImage';
import { Link } from 'react-router-dom';
import Button from '../../components/button/button';
import useAuthStore from '../../zustand/authStore';
import Template from '../../template/template';
import Icon from '../../components/icons/icon';

export default function Login() {
  const location = useLocation();
  const [state, setState] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = state;
    const login = useAuthStore.getState().login;

    setLoading(true);
    try {
      await toast.promise(login(username, password), {
        pending: 'Sedang memproses login...',
      });

      const { token, user, error } = useAuthStore.getState();
      if (token) {
        if (user.role === 'admin') {
          toast.success(`Login berhasil! Selamat datang kembali ${user.first_name}!`);
          navigate('/admin/dashboard');
        } else if (user.role === 'instructor') {
          toast.success(`Login berhasil! Selamat datang kembali ${user.first_name}!`);
          navigate('/instruktur/dashboard');
        } else if (user.role === 'student') {
          toast.success(`Login berhasil! Selamat datang kembali ${user.first_name}!`);
          navigate('/');
        }
      } else if (error === 'Account inactive') {
        toast.error('Akun Anda tidak aktif. Silakan hubungi admin.');
      } else if (error) {
        toast.error(error);
      } else {
        toast.error('Login gagal. Silakan periksa kredensial Anda.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login. Silakan coba lagi.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Template activeNav="login" locationKey={location.key}>
      <div className="flex flex-col lg:flex-row justify-between items-center pt-12">
        <div className="w-full lg:w-1/2 flex justify-center mb-4 lg:mb-0">
          <LazyImage src="/images/login.png" alt="Login" className="w-full lg:w-[600px]" />
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full lg:w-[600px] p-6 lg:p-20 py-10 lg:py-24 bg-white shadow-lg rounded-lg">
            <h2 className="text-start text-xl lg:text-2xl text-primary-900 font-bold mb-6 lg:mb-10">
              Masuk ke Akun Anda
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 lg:mb-6">
                <input
                  type="text"
                  name="username"
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2"
                  placeholder="Username atau Email"
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="mb-4 lg:mb-6 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2 pr-10"
                  placeholder="Password"
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  <Icon type={showPassword ? 'eye-off' : 'eye'} />
                </button>
              </div>
              <div className="flex flex-row justify-end items-center mb-6">
                {/* <label className="flex items-center mb-0 mr-4">
                  <input type="checkbox" className="mr-2" disabled={loading} />
                  Ingat Saya
                </label> */}
                <button className="hover:underline ml-4" disabled={loading}>
                  Lupa Password?
                </button>
              </div>
              <div className="w-full flex justify-center mb-6 lg:mb-10">
                <span>Belum Memiliki Akun? </span>
                <Link to={'/daftar'} className="text-primary-800 font-semibold hover:underline">
                  Daftar Sekarang
                </Link>
              </div>
              <Button variant="login" type="submit" className="w-full" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Template>
  );
}
