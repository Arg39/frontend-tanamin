import React, { useState } from 'react';
import Icon from '../icons/icon';
import useAuthStore from '../../zustand/authStore';

export default function ProfileDropdown({ onLogoutRequest }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const user = useAuthStore((state) => state.user);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 md:space-x-4 p-1 border border-black-200 rounded-md hover:bg-gray-300"
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
        <Icon type="dropdown" className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white-100 border rounded-md shadow-lg">
          <button
            onClick={() => {
              setIsOpen(false);
              onLogoutRequest(); // Trigger logout modal (yang ada di templateAdmin)
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
