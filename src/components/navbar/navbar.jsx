import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../button/button';
import useMenuStore from '../../zustand/menuStore';
import Icon from '../icon/iconHeroicons';

export default function Navbar() {
  const { isMenuOpen, isAccountMenuOpen, toggleMenu, toggleAccountMenu, closeMenu, activeNav } =
    useMenuStore();

  // Disable body scroll when Mobile Menu or Account Menu is open
  useEffect(() => {
    if (isMenuOpen || isAccountMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen, isAccountMenuOpen]);

  return (
    <div className="lg:px-8 lg:p-0 md px-2 py-2 flex justify-between items-center bg-white fixed top-0 left-0 w-full z-50 shadow-md">
      {/* Logo */}
      <div>
        <img src="assets/Logo-CodeLearn.png" alt="Logo-Tanamin" className="h-10 lg:h-12" />
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex space-x-8">
        <a
          href="beranda"
          className={`flex justify-center items-center cursor-pointer py-4 font-semibold ${
            activeNav === 'beranda'
              ? 'border-b-[3px] border-primary-700 text-primary-700 text-brown border-brown'
              : ''
          }`}
        >
          Beranda
        </a>
        <a
          href="tentang-kami"
          className={`flex justify-center items-center cursor-pointer py-4 font-semibold ${
            activeNav === 'tentang-kami'
              ? 'border-b-[3px] border-primary-700 text-primary-700 text-brown border-brown'
              : ''
          }`}
        >
          Tentang Kami
        </a>
        <a
          href="#category"
          className={`flex justify-center items-center cursor-pointer py-4 font-semibold ${
            activeNav === 'kategori'
              ? 'border-b-[3px] border-primary-700 text-primary-700 text-brown border-brown'
              : ''
          }`}
        >
          Kategori
        </a>
        <a
          href="faq"
          className={`flex justify-center items-center cursor-pointer py-4 font-semibold ${
            activeNav === 'faq'
              ? 'border-b-[3px] border-primary-700 text-primary-700 text-brown border-brown'
              : ''
          }`}
        >
          FAQ
        </a>
        <a
          href="kontak-kami"
          className={`flex justify-center items-center cursor-pointer py-4 font-semibold ${
            activeNav === 'kontak-kami'
              ? 'border-b-[3px] border-primary-700 text-primary-700 text-brown border-brown'
              : ''
          }`}
        >
          Kontak Kami
        </a>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <div className="flex space-x-4">
          {/* User Icon for Account Menu */}
          <motion.button
            onClick={toggleAccountMenu}
            className="text-gray-700 focus:outline-none"
            initial={{ rotate: 0 }}
            animate={{ rotate: isAccountMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Icon type={isAccountMenuOpen ? 'x-mark' : 'user'} className="h-6 w-6" />
          </motion.button>

          {/* Hamburger Menu Icon */}
          <motion.button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
            initial={{ rotate: 0 }}
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Icon type={isMenuOpen ? 'x-mark' : 'bars-3'} className="h-6 w-6" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-16 w-full bg-white shadow-md lg:hidden"
              >
                <div className="flex flex-col space-y-4 bg-white-100 p-6">
                  <a
                    href="#home"
                    className="text-lg font-medium text-gray-800 hover:text-primary-700"
                    onClick={closeMenu}
                  >
                    Beranda
                  </a>
                  <a
                    href="#about"
                    className="text-lg font-medium text-gray-800 hover:text-primary-700"
                    onClick={closeMenu}
                  >
                    Tentang Kami
                  </a>
                  <a
                    href="#category"
                    className="text-lg font-medium text-gray-800 hover:text-primary-700"
                    onClick={closeMenu}
                  >
                    Kategori
                  </a>
                  <a
                    href="#faq"
                    className="text-lg font-medium text-gray-800 hover:text-primary-700"
                    onClick={closeMenu}
                  >
                    FAQ
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Account Menu */}
      <AnimatePresence>
        {isAccountMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleAccountMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            ></motion.div>

            {/* Account Menu Content */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden fixed top-16 left-0 w-full bg-white shadow-md lg:hidden"
            >
              <div className="flex flex-col space-y-4 bg-white-100 p-6">
                <Button
                  variant="login"
                  to={'masuk'}
                  className="text-lg font-medium"
                  onClick={closeMenu}
                >
                  Masuk
                </Button>
                <Button
                  variant="login"
                  to={'daftar'}
                  className="text-lg font-medium"
                  onClick={closeMenu}
                >
                  Daftar
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="hidden lg:flex space-x-4">
        <Button variant="login" to={'masuk'} className="text-md">
          Masuk
        </Button>
        <Button variant="login" to={'daftar'} className="text-md">
          Daftar
        </Button>
      </div>
    </div>
  );
}
