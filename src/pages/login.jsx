import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/navigation/navbar';
import LazyImage from '../components/image/lazyImage';
import { Link } from 'react-router-dom';
import Button from '../components/button/button';
import useAuthStore from '../zustand/authStore';
import Template from '../template/template';

export default function Login() {
  const [state, setState] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = state;
    const login = useAuthStore.getState().login;
    await login(username, password);

    const { user, error, token } = useAuthStore.getState();
    if (token) {
      navigate('/');
    } else {
      alert(error || 'Login failed');
    }
  };

  return (
    <Template activeNav="login">
      <div className="flex flex-col lg:flex-row justify-between items-center pt-12">
        <div className="w-full lg:w-1/2 flex justify-center mb-4 lg:mb-0">
          <LazyImage src="/images/login.png" alt="Login" className="w-full lg:w-[600px]" />
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full lg:w-[600px] p-6 lg:p-20 py-10 lg:py-24 bg-white shadow-lg rounded-lg">
            <h2 className="text-start text-xl lg:text-2xl font-bold mb-6 lg:mb-10">
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
                />
              </div>
              <div className="mb-4 lg:mb-6">
                <input
                  type="password"
                  name="password"
                  className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row justify-between items-center mb-6">
                <label className="flex items-center mb-0 mr-4">
                  <input type="checkbox" className="mr-2" />
                  Ingat Saya
                </label>
                <button className="hover:underline ml-4">Lupa Password?</button>
              </div>
              <div className="text-start mb-6 lg:mb-10">
                <span>Belum Memiliki Akun? </span>
                <Link to={'/daftar'} className="text-[#36C5F1] hover:underline">
                  Daftar Sekarang
                </Link>
              </div>
              <Button variant="login" type="submit" className="">
                Masuk
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Template>
  );
}
