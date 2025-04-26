import React from 'react';
import Button from '../button/button';

export default function Navbar() {
  return (
    <div className="p-2 flex justify-between items-center bg-white fixed top-0 left-0 w-full z-50 shadow-md">
      <div>
        <img src="assets/Logo-CodeLearn.png" alt="Logo-Tanamin" className="h-10 lg:h-14" />
      </div>

      <div className="space-x-8">
        <a href="#home" className="">
          Beranda
        </a>
        <a href="#about" className="">
          Tentang Kami
        </a>
        <a href="#contact" className="">
          Kategori
        </a>
        <a href="#contact" className="">
          FAQ
        </a>
        <a href="#contact" className="">
          Kontak Kami
        </a>
      </div>

      <div>
        <Button variant="login" onClick={() => alert('Login')} className="text-xl">
          Login
        </Button>
      </div>
    </div>
  );
}
