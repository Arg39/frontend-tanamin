import React from 'react';
import ProfileDropdown from '../../../profile/profileDropdown';
import Icon from '../../../icons/icon';

export default function TopbarAdmin({ onMenuClick, className }) {
  return (
    <nav className={`bg-white-100 text-white p-4 shadow-md rounded-lg ${className}`}>
      <div className="mx-auto flex justify-between items-center">
        <div className="flex flex-row gap-4 w-full">
          <button className="lg:hidden text-black" onClick={onMenuClick}>
            <Icon type="bars-3" color="black" />
          </button>
          <h2 className="text-black text-xl md:text-3xl text-primary-800 font-bold">
            Tanamin Course
          </h2>
        </div>
        <ProfileDropdown />
      </div>
    </nav>
  );
}
