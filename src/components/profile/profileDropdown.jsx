import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../zustand/authStore';
import Icon from '../icons/icon';
import ConfirmationModal from '../modal/confirmationModal';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profilePicture, setProfilePicture] = useState(null);

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const confirmLogout = useCallback(() => {
    logout();
    toast.success('Logout berhasil! Sampai jumpa lagi.');
    navigate('/');
    setIsModalOpen(false);
  }, [logout, navigate]);

  const cancelLogout = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 md:space-x-4 p-1 border border-black-200 rounded-md hover:bg-gray-300"
      >
        {/* Profile Picture */}
        <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full overflow-hidden">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Icon type="user" className="text-gray-600" />
          )}
        </div>
        {/* User Info */}
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium">{user?.first_name || 'Guest'}</p>
          <p className="text-xs text-gray-500">{user?.role || 'Role not set'}</p>
        </div>
        {/* Dropdown Icon */}
        <Icon type="dropdown" className="text-gray-600" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white-100 border rounded-md shadow-lg">
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}
