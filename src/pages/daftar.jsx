import React, { Component } from 'react';
import Sidebar from '../components/navigation/sidebar123';
import Navbar from '../components/navigation/navbar';
import LazyImage from '../components/image/lazyImage';
import { Link } from 'react-router-dom';

export default class Daftar extends Component {
  state = {
    username: '',
    password: '',
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <>
        <Navbar page="daftar" userName="John Doe" isLogin={false} />
        <div className="flex flex-col lg:flex-row justify-between items-center p-6 lg:p-20 mt-10 lg:mt-20 md:gap-20">
          <div className="w-full lg:w-1/2 flex justify-center mb-4 lg:mb-0">
            <LazyImage src="/images/daftar.png" alt="daftar" className="w-full lg:w-[600px]" />
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full lg:w-[600px] p-6 lg:p-20 py-10 lg:py-24 bg-white shadow-lg rounded-lg">
              <h2 className="text-start text-xl lg:text-2xl font-bold mb-6 lg:mb-10">
                Daftar Akun
              </h2>
              <form onSubmit={this.handleSubmit}>
                <div className="mb-4 lg:mb-6">
                  <input
                    type="text"
                    name="fullname"
                    className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2"
                    placeholder="Nama Lengkap"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="mb-4 lg:mb-6">
                  <input
                    type="text"
                    name="username"
                    className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2"
                    placeholder="Username"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="mb-4 lg:mb-6">
                  <input
                    type="text"
                    name="email"
                    className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2"
                    placeholder="Email"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="mb-4 lg:mb-6">
                  <input
                    type="text"
                    name="telephone"
                    className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2"
                    placeholder="Telepon"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="mb-4 lg:mb-6">
                  <input
                    type="password"
                    name="password"
                    className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2"
                    placeholder="Password"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="mb-4 lg:mb-6">
                  <input
                    type="password"
                    name="confirm-password"
                    className="w-full border-b-2 p-2 px-4 border-gray-300 focus:border-black outline-none py-2"
                    placeholder="Ulangi Password"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="text-start mb-6 lg:mb-10">
                  <span>Sudah Memiliki Akun? </span>
                  <Link to={'/login'} className="text-[#36C5F1] hover:underline">
                    Login ke Akun Saya
                  </Link>
                </div>
                <button type="submit" className="w-full bg-[#36C5F1] text-white py-2 rounded-full">
                  Masuk
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}
