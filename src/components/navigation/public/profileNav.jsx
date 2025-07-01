import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from '../../button/button';
import Icon from '../../icons/icon';
import useAuthStore from '../../../zustand/authStore';

export default function ProfileNav() {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const navbar = document.querySelector('.tanamin-navbar');
      const navbarRect = navbar ? navbar.getBoundingClientRect() : { bottom: 0 };
      setDropdownStyle({
        position: 'absolute',
        top: `${navbarRect.bottom - 6}px`,
        left: `${buttonRect.left}px`,
        minWidth: `${buttonRect.width}px`,
        zIndex: 1001,
      });
    }
  }, [dropdownOpen]);

  return (
    <div className="hidden lg:flex space-x-4">
      {user && user.role === 'student' ? (
        <div className="flex items-center space-x-4">
          <button className="text-primary-700">
            <Icon type={'bell-alert'} />
          </button>
          <button className="text-primary-700">
            <Icon type={'cart-outline'} />
          </button>
          <div className="border-l-[2px] border-primary-700 h-8 opacity-70"></div>
          <div className="relative">
            <button
              ref={buttonRef}
              className="flex items-center gap-2 text-primary-700"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <Icon type="user" className="h-6 w-6" />
              {user?.username || 'student'}
              <Icon type={dropdownOpen ? 'chevron-up' : 'chevron-down'} className="w-4 h-4" />
            </button>
            {dropdownOpen &&
              ReactDOM.createPortal(
                <div
                  ref={dropdownRef}
                  style={dropdownStyle}
                  className="absolute right-0 mt-2 w-44 bg-white-100 border border-gray-200 rounded shadow-lg z-50"
                >
                  {/* Tambahkan tombol lain di sini */}
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                  >
                    <Icon type="logout" className="w-5 h-5 mr-2 text-red-500" />
                    Logout
                  </button>
                </div>,
                document.body
              )}
          </div>
        </div>
      ) : (
        <>
          <Button variant="primary" to={'masuk'} className="text-md">
            Masuk
          </Button>
          <Button variant="primary" to={'daftar'} className="text-md">
            Daftar
          </Button>
        </>
      )}
    </div>
  );
}
