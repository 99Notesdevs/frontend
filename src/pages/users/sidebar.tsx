import React, { useState } from 'react';

const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Courses', path: '/courses' },
    { name: 'Notes', path: '/notes' },
    { name: 'Tests', path: '/tests' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <div className="w-[250px] h-screen bg-white border-r border-gray-200 p-8">
      {/* User Profile Section */}
      <div className="flex items-center p-4 border-b border-gray-200 mb-8">
        <div className="w-10 h-10 rounded-full bg-indigo-900 text-white flex items-center justify-center mr-4">
          U
        </div>
        <div>
          <p className="m-0 font-bold text-indigo-900">User Name</p>
          <small className="text-gray-600">Student</small>
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
      <div className="absolute bottom-8 w-[calc(250px-2rem)]">
        <button className="w-full py-3 px-4 bg-indigo-900 text-white rounded cursor-pointer transition-all duration-300 hover:bg-indigo-700">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
