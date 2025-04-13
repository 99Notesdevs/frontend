"use client";

import { useState } from 'react';

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex items-center pr-15">
      <div className={`relative group bg-white border border-black w-full`}>
        <input
          type="text"
          placeholder="Search notes, subjects..."
          className="w-full py-1.5 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 
                    bg-transparent border-none outline-none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-2.5">
          <svg 
            className="w-4 h-4 text-gray-400"
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;