import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../icon/iconHeroicons';
import '../../css/navigation.css';
import categories from '../../data/categories';

const Navbar = ({ page }) => {
  const isLoggedIn = false;
  const name = 'Alfian';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsMobileMenuOpen(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      toggleMobileMenu();
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  const handleDropdownMouseEnter = () => {
    clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownHovered(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownHovered(false);
      setIsDropdownOpen(false);
    }, 300);
  };

  return (
    <nav className="bg-white shadow-md flex items-center fixed top-0 w-full z-50 px-6 lg:px-52 text-xl py-2 lg:py-0">
      <div className="w-full  flex items-center  justify-between">
        <div className="w-full flex items-center">
          <img src="assets/Logo-CodeLearn.png" alt="Logo" className="ml-1 lg:ml-0 h-10 lg:h-14" />
          <div className="hidden lg:flex ml-24">
            <ul className="lg:flex w-full justify-start space-x-8">
              <li
                className={`flex justify-center items-center cursor-pointer py-8 font-semibold ${
                  page === 'beranda'
                    ? ' border-b-[3px] border-b-amber-700 text-amber-700 text-brown border-brown'
                    : 'hover:text-amber-700'
                }`}
              >
                <Link to="/" className="flex justify-center items-center cursor-pointer">
                  Beranda
                </Link>
              </li>
              <li
                className={`flex justify-center items-center cursor-pointer py-8 font-semibold ${
                  page === 'tentang-kami'
                    ? ' border-b-[3px] border-b-amber-700 text-amber-700 text-brown border-brown'
                    : 'hover:text-amber-700'
                }`}
              >
                <Link
                  to="/tentang-kami"
                  className="flex justify-center items-center cursor-pointer"
                >
                  Tentang Kami
                </Link>
              </li>
              <li
                className="relative flex justify-center items-center cursor-pointer font-semibold"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span
                  className={`flex items-center gap-1 ${
                    isDropdownOpen || isDropdownHovered ? 'text-amber-700' : ''
                  } ${
                    page.includes('kategori')
                      ? 'py-8 border-b-[3px] border-b-amber-700 text-amber-700 text-brown border-brown'
                      : 'hover:text-amber-700'
                  }`}
                >
                  <span>Kategori</span>
                  <Icon type="dropdown" className="size-3" />
                </span>
                {isDropdownOpen && (
                  <div
                    className="absolute w-[800px] top-[100%] left-0 bg-white shadow-md border rounded-b-lg p-8 py-10 grid grid-cols-3 gap-4 text-sm"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    {categories.map((category) => (
                      <div
                        className="w-full flex items-center justify-start px-4 hover:bg-gray-100"
                        key={category.name}
                      >
                        <Link to={category.url} className="w-full py-2 hover:text-amber-700">
                          {category.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </li>
              <li
                className={`flex justify-center items-center cursor-pointer font-semibold ${
                  page === 'faq'
                    ? 'w-full border-b-[3px] border-b-amber-700 text-amber-700'
                    : 'hover:text-amber-700'
                }`}
              >
                <Link to="/faq" className="flex justify-center items-center cursor-pointer">
                  FAQ
                </Link>
              </li>
              <li
                className={`flex justify-center items-center cursor-pointer font-semibold ${
                  page === 'kontak-kami'
                    ? 'w-full border-b-[3px] border-b-amber-700 text-amber-700'
                    : 'hover:text-amber-700'
                }`}
              >
                <Link to="/kontak-kami" className="flex justify-center items-center cursor-pointer">
                  Kontak Kami
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full flex items-center justify-end lg:hidden">
            <button className="mr-4">
              <Icon type={'bell-alert'} className={'size-4'} />
            </button>
            <button className="mr-4">
              <Icon type={'cart'} className={'size-4'} />
            </button>
            <button className="mr-4">
              <Icon type={'magnifying-glass'} className={'size-4'} />
            </button>
            <button onClick={toggleMobileMenu} className="z-50">
              <Icon
                type={isMobileMenuOpen ? 'x-mark' : 'bars-3'}
                className={`size-8 transition-transform duration-300 ${
                  isMobileMenuOpen ? 'rotate-90' : 'rotate-0'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="hidden w-1/3 h-full lg:flex items-center">
          {isLoggedIn ? (
            <>
              <button className="mr-8">
                <Icon type={'bell-alert'} />
              </button>
              <button className="mr-8">
                <Icon type={'cart'} className={''} />
              </button>
              <button className="mr-2">
                <Icon type={'magnifying-glass'} />
              </button>
              <div className="hidden md:block mr-2">
                <Icon type={'vertical-line'} className={'size-12'} />
              </div>
              <div className="flex items-center">
                <Icon type={'user'} />
                <span className="ml-2 md:ml-4 font-medium">Halo, {name}</span>
              </div>
            </>
          ) : (
            <>
              {page !== 'daftar' && (
                <Link
                  to={'/daftar'}
                  className="p-2 px-8 rounded-3xl font-medium text-white bg-amber-700 mr-8"
                >
                  Daftar
                </Link>
              )}
              {page !== 'login' && (
                <Link
                  to={'/login'}
                  className="p-2 px-8 rounded-3xl font-medium text-white bg-amber-700 mr-8"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {(isMobileMenuOpen || isAnimating) && (
        <div
          className={`fixed inset-0 bg-white z-40 flex flex-col items-center text-lg justify-start pt-20 ${
            isMobileMenuOpen ? 'slide-in' : 'slide-out'
          }`}
        >
          <ul className="flex flex-col w-full items-center space-y-6 overflow-y-auto scrollbar-hide">
            {isLoggedIn ? (
              <div className="flex items-center">
                <Icon type={'user'} />
                <span className="ml-2 md:ml-4 font-medium">Halo, {name}</span>
              </div>
            ) : (
              <>
                {page !== 'register' && (
                  <li
                    className={`flex w-full justify-center items-center cursor-pointer py-4 font-semibold `}
                  >
                    <Link to="/daftar" onClick={toggleMobileMenu}>
                      Register
                    </Link>
                  </li>
                )}
                {page !== 'login' && (
                  <li
                    className={`flex w-full justify-center items-center cursor-pointer py-4 font-semibold `}
                  >
                    <Link to="/login" onClick={toggleMobileMenu}>
                      Login
                    </Link>
                  </li>
                )}
              </>
            )}
            <li
              className={`flex w-full justify-center items-center cursor-pointer py-4 font-semibold ${
                page === 'beranda' ? ' bg-amber-700' : ''
              }`}
            >
              <Link
                to="/"
                onClick={toggleMobileMenu}
                className={`${
                  page === 'beranda' ? 'text-white border-b-2 !important bg-amber-700' : ''
                }`}
              >
                Beranda
              </Link>
            </li>
            <li
              className={`flex w-full justify-center items-center cursor-pointer py-4 font-semibold ${
                page === 'tentang' ? ' bg-amber-700' : ''
              }`}
            >
              <Link
                to="/tentang"
                onClick={toggleMobileMenu}
                className={`${
                  page === 'tentang' ? 'text-white border-b-2 !important bg-amber-700' : ''
                }`}
              >
                Tentang
              </Link>
            </li>
            <li className="flex flex-col w-full justify-center items-center cursor-pointer py-4 font-semibold">
              <span
                className="flex items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Kategori
                <Icon
                  type={'dropdown'}
                  className={`size-3 ml-1 transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </span>
              <div className={`dropdown-content ${isDropdownOpen ? 'show' : 'hide'}`}>
                {isDropdownOpen && (
                  <div className="w-full flex flex-col items-center text-base font-normal mt-4">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.url}
                        onClick={toggleMobileMenu}
                        className="py-2"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
            <li
              className={`flex w-full justify-center items-center cursor-pointer py-4 font-semibold ${
                page === 'faq' ? ' bg-amber-700' : ''
              }`}
            >
              <Link
                to="/faq"
                onClick={toggleMobileMenu}
                className={`${
                  page === 'faq' ? 'text-white border-b-2 !important bg-amber-700' : ''
                }`}
              >
                FAQ
              </Link>
            </li>
            <li
              className={`flex w-full justify-center items-center cursor-pointer py-4 font-semibold ${
                page === 'kontak-kami' ? ' bg-amber-700' : ''
              }`}
            >
              <Link
                to="/kontak-kami"
                onClick={toggleMobileMenu}
                className={`${
                  page === 'kontak-kami' ? 'text-white border-b-2 !important bg-amber-700' : ''
                }`}
              >
                Kontak Kami
              </Link>
            </li>
            {/* Add more navigation links here */}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
