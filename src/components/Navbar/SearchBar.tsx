import { useState } from 'react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search query:', searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="w-[140px] h-[26px] pl-8 pr-2 text-[12px] border border-gray-200 focus:outline-none focus:border-gray-300 rounded-sm placeholder-gray-500 text-black"
        />
        <button
          type="submit"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg 
            className="w-3.5 h-3.5" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;