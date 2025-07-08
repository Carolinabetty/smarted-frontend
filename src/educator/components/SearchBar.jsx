import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ placeholder = 'Search...' }) => {
  return (
    <div className="flex items-center border border-blue-300 rounded-md p-2 bg-white w-full max-w-md">
      <FiSearch className="text-blue-500 mr-2" />
      <input
        type="text"
        placeholder={placeholder}
        className="outline-none w-full text-sm text-gray-700"
      />
    </div>
  );
};

export default SearchBar;
