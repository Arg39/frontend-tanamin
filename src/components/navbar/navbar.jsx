import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../button/button';
import useMenuStore from '../../zustand/menuStore';

export default function Navbar() {
  const { isMenuOpen, toggleMenu } = useMenuStore();

  // Disable body scroll when Mobile Menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <div className="p-2 lg:px-8 flex justify-between items-center bg-white fixed top-0 left-0 w-full z-50 shadow-md">
      {/* Logo */}
      <div>
        <img src="assets/Logo-CodeLearn.png" alt="Logo-Tanamin" className="h-10 lg:h-14" />
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex space-x-8">
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

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            ></motion.div>

            {/* Mobile Menu Content */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden fixed top-16 left-0 w-full bg-white-100 shadow-md lg:hidden"
            >
              <div className="flex flex-col space-y-4 bg-black p-4">
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="hidden lg:flex space-x-4">
        <Button variant="login" onClick={() => alert('Login')} className="text-md rounded-full">
          Login
        </Button>
        <Button variant="login" onClick={() => alert('Register')} className="text-md rounded-full">
          Register
        </Button>
      </div>
    </div>
  );
}
