import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from '../../button/button';
import Icon from '../../icons/icon';
import useAuthStore from '../../../zustand/authStore';
import useConfirmationModalStore from '../../../zustand/confirmationModalStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useNotificationStore from '../../../zustand/public/notificationStore';

export default function ProfileNav({ notificationCount = 0, cartCount = 0 }) {
  const { user, logout } = useAuthStore();
  const openConfirmationModal = useConfirmationModalStore((state) => state.openModal);
  const isModalOpen = useConfirmationModalStore((state) => state.isOpen);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    if (user) fetchUnreadCount();
  }, [user, fetchUnreadCount]);

  // Fungsi untuk update posisi dropdown
  const updateDropdownPosition = () => {
    if (dropdownOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const navbar = document.querySelector('.tanamin-navbar');
      const navbarRect = navbar ? navbar.getBoundingClientRect() : { bottom: 0, height: 0 };

      // Set desired dropdown width
      const dropdownWidth = 240; // px
      // Calculate left position, prevent overflow right
      let left = buttonRect.left;
      if (left + dropdownWidth > window.innerWidth - 16) {
        // 16px margin
        left = window.innerWidth - dropdownWidth - 16;
      }
      if (left < 16) left = 16; // prevent overflow left

      setDropdownStyle({
        position: 'fixed',
        top: `${navbarRect.bottom + 8}px`, // 8px gap from navbar
        left: `${left}px`,
        minWidth: `${dropdownWidth}px`,
        zIndex: 1001,
      });
    }
  };

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
    updateDropdownPosition();
    if (dropdownOpen) {
      window.addEventListener('resize', updateDropdownPosition);
      window.addEventListener('scroll', updateDropdownPosition, true);
    }
    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownOpen]);

  const handleLogoutClick = () => {
    openConfirmationModal({
      title: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar dari akun?',
      variant: 'danger',
      onConfirm: () => {
        logout();
        navigate('/');
        toast.success('Anda telah berhasil keluar dari akun.');
        setDropdownOpen(false);
      },
      onCancel: () => {
        setDropdownOpen(false);
      },
    });
  };

  // Helper for active state
  const isActive = (route) => location.pathname === route;

  return (
    <div className="hidden lg:flex space-x-8">
      {user && user.role === 'student' ? (
        <div className="flex items-center space-x-6">
          <button
            className={`relative text-primary-700 rounded-full p-2 transition ${
              isActive('/notifikasi') ? 'bg-primary-700 text-white' : ''
            }`}
            onClick={() => navigate('/notifikasi')}
          >
            <Icon type={'bell-alert'} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[18px] h-5 flex items-center justify-center font-bold shadow"
                style={{ aspectRatio: '1 / 1' }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          <button
            className={`text-primary-700 rounded-full p-2 transition ${
              isActive('/cart') ? 'bg-primary-700 text-white' : ''
            }`}
            onClick={() => navigate('/cart')}
          >
            <Icon type={'cart-outline'} />
          </button>
          <div className="border-l-[2px] border-primary-700 h-8 opacity-70"></div>
          <div className="relative">
            <button
              ref={buttonRef}
              className={`flex items-center gap-2 text-primary-700 rounded-full p-2 transition ${
                [
                  '/profile',
                  '/my-courses',
                  '/purchase-history',
                  '/bookmarks',
                  '/settings',
                ].includes(location.pathname)
                  ? 'bg-primary-700 text-white'
                  : ''
              }`}
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
                  className={`bg-white border border-gray-200 rounded shadow-lg z-40 min-w-[60] max-w-[90vw] px-4 py-3 ${
                    isModalOpen ? 'pointer-events-none opacity-60' : ''
                  }`}
                >
                  <div className="flex flex-row mb-2">
                    <div className="flex justify-center mb-1">
                      {user?.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt="Foto Profil"
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200">
                          <Icon type="user" className="w-8 h-8 text-gray-400" />
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col justify-center ml-3">
                      <p
                        className="text-sm font-semibold text-gray-800 max-w-[140px] line-clamp-2"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          wordBreak: 'break-word',
                        }}
                      >
                        {user?.first_name} {user?.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button
                    className={`flex items-center w-full px-2 py-2 text-sm hover:bg-gray-100 rounded ${
                      isActive('/profile') ? 'bg-primary-700 text-white' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      navigate('/profile');
                      setDropdownOpen(false);
                    }}
                  >
                    <Icon type="user" className="w-5 h-5 mr-2 text-primary-700" />
                    Profil
                  </button>
                  <button
                    className={`flex items-center w-full px-2 py-2 text-sm hover:bg-gray-100 rounded ${
                      isActive('/my-courses') ? 'bg-primary-700 text-white' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      navigate('/my-courses');
                      setDropdownOpen(false);
                    }}
                  >
                    <Icon type="book" className="w-5 h-5 mr-2 text-primary-700" />
                    Kursus saya
                  </button>
                  <button
                    className={`flex items-center w-full px-2 py-2 text-sm hover:bg-gray-100 rounded ${
                      isActive('/purchase-history') ? 'bg-primary-700 text-white' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      navigate('/purchase-history');
                      setDropdownOpen(false);
                    }}
                  >
                    <Icon type="work-history" className="w-5 h-5 mr-2 text-primary-700" />
                    Riwayat Pembelian
                  </button>
                  <button
                    className={`flex items-center w-full px-2 py-2 text-sm hover:bg-gray-100 rounded ${
                      isActive('/bookmarks') ? 'bg-primary-700 text-white' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      navigate('/bookmarks');
                      setDropdownOpen(false);
                    }}
                  >
                    <Icon type="bookmark" className="w-5 h-5 mr-2 text-primary-700" />
                    Bookmark
                  </button>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button
                    className={`flex items-center w-full px-2 py-2 text-sm hover:bg-gray-100 rounded ${
                      isActive('/settings') ? 'bg-primary-700 text-white' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      navigate('/settings');
                      setDropdownOpen(false);
                    }}
                  >
                    <Icon type="gear" className="w-5 h-5 mr-2 text-secondary-700" />
                    Pengaturan
                  </button>
                  <button
                    className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    onClick={handleLogoutClick}
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
