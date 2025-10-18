import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LazyImage from '../../components/image/lazyImage';
import Button from '../../components/button/button';
import useAuthStore from '../../zustand/authStore';
import Template from '../../template/template';
import Icon from '../../components/icons/icon'; // Tambahkan import Icon

export default function Register() {
  const [state, setState] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk konfirmasi password
  const navigate = useNavigate();

  // ref untuk mengukur tinggi gambar / kiri container
  const imageRef = useRef(null);
  const [minHeight, setMinHeight] = useState(null);

  const handleChange = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const updateHeight = () => {
      if (imageRef.current) {
        const h = imageRef.current.clientHeight;
        setMinHeight(h);
      }
    };

    updateHeight();

    let ro;
    if (typeof ResizeObserver !== 'undefined' && imageRef.current) {
      ro = new ResizeObserver(() => {
        updateHeight();
      });
      ro.observe(imageRef.current);
    }

    const onResize = () => updateHeight();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
    };
  }, []);

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
      <div className="flex flex-col lg:flex-row justify-between items-start px-0 md:px-24 pt-12 gap-8">
        {/* Left image */}
        <div ref={imageRef} className="w-full lg:w-1/2 flex justify-center mb-4 lg:mb-0">
          <LazyImage src="/images/daftar.png" alt="Daftar" className="w-full" />
        </div>
        {/* Form */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div
            className="w-full p-6 lg:p-16 py-10 lg:pt-24 bg-white shadow-lg rounded-lg"
            style={{ minHeight: minHeight ? `${minHeight}px` : undefined }}
          >
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
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2"
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
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2"
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
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2"
                />
              </div>
              {/** Password **/}
              <div className="mb-4 lg:mb-6 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={state.password}
                  onChange={handleChange}
                  placeholder="Password"
                  disabled={loading}
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2 pr-10"
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
              {/** Confirm Password **/}
              <div className="mb-4 lg:mb-6 relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  value={state.password_confirmation}
                  onChange={handleChange}
                  placeholder="Ulangi Password"
                  disabled={loading}
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={loading}
                  aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  <Icon type={showConfirmPassword ? 'eye-off' : 'eye'} />
                </button>
              </div>
              {/** Link to login **/}
              <div className="text-center mb-6 mt-16 lg:mb-10">
                <span>Sudah Memiliki Akun? </span>
                <Link to="/masuk" className="text-primary-800 font-semibold hover:underline">
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
