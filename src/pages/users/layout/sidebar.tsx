"use client";
import Cookies from 'js-cookie';
import axios from 'axios';
import { env } from '@/config/env';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

const Sidebar = ({ onClose, isMobileOpen }: { onClose?: () => void, isMobileOpen?: boolean }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      const token = Cookies.get('token');
      Cookies.remove('token');
      if(token) {
        const response = await axios.post(`${env.API}/user/logout`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.data.success) {
          router.push('/users/login');
        } else {
          router.push('/users/login');
        }
      } else {
        router.push('/users/login');
      }
    } catch(error) {
      console.error("Error checking user authentication: ", error);
        if (axios.isAxiosError(error) && error.response?.status !== 200) {
          console.warn("Unauthorized! Redirecting to login...");
          Cookies.remove('token'); // Remove invalid token
          window.location.href = "/users/login"; // Redirect user
        } else {
          if (axios.isAxiosError(error)) {
            console.error("API Error:", error.response?.status, error.response?.data);
          } else {
            console.error("Unexpected Error:", error);
          }
        }
    }
  }

  const navSections = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Notes', path: '/notes' },
        { name: 'Collections', path: '/collections' },
        { name: 'Favorites', path: '/favorites' },
        { name: 'Recent', path: '/recent' },
      ]
    },
    {
      title: 'Support',
      items: [
        { name: 'Announcements', path: '/announcements' },
        { name: 'FAQs', path: '/faqs' },
        { name: 'Help Center', path: '/help' },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Settings', path: '/settings' },
        { name: 'Upgrade to Pro', path: '/upgrade' },
      ]
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className={`
        h-screen bg-white/80 backdrop-blur-md shadow-xl
        ${isCollapsed ? 'w-20' : 'w-[280px]'}
        transition-all duration-300 ease-in-out
        overflow-y-auto relative
        border-r border-gray-200/50
      `}
    >
      {/* Mobile close button */}
      <button 
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-yellow-50 md:hidden text-gray-600 transition-colors duration-200"
        onClick={onClose}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Content wrapper */}
      <div className="px-4 pt-14 md:pt-4 md:p-6">
        {/* User Profile Section */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'p-4'} border-b border-gray-200/50 mb-6`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white flex items-center justify-center shadow-lg">
            <img src="/default-avatar.png" alt="Profile" className="w-full h-full rounded-full object-cover" />
          </div>
          {!isCollapsed && (
            <div className="ml-4">
              <p className="font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">User Name</p>
              <small className="text-yellow-600">Student</small>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-8">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-3">
              {!isCollapsed && (
                <div 
                  className="flex items-center justify-between text-sm font-semibold text-gray-500 cursor-pointer hover:text-yellow-600 transition-colors duration-200"
                  onClick={() => setExpandedSection(expandedSection === section.title ? null : section.title)}
                >
                  {section.title}
                  <span className="transition-transform duration-200" style={{ transform: expandedSection === section.title ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </div>
              )}
              {(isCollapsed || expandedSection === section.title) && (
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-2 rounded cursor-pointer transition-all duration-300 
                        ${hoveredItem === item.name ? 'bg-yellow-500 text-white' : 'text-yellow-600 hover:bg-yellow-50'}`}
                    >
                      {isCollapsed ? item.name.charAt(0) : item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <button onClick={logout}
          className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-7 sm:py-2.5 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 font-medium mt-10 text-sm sm:text-base`}
        >
          {isCollapsed ? 'L' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
