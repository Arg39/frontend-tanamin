import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../button/button';
import useMenuStore from '../../../zustand/menuStore';
import useNavigationStore from '../../../zustand/navigationStore';
import Icon from '../../icons/icon';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const {
    isMenuOpen,
    isAccountMenuOpen,
    toggleMenu,
    toggleAccountMenu,
    closeMenu,
    closeAccountMenu,
    activeNav,
  } = useMenuStore();

  const { navigationPublic } = useNavigationStore();

  // Helper to render navigation links, with special case for Kategori
  const renderNavLinks = (className, onClick) => (
    <>
      {navigationPublic.map((nav) =>
        nav.links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`${className} ${
              activeNav === nav.label
                ? 'border-b-[3px] border-primary-700 text-primary-700 text-brown border-brown'
                : ''
            }`}
            onClick={onClick}
          >
            {link.text}
          </Link>
        ))
      )}
      {/* Special case for Kategori */}
      <Link
        to="/#category"
        className={`${className} ${
          activeNav === 'kategori'
            ? 'border-b-[3px] border-primary-700 text-primary-700 text-brown border-brown'
            : ''
        }`}
        onClick={onClick}
      >
        Kategori
      </Link>
    </>
  );

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
    <div className="lg:px-8 lg:p-0 md px-2 py-2 bg-white-100 flex justify-between items-center bg-white fixed top-0 left-0 w-full z-40 shadow-md">
      {/* Logo */}
      <div>
        <img src="assets/logo.png" alt="Logo-Tanamin" className="h-10 lg:h-12" />
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex space-x-8">
        {renderNavLinks('flex justify-center items-center cursor-pointer py-4 font-semibold')}
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
              className="fixed inset-0 bg-black-900 bg-opacity-50 z-40 flex justify-center items-start"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-16 w-full bg-white shadow-md lg:hidden fixed left-0 top-0 z-50"
              style={{ marginTop: '64px' }}
            >
              <div className="flex flex-col space-y-4 bg-white-100 p-6 relative">
                {renderNavLinks(
                  'text-lg font-medium text-gray-800 hover:text-primary-700',
                  closeMenu
                )}
              </div>
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
              className="fixed inset-0 bg-black-900 bg-opacity-50 z-40"
              onClick={closeAccountMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Account Menu Content */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden fixed top-16 left-0 w-full bg-white shadow-md lg:hidden z-50"
            >
              <div className="flex flex-col space-y-4 bg-white-100 p-6 relative">
                <Button
                  variant="login"
                  to={'masuk'}
                  className="text-lg font-medium"
                  onClick={closeAccountMenu}
                >
                  Masuk
                </Button>
                <Button
                  variant="login"
                  to={'daftar'}
                  className="text-lg font-medium"
                  onClick={closeAccountMenu}
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
        <Button variant="primary" to={'masuk'} className="text-md">
          Masuk
        </Button>
        <Button variant="primary" to={'daftar'} className="text-md">
          Daftar
        </Button>
      </div>
    </div>
  );
}
