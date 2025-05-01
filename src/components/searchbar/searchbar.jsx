import React, { useState } from 'react';
import Icon from '../icons/icon';

export default function SearchBar({ onSearch, width = 'w-full' }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`relative ${width} border rounded-md overflow-hidden flex items-center`}
    >
      <input
        type="text"
        placeholder="Cari..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 pr-10 focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black-400 p-2 flex items-center justify-center"
      >
        <Icon type="magnifying-glass" color="black" />
      </button>
    </form>
  );
}
