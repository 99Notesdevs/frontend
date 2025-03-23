import React, { useState } from 'react';

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Courses', path: '/courses' },
    { name: 'Notes', path: '/notes' },
    { name: 'Tests', path: '/tests' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <div className="w-[250px] h-screen bg-white border-r border-gray-200 p-4 sm:p-8 relative">

      {/* Mobile close button */}
      <button 
        className="absolute top-4 right-4 sm:hidden text-gray-500"
        onClick={onClose}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* User Profile Section with adjusted spacing */}
      <div className="flex items-center p-4 border-b border-gray-200 mb-8 mt-6 sm:mt-0">
        <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center mr-4">
          U
        </div>
        <div>
          <p className="m-0 font-bold text-yellow-600">User Name</p>
          <small className="text-yellow-500">Student</small>
        </div>
      </div>

      {/* Navigation Links */}
      <nav>
        {navItems.map((item) => (
          <div
            key={item.name}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`px-4 py-3 my-2 rounded cursor-pointer transition-all duration-300 
              ${hoveredItem === item.name ? 'bg-indigo-900 text-white' : 'text-indigo-900'}`}
          >
            {item.name}

      
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <button 
        className="w-full bg-yellow-500 text-white py-2 sm:py-2.5 rounded-lg hover:bg-slate-700 transition duration-200 font-medium mt-2 text-sm sm:text-base"
        onClick={() => {
          // Add logout logic here
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
