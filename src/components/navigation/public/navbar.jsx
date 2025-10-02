import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../button/button';
import useMenuStore from '../../../zustand/menuStore';
import useNavigationStore from '../../../zustand/navigationStore';
import Icon from '../../icons/icon';
import { Link } from 'react-router-dom';
import ProfileNav from './profileNav';
import useAuthStore from '../../../zustand/authStore';
import useConfirmationModalStore from '../../../zustand/confirmationModalStore';
import useNotificationStore from '../../../zustand/public/notificationStore';

// Animated underline component
const NavLinkWithMotion = ({ to, children, className, isActive, onClick, ...rest }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      className={`${className} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...rest}
    >
      {children}
      <motion.div
        className="absolute left-0 bottom-0 h-[3px] bg-primary-700"
        initial={false}
        animate={{
          width: isActive || isHovered ? '100%' : '0%',
          right: isActive || isHovered ? '0%' : '100%',
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        style={{ borderRadius: '2px' }}
      />
    </Link>
  );
};

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
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownCloseTimer = useRef(null);

  const { user, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  useEffect(() => {
    if (user) fetchUnreadCount();
  }, [user, fetchUnreadCount]);

  // useEffect(() => {
  //   if (!user) return;
  //   const interval = setInterval(() => {
  //     fetchUnreadCount();
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [user, fetchUnreadCount]);

  const openConfirmationModal = useConfirmationModalStore((state) => state.openModal);

  const handleLogoutClick = () => {
    openConfirmationModal({
      title: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar dari akun?',
      variant: 'danger',
      onConfirm: () => {
        logout();
        closeAccountMenu();
      },
      onCancel: () => {
        closeAccountMenu();
      },
    });
  };

  useEffect(() => {
    if (!isMenuOpen) setOpenDropdown(null);
  }, [isMenuOpen]);

  useEffect(() => {
    return () => {
      if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
    };
  }, []);

  const handleMouseEnterDropdown = (idx) => {
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
    setOpenDropdown(idx);
  };
  const handleMouseLeaveDropdown = () => {
    dropdownCloseTimer.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  const getActiveState = (navLabel, linkText) => {
    if (!activeNav) return false;
    if (linkText) {
      const normalizedNavLabel = navLabel.toLowerCase();
      const normalizedLinkText = linkText.toLowerCase();
      return (
        activeNav.toLowerCase() === `${normalizedNavLabel}.${normalizedLinkText}` ||
        activeNav.toLowerCase() === normalizedNavLabel ||
        activeNav.toLowerCase() === normalizedLinkText.replace(/\s+/g, '-')
      );
    }
    return activeNav.toLowerCase().startsWith(navLabel.toLowerCase());
  };

  const renderNavLinks = (className, onClick, isMobile = false) => (
    <>
      {navigationPublic.map((nav, idx) =>
        nav.links.length > 1 ? (
          <div
            key={nav.label}
            className={`relative group ${isMobile ? '' : 'cursor-pointer'}`}
            onMouseEnter={() => !isMobile && handleMouseEnterDropdown(idx)}
            onMouseLeave={() => !isMobile && handleMouseLeaveDropdown()}
          >
            <span
              className={`${className} flex items-center relative`}
              onClick={() => {
                if (isMobile) setOpenDropdown(openDropdown === idx ? null : idx);
              }}
            >
              {nav.label.charAt(0).toUpperCase() + nav.label.slice(1)}
              <Icon type="arrow-down" className="ml-1 w-4 h-4" />
              <motion.div
                className="absolute left-0 bottom-0 h-[3px] bg-primary-700"
                initial={false}
                animate={{
                  width: getActiveState(nav.label) ? '100%' : '0%',
                  right: getActiveState(nav.label) ? '0%' : '100%',
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{ borderRadius: '2px' }}
              />
            </span>
            {isMobile ? (
              <AnimatePresence>
                {openDropdown === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col pl-4"
                  >
                    {nav.links.map((link) => (
                      <NavLinkWithMotion
                        key={link.href}
                        to={link.href}
                        className="block py-2 text-gray-800 hover:text-primary-700"
                        isActive={getActiveState(nav.label, link.text)}
                        onClick={() => {
                          if (onClick) onClick();
                          setOpenDropdown(null);
                        }}
                      >
                        {link.text}
                      </NavLinkWithMotion>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              openDropdown === idx && (
                <div
                  className="absolute left-0 top-[88%] bg-white shadow-lg rounded-md mt-2 z-50 min-w-[160px]"
                  onMouseEnter={() => handleMouseEnterDropdown(idx)}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  {nav.links.map((link) => (
                    <NavLinkWithMotion
                      key={link.href}
                      to={link.href}
                      className="block px-4 py-2 text-gray-800 hover:bg-primary-100"
                      isActive={getActiveState(nav.label, link.text)}
                      onClick={() => {
                        if (onClick) onClick();
                        setOpenDropdown(null);
                      }}
                    >
                      {link.text}
                    </NavLinkWithMotion>
                  ))}
                </div>
              )
            )}
          </div>
        ) : (
          nav.links.map((link) => (
            <NavLinkWithMotion
              key={link.href}
              to={link.href}
              className={className}
              isActive={getActiveState(nav.label, link.text)}
              onClick={() => {
                if (onClick) onClick();
                setOpenDropdown(null);
              }}
            >
              {link.text}
            </NavLinkWithMotion>
          ))
        )
      )}
    </>
  );

  useEffect(() => {
    if (isMenuOpen || isAccountMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isMenuOpen, isAccountMenuOpen]);

  return (
    <div className="tanamin-navbar xl:px-20 lg:px-10 md:px-14 sm:px-8 px-2 pt-2 pb-2 sm:pb-0 flex justify-between items-center bg-white fixed top-0 left-0 w-full z-40 shadow-md">
      <div>
        <img src="/assets/logo.png" alt="Logo-Tanamin" className="h-10 lg:h-12" />
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex space-x-8">
        {renderNavLinks('flex justify-center items-center cursor-pointer py-4 font-semibold')}
      </div>

      {/* Mobile Menu Buttons */}
      <div className="lg:hidden">
        <div className="flex space-x-4">
          <motion.button
            onClick={toggleAccountMenu}
            className="text-gray-700 focus:outline-none"
            initial={{ rotate: 0 }}
            animate={{ rotate: isAccountMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Icon type={isAccountMenuOpen ? 'x-mark' : 'user'} className="h-6 w-6" />
          </motion.button>

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

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-14 w-full bg-white shadow-md lg:hidden fixed left-0 top-0 z-50"
            >
              <div className="flex flex-col space-y-4 bg-white p-6 relative">
                {renderNavLinks(
                  'text-lg font-medium text-gray-800 hover:text-primary-700',
                  closeMenu,
                  true // isMobile = true
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Account Menu */}
      <AnimatePresence>
        {isAccountMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeAccountMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden fixed top-14 left-0 w-full bg-white shadow-md lg:hidden z-50"
            >
              <div className="flex flex-col space-y-4 bg-white p-6">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 border-b pb-3">
                      {user?.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt="Foto Profil"
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border">
                          <Icon type="user" className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {user?.first_name || user?.username} {user?.last_name || ''}
                        </p>
                        {user?.username && (
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/notifikasi"
                        className={`flex items-center px-3 py-2 rounded hover:bg-gray-100 transition ${
                          activeNav === 'notifikasi'
                            ? 'bg-primary-100 text-primary-700 font-semibold ring-2 ring-primary-300 shadow'
                            : ''
                        }`}
                        onClick={closeAccountMenu}
                      >
                        <span className="relative flex items-center">
                          <Icon
                            type="bell-alert"
                            className={`w-5 h-5 mr-3 transition ${
                              activeNav === 'notifikasi' ? 'text-primary-700' : ''
                            }`}
                          />
                          {unreadCount > 0 && (
                            <span
                              className="absolute -top-2 -right-0 flex items-center justify-center bg-red-500 text-white text-xs font-semibold shadow w-5 h-5 rounded-full px-0 min-w-0"
                              style={{ aspectRatio: '1 / 1' }}
                            >
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </span>
                        Notifikasi
                      </Link>

                      <Link
                        to="/keranjang"
                        className={`flex items-center px-3 py-2 rounded hover:bg-gray-100 transition ${
                          activeNav === 'keranjang'
                            ? 'bg-primary-100 text-primary-700 font-semibold ring-2 ring-primary-300 shadow'
                            : ''
                        }`}
                        onClick={closeAccountMenu}
                      >
                        <Icon
                          type="cart-outline"
                          className={`w-5 h-5 mr-3 transition ${
                            activeNav === 'keranjang' ? 'text-primary-700' : ''
                          }`}
                        />
                        Keranjang
                      </Link>

                      <div className="border-t my-2" />

                      <Link
                        to="/profile"
                        className={`flex items-center px-3 py-2 rounded hover:bg-gray-100 transition ${
                          activeNav === 'profile'
                            ? 'bg-primary-100 text-primary-700 font-semibold ring-2 ring-primary-300 shadow'
                            : ''
                        }`}
                        onClick={closeAccountMenu}
                      >
                        <Icon
                          type="user"
                          className={`w-5 h-5 mr-3 text-primary-700 transition ${
                            activeNav === 'profile' ? 'font-bold' : ''
                          }`}
                        />
                        Profil
                      </Link>

                      <Link
                        to="/my-courses"
                        className={`flex items-center px-3 py-2 rounded hover:bg-gray-100 transition ${
                          activeNav === 'my-courses'
                            ? 'bg-primary-100 text-primary-700 font-semibold ring-2 ring-primary-300 shadow'
                            : ''
                        }`}
                        onClick={closeAccountMenu}
                      >
                        <Icon
                          type="book"
                          className={`w-5 h-5 mr-3 text-primary-700 transition ${
                            activeNav === 'my-courses' ? 'font-bold' : ''
                          }`}
                        />
                        Kursus Saya
                      </Link>

                      <Link
                        to="/purchase-history"
                        className={`flex items-center px-3 py-2 rounded hover:bg-gray-100 transition ${
                          activeNav === 'purchase-history'
                            ? 'bg-primary-100 text-primary-700 font-semibold ring-2 ring-primary-300 shadow'
                            : ''
                        }`}
                        onClick={closeAccountMenu}
                      >
                        <Icon
                          type="work-history"
                          className={`w-5 h-5 mr-3 text-primary-700 transition ${
                            activeNav === 'purchase-history' ? 'font-bold' : ''
                          }`}
                        />
                        Riwayat Pembelian
                      </Link>

                      <Link
                        to="/bookmarks"
                        className={`flex items-center px-3 py-2 rounded hover:bg-gray-100 transition ${
                          activeNav === 'bookmarks'
                            ? 'bg-primary-100 text-primary-700 font-semibold ring-2 ring-primary-300 shadow'
                            : ''
                        }`}
                        onClick={closeAccountMenu}
                      >
                        <Icon
                          type="bookmark"
                          className={`w-5 h-5 mr-3 text-primary-700 transition ${
                            activeNav === 'bookmarks' ? 'font-bold' : ''
                          }`}
                        />
                        Bookmark
                      </Link>

                      <div className="border-t my-2" />

                      <Link
                        to="/settings"
                        className={`flex items-center px-3 py-2 rounded hover:bg-gray-100 transition ${
                          activeNav === 'settings'
                            ? 'bg-primary-100 text-primary-700 font-semibold ring-2 ring-primary-300 shadow'
                            : ''
                        }`}
                        onClick={closeAccountMenu}
                      >
                        <Icon
                          type="gear"
                          className={`w-5 h-5 mr-3 text-secondary-700 transition ${
                            activeNav === 'settings' ? 'font-bold' : ''
                          }`}
                        />
                        Pengaturan
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="flex items-center px-3 py-2 rounded hover:bg-gray-100 text-left text-red-600"
                      >
                        <Icon type="logout" className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Buttons / Desktop Profile Nav */}
      <ProfileNav />
    </div>
  );
}
