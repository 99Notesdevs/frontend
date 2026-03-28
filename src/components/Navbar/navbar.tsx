"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { isAuth } from "@/lib/isAuth";
import { useAuthModal } from "@/hooks/useAuthModal";
import { env } from "@/config/env";
import { LogOut, User, LayoutDashboard, Search, Menu, X } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface NavbarProps {
  navigation: NavItem[];
}

interface OpenMenuState {
  [key: string]: boolean;
}

function NestedNavigation({
  items,
  level = 1,
}: {
  items: NavItem[];
  level?: number;
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredParent, setHoveredParent] = useState<string | null>(null);

  if (level === 1) {
    return (
      <div className="flex gap-4 relative">
        {items.map((item) => (
          <div
            key={item.slug}
            className="group relative"
            onMouseEnter={() => {
              setHoveredParent(item.slug);
              if (item.children.length > 0) {
                setOpenDropdown(item.children[0].slug);
              }
            }}
            onMouseLeave={() => {
              setHoveredParent(null);
              setOpenDropdown(null);
            }}
          >
            <Link
              href={item.link ? item.link : `/${item.slug}`}
              className="text-[0.76rem] font-bold tracking-[0.07em] uppercase text-[#7A8873] dark:text-gray-300 no-underline py-[0.2rem] border-b-2 border-transparent transition-all duration-[0.18s] hover:text-[#1865F2] hover:border-[#4A90D9] flex items-center"
            >
              {item.title}
              {item.children.length > 0 && (
                <svg
                  className="w-4 h-4 ml-1.5 fill-current opacity-80"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.7071 15.2929L19.7071 8.29289C20.0976 7.90237 20.0976 7.2692 19.7071 6.87868C19.3166 6.48815 18.6834 6.48815 18.2929 6.87868L12 13.1716L5.70711 6.87868C5.31658 6.48815 4.68342 6.48815 4.29289 6.87868C3.90237 7.2692 3.90237 7.90237 4.29289 8.29289L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929Z" />
                </svg>
              )}
            </Link>
            {item.children.length > 0 && (
              <div
                className={`absolute mt-0 w-[max(700px,100%)] min-h-[350px] invisible group-hover:visible bg-white dark:bg-gray-800 rounded-md shadow-lg border border-[#E8EDE2] dark:border-gray-700 z-50 ${
                  item.slug === "current-affairs" ? "p-4" : ""
                } ${
                  items.indexOf(item) >= items.length - 2 ? "right-0" : "left-0"
                }`}
              >
                <div
                  className={`${
                    item.slug === "current-affairs"
                      ? "grid grid-cols-3 gap-2"
                      : "flex h-full"
                  }`}
                >
                  {item.slug === "current-affairs" ? (
                    // Special layout for Current Affairs
                    item.children.map((child) => (
                      <div key={child.slug} className="space-y-2">
                        <div className="space-y-1">
                          <h3 className="text-[14px] font-normal text-[#1A1F16] dark:text-gray-300 pb-2 border-b border-[#E8EDE2] dark:border-gray-700 w-full">
                            {child.title}
                          </h3>
                          {child.children.length > 0 && (
                            <div className="space-y-1">
                              {child.children.map((grandChild) => (
                                <Link
                                  key={grandChild.slug}
                                  href={
                                    grandChild.link
                                      ? grandChild.link
                                      : `/${grandChild.slug}`
                                  }
                                  className="flex px-3 py-1 text-[#1A1F16] dark:text-gray-200 hover:bg-[#F5F7F4] dark:hover:bg-gray-700 hover:text-[#1865F2] dark:hover:text-blue-400 rounded-md transition-colors duration-200 text-[13px] font-normal tracking-[-0.01em] items-center"
                                >
                                  <svg
                                    className="w-3 h-3 mr-2 fill-current opacity-80"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z" />
                                  </svg>
                                  {grandChild.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Original layout for other dropdowns
                    <>
                      {/* Level 2 - Left column */}
                      <div className="w-[200px] border-r border-[#E8EDE2] dark:border-gray-700 p-4 h-[350px] overflow-y-auto">
                        {item.children.map((child) => (
                          <div key={child.slug} className="mb-2">
                            <Link
                              href={child.link ? child.link : `/${child.slug}`}
                              className="flex px-1 py-1 text-[#1A1F16] dark:text-gray-200 hover:bg-[#F5F7F4] dark:hover:bg-gray-700 hover:text-[#1865F2] dark:hover:text-blue-400 rounded-md transition-colors duration-200 text-[14px] font-medium items-center justify-between tracking-wide"
                              onMouseEnter={() => setOpenDropdown(child.slug)}
                            >
                              <span>{child.title}</span>
                              {child.children.length > 0 && (
                                <svg
                                  className="w-3 h-3 fill-current transform -rotate-90 opacity-80"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M12.7071 15.2929L19.7071 8.29289C20.0976 7.90237 20.0976 7.2692 19.7071 6.87868C19.3166 6.48815 18.6834 6.48815 18.2929 6.87868L12 13.1716L5.70711 6.87868C5.31658 6.48815 4.68342 6.48815 4.29289 6.87868C3.90237 7.2692 3.90237 7.90237 4.29289 8.29289L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929Z" />
                                </svg>
                              )}
                            </Link>
                          </div>
                        ))}
                      </div>

                      {/* Level 3 and 4 - Right column */}
                      <div className="flex-1 p-3 h-[350px] overflow-y-auto dark:bg-gray-800">
                        {openDropdown &&
                          items.map(
                            (parentItem) =>
                              parentItem.slug === hoveredParent &&
                              parentItem.children.map(
                                (child) =>
                                  child.slug === openDropdown && (
                                    <div key={child.slug}>
                                      <div className="grid grid-cols-2 gap-3">
                                        {child.children.map((grandChild) => (
                                          <div
                                            key={grandChild.slug}
                                            className="mb-2"
                                          >
                                            <Link
                                              href={
                                                grandChild.link
                                                  ? grandChild.link
                                                  : `/${grandChild.slug}`
                                              }
                                              className="flex px-3 py-1 text-[#1A1F16] dark:text-gray-200 hover:bg-[#F5F7F4] dark:hover:bg-gray-700 hover:text-[#1865F2] dark:hover:text-blue-400 rounded-md transition-colors duration-200 text-[14px] font-normal items-center"
                                            >
                                              {grandChild.title}
                                            </Link>
                                            {grandChild.children.length > 0 && (
                                              <div className="pl-2 mt-1 space-y-1 border-l-2 border-[#E8EDE2]">
                                                {grandChild.children.map(
                                                  (greatGrandChild) => (
                                                    <Link
                                                      key={greatGrandChild.slug}
                                                      href={
                                                        greatGrandChild.link
                                                          ? greatGrandChild.link
                                                          : `/${greatGrandChild.slug}`
                                                      }
                                                      className="flex px-1 py-1 text-[12.5px] font-normal tracking-normal text-[#7A8873] dark:text-gray-400 hover:bg-[#F5F7F4] dark:hover:bg-gray-700 hover:text-[#1865F2] dark:hover:text-blue-400 rounded-md transition-colors duration-200 items-center"
                                                    >
                                                      <svg
                                                        className="w-3 h-3 mr-2 fill-current"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z"
                                                        />
                                                      </svg>
                                                      {greatGrandChild.title}
                                                    </Link>
                                                  )
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )
                              )
                          )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function Navbar({ navigation }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenus, setOpenMenus] = useState<OpenMenuState>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { showLogin } = useAuthModal();

  const refreshAuthStatus = useCallback(async () => {
    try {
      const authStatus = await isAuth();
      setIsLoggedIn(authStatus.isAuthenticated);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      // You can redirect to search results page or handle search as needed
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleMobileSubmenu = (slug: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  useEffect(() => {
    const handleAuthChange = () => {
      refreshAuthStatus();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshAuthStatus();
      }
    };

    refreshAuthStatus();
    window.addEventListener("auth-state-changed", handleAuthChange);
    window.addEventListener("focus", handleAuthChange);
    document.addEventListener("visibilitychange", handleAuthChange);

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthChange);
      window.removeEventListener("focus", handleAuthChange);
      document.removeEventListener("visibilitychange", handleAuthChange);
    };
  }, [refreshAuthStatus]);

  return (
    <>
      {/* Spacer div to prevent content overlap */}
      <div className="h-14 w-full" />

      <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-[1.2rem] h-14 bg-white/97 dark:bg-gray-900/97 border-b border-[#E8EDE2] dark:border-gray-700 backdrop-blur-[14px] gap-4">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="font-serif text-[1.18rem] font-bold tracking-[-0.02em] text-[#1A1F16] dark:text-white no-underline flex-shrink-0"
        >
          99<em className="italic text-[#1865F2]">Notes</em>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-[1.8rem]">
          <NestedNavigation items={navigation} />
          <Link 
            href="/about" 
            className="text-[0.76rem] font-bold tracking-[0.07em] uppercase text-[#7A8873] dark:text-gray-300 no-underline py-[0.2rem] border-b-2 border-transparent transition-all duration-[0.18s] hover:text-[#1865F2] hover:border-[#4A90D9]"
          >
            About 99Notes
          </Link>
          <Link 
            href="/blog" 
            className="text-[0.76rem] font-bold tracking-[0.07em] uppercase text-[#7A8873] dark:text-gray-300 no-underline py-[0.2rem] border-b-2 border-transparent transition-all duration-[0.18s] hover:text-[#1865F2] hover:border-[#4A90D9]"
          >
            Blogs
          </Link>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center relative" ref={searchRef}>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-[#7A8873] dark:text-gray-300 hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {showSearch && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[#E8EDE2] dark:border-gray-700 p-3">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes, topics, questions..."
                    className="flex-1 px-3 py-2 text-sm border border-[#E8EDE2] dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-[#1A1F16] dark:text-white placeholder-[#7A8873] dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1865F2] focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1865F2] text-white text-sm font-medium rounded-md hover:bg-[#1149C0] transition-colors"
                  >
                    Search
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-[#7A8873] dark:text-gray-300 hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Quiz Button - Mobile only */}
          <button 
            className="lg:hidden bg-[#1865F2] text-white border-none px-[1.05rem] py-[0.42rem] rounded-[7px] text-[0.76rem] font-black tracking-[0.02em] transition-all duration-[0.15s] flex-shrink-0 whitespace-nowrap hover:bg-[#1149C0]"
            onClick={() => window.location.href = '/test'}
          >
            Take the Quiz →
          </button>

          {/* User Account */}
          {!isLoading && (
            isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1865F2]/10 dark:bg-blue-900/30 flex items-center justify-center text-[#1865F2] dark:text-blue-400">
                    <User className="w-4 h-4" />
                  </div>
                </button>
                
                {openDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-[#E8EDE2] dark:border-gray-700">
                    <button
                      onClick={() => window.location.href = `${env.TEST_PORTAL}/dashboard`}
                      className="w-full text-left px-4 py-2 text-sm text-[#1A1F16] dark:text-white hover:bg-[#F5F7F4] dark:hover:bg-gray-700 flex items-center"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(`${env.API_AUTH}/user/logout`, {
                            method: 'POST',
                            credentials: 'include',
                          });
                          if (response.ok) {
                            window.location.href = '/';
                          }
                        } catch (error) {
                          console.error('Logout failed:', error);
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#C0392B] dark:text-red-400 hover:bg-[#F5F7F4] dark:hover:bg-gray-700 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={showLogin}
                className="bg-[#1865F2] text-white border-none px-[1.05rem] py-[0.42rem] rounded-[7px] text-[0.76rem] font-black tracking-[0.02em] transition-all duration-[0.15s] flex-shrink-0 whitespace-nowrap hover:bg-[#1149C0]"
              >
                Login
              </button>
            )
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#7A8873] dark:text-gray-300 hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-14 z-[190] bg-white/97 dark:bg-gray-900/97 backdrop-blur-[14px] lg:hidden">
          <div className="h-full overflow-y-auto">
            {/* Mobile Search */}
            <div className="p-4 border-b border-[#E8EDE2] dark:border-gray-700">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes, topics, questions..."
                  className="flex-1 px-3 py-2 text-sm border border-[#E8EDE2] dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-[#1A1F16] dark:text-white placeholder-[#7A8873] dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1865F2] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1865F2] text-white text-sm font-medium rounded-md hover:bg-[#1149C0] transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <div className="p-4 space-y-4">
              {navigation.map((item) => (
                <div key={item.slug} className="py-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.link ? item.link : `/${item.slug}`}
                      className={`${plusJakarta.className} block text-[0.9rem] font-bold tracking-[0.07em] uppercase text-[#1A1F16] dark:text-white hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                    {item.children.length > 0 && (
                      <button
                        onClick={() => toggleMobileSubmenu(item.slug)}
                        className="px-2 py-1 text-[#7A8873] dark:text-gray-300"
                      >
                        <svg
                          className={`h-5 w-5 transform transition-transform duration-200 ${
                            openMenus[item.slug] ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                        >
                          <path d="M12.7071 15.2929L19.7071 8.29289C20.0976 7.90237 20.0976 7.2692 19.7071 6.87868C19.3166 6.48815 18.6834 6.48815 18.2929 6.87868L12 13.1716L5.70711 6.87868C5.31658 6.48815 4.68342 6.48815 4.29289 6.87868C3.90237 7.2692 3.90237 7.90237 4.29289 8.29289L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {openMenus[item.slug] && item.children.length > 0 && (
                    <div className="pl-4 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <div key={child.slug} className="py-1">
                          <div className="flex items-center justify-between">
                            <Link
                              href={child.link ? child.link : `/${child.slug}`}
                              className={`${plusJakarta.className} block text-[0.8rem] font-semibold text-[#1A1F16] dark:text-white hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {child.title}
                            </Link>
                            {child.children.length > 0 && (
                              <button
                                onClick={() => toggleMobileSubmenu(child.slug)}
                                className="px-2 py-1 text-[#7A8873] dark:text-gray-300"
                              >
                                <svg
                                  className={`h-4 w-4 transform transition-transform duration-200 ${
                                    openMenus[child.slug] ? "rotate-180" : ""
                                  }`}
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                >
                                  <path d="M12.7071 15.2929L19.7071 8.29289C20.0976 7.90237 20.0976 7.2692 19.7071 6.87868C19.3166 6.48815 18.6834 6.48815 18.2929 6.87868L12 13.1716L5.70711 6.87868C5.31658 6.48815 4.68342 6.48815 4.29289 6.87868C3.90237 7.2692 3.90237 7.90237 4.29289 8.29289L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929Z" />
                                </svg>
                              </button>
                            )}
                          </div>
                          {openMenus[child.slug] && child.children.length > 0 && (
                            <div className="pl-4 space-y-1 mt-1">
                              {child.children.map((grandChild) => (
                                <div key={grandChild.slug} className="py-1">
                                  <div className="flex items-center justify-between">
                                    <Link
                                      href={
                                        grandChild.link
                                          ? grandChild.link
                                          : `/${grandChild.slug}`
                                      }
                                      className="block text-[0.7rem] font-normal text-[#1A1F16] dark:text-white hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {grandChild.title}
                                    </Link>
                                  </div>
                                  {openMenus[grandChild.slug] &&
                                    grandChild.children.length > 0 && (
                                      <div className="pl-4 space-y-1 mt-1">
                                        {grandChild.children.map(
                                          (greatGrandChild) => (
                                            <Link
                                              key={greatGrandChild.slug}
                                              href={
                                                greatGrandChild.link
                                                  ? greatGrandChild.link
                                                  : `/${greatGrandChild.slug}`
                                              }
                                              className="block text-[0.65rem] text-[#7A8873] dark:text-gray-400 hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors"
                                              onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                              {greatGrandChild.title}
                                            </Link>
                                          )
                                        )}
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* About and Blogs */}
              <Link 
                href="/about" 
                className="block text-[0.9rem] font-bold tracking-[0.07em] uppercase text-[#1A1F16] dark:text-white hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About 99Notes
              </Link>
              <Link 
                href="/blog" 
                className="block text-[0.9rem] font-bold tracking-[0.07em] uppercase text-[#1A1F16] dark:text-white hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blogs
              </Link>

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-[#E8EDE2] dark:border-gray-700">
                {!isLoading && (
                  isLoggedIn ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          window.location.href = `${env.TEST_PORTAL}/dashboard`;
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-[#1A1F16] dark:text-white bg-[#F5F7F4] dark:bg-gray-700 rounded-md flex items-center"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                        Dashboard
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(`${env.API_AUTH}/user/logout`, {
                              method: 'POST',
                              credentials: 'include',
                            });
                            if (response.ok) {
                              window.location.href = '/';
                            }
                          } catch (error) {
                            console.error('Logout failed:', error);
                          }
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-[#C0392B] dark:text-red-400 bg-[#F5F7F4] dark:bg-gray-700 rounded-md flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        showLogin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-[#1865F2] text-white border-none px-[1.05rem] py-[0.42rem] rounded-[7px] text-[0.76rem] font-black tracking-[0.02em] transition-all duration-[0.15s] hover:bg-[#1149C0]"
                    >
                      Login
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
