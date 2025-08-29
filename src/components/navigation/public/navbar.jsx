import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../button/button';
import useMenuStore from '../../../zustand/menuStore';
import useNavigationStore from '../../../zustand/navigationStore';
import Icon from '../../icons/icon';
import { Link } from 'react-router-dom';
import ProfileNav from './profileNav';

// Animated underline component for nav links/buttons
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
        style={{
          borderRadius: '2px',
        }}
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

  useEffect(() => {
    if (!isMenuOpen) setOpenDropdown(null);
  }, [isMenuOpen]);

  useEffect(() => {
    return () => {
      if (dropdownCloseTimer.current) {
        clearTimeout(dropdownCloseTimer.current);
      }
    };
  }, []);

  const handleMouseEnterDropdown = (idx) => {
    if (dropdownCloseTimer.current) {
      clearTimeout(dropdownCloseTimer.current);
    }
    setOpenDropdown(idx);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownCloseTimer.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Helper to get active state for dropdown and links
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

    // For dropdown label: activeNav starts with navLabel
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
                if (isMobile) {
                  setOpenDropdown(openDropdown === idx ? null : idx);
                }
              }}
            >
              {nav.label.charAt(0).toUpperCase() + nav.label.slice(1)}
              <Icon type="dropdown" className="ml-1 w-4 h-4" />
              {/* Animated underline for dropdown label */}
              <motion.div
                className="absolute left-0 bottom-0 h-[3px] bg-primary-700"
                initial={false}
                animate={{
                  width: getActiveState(nav.label) ? '100%' : '0%',
                  right: getActiveState(nav.label) ? '0%' : '100%',
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{
                  borderRadius: '2px',
                }}
              />
            </span>
            {/* Dropdown */}
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
                        className={`block py-2 text-gray-800 hover:text-primary-700`}
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
                      className={`block px-4 py-2 text-gray-800 hover:bg-primary-100`}
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
              className={`${className}`}
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
    <div className="tanamin-navbar xl:px-20 lg:px-10 md:px-14 sm:px-8 lg:p-0 md px-2 py-2 flex justify-between items-center bg-white fixed top-0 left-0 w-full z-40 shadow-md">
      {/* Logo */}
      <div>
        <img src="/assets/logo.png" alt="Logo-Tanamin" className="h-10 lg:h-12" />
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
              className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start"
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

      {/* Account Menu */}
      <AnimatePresence>
        {isAccountMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
              <div className="flex flex-col space-y-4 bg-white p-6 relative">
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
      <ProfileNav />
    </div>
  );
}
