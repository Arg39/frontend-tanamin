import React from 'react';
import SearchBar from '../../../searchbar/searchbar';
import ProfileDropdown from '../../../profile/profileDropdown';

export default function TopbarAdmin({ onMenuClick }) {
  return (
    <nav className="bg-white-100 text-white p-4 shadow-md rounded-lg mt-4 mr-4">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex flex-row gap-4 w-full">
          <button className="lg:hidden text-black" onClick={onMenuClick}>
            ☰
          </button>
          <SearchBar onSearch={(query) => console.log(query)} width="w-2/5" />
        </div>
        <ProfileDropdown />
      </div>
    </nav>
  );
}
