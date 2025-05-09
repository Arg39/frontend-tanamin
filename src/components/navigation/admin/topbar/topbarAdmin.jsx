import React from 'react';
import SearchBar from '../../../searchbar/searchbar';
import ProfileDropdown from '../../../profile/profileDropdown';
import Icon from '../../../icons/icon';

export default function TopbarAdmin({ onMenuClick }) {
  return (
    <nav className="bg-white-100 text-white p-4 shadow-md rounded-lg">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex flex-row gap-4 w-full">
          <button className="lg:hidden text-black" onClick={onMenuClick}>
            <Icon type="bars-3" color="black" />
          </button>
          <SearchBar
            onSearch={(query) => console.log(query)}
            width="xl:w-2/5 lg:w-3/5 md:w-4/5 w-4/5"
          />
        </div>
        <ProfileDropdown />
      </div>
    </nav>
  );
}
