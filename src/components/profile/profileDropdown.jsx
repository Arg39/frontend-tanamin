import React, { useState } from 'react';
import Icon from '../icons/icon';
import useAuthStore from '../../zustand/authStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useConfirmationModalStore from '../../zustand/confirmationModalStore';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const openModal = useConfirmationModalStore((state) => state.openModal);

  const handleLogoutRequest = () => {
    openModal({
      title: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar?',
      onConfirm: () => {
        logout();
        toast.success('Logout berhasil! Sampai jumpa lagi.');
        navigate('/');
      },
      onCancel: () => {},
    });
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.profile-dropdown-parent')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="relative profile-dropdown-parent z-50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 md:space-x-4 p-1 border border-gray-400 rounded-md hover:bg-gray-100"
        type="button"
      >
        <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full overflow-hidden">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Icon type="user" className="text-gray-600" />
          )}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium">{user?.first_name || 'Guest'}</p>
          <p className="text-xs text-gray-500">{user?.role || 'Role not set'}</p>
        </div>
        <Icon type="arrow-down" className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-5 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
          {user?.role === 'instructor' && (
            <>
              <button
                className="flex items-center gap-3 w-full px-4 py-1 text-left text-primary-900 hover:bg-primary-50 transition rounded-md"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/instruktur/profile');
                }}
                type="button"
              >
                <Icon type="user" />
                <span className="font-base">Edit Profile</span>
              </button>
              <div className="my-1 border-t border-gray-200" />
            </>
          )}
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogoutRequest();
            }}
            className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition rounded-md"
            type="button"
          >
            <Icon type="logout" className="text-red-500" />
            <span className="font-base">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
