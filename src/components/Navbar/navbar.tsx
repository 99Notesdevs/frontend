"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { isAuth } from "@/lib/isAuth";
import { useAuthModal } from "@/hooks/useAuthModal";
import { env } from "@/config/env";
import { LogOut, User, LayoutDashboard, Search, Menu, X } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import SearchBar from "./SearchBar";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface NavbarProps {
  navigation: NavItem[];
}


function NestedNavigation({
  items,
}: {
  items: NavItem[];
}) {
  return (
    <div className="flex gap-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={item.link ? item.link : `/${item.slug}`}
          className="text-[0.76rem] font-bold tracking-[0.07em] uppercase text-[#7A8873] dark:text-gray-300 no-underline py-[0.2rem] border-b-2 border-transparent transition-all duration-[0.18s] hover:text-[#1865F2] hover:border-[#4A90D9]"
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}

export default function Navbar({ navigation }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
          {/* <Link 
            href="/about" 
            className="text-[0.76rem] font-bold tracking-[0.07em] uppercase text-[#7A8873] dark:text-gray-300 no-underline py-[0.2rem] border-b-2 border-transparent transition-all duration-[0.18s] hover:text-[#1865F2] hover:border-[#4A90D9]"
          >
            About 99Notes
          </Link> */}
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
                <SearchBar compact onClose={() => setShowSearch(false)} />
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1865F2]/10 dark:bg-blue-900/30 flex items-center justify-center text-[#1865F2] dark:text-blue-400">
                  <User className="w-4 h-4" />
                </div>
                <button
                  onClick={() => window.location.href = `${env.TEST_PORTAL}/dashboard`}
                  className="p-2 text-[#7A8873] dark:text-gray-300 hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
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
                  className="p-2 text-[#7A8873] dark:text-gray-300 hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
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
              <SearchBar compact />
            </div>

            {/* Mobile Navigation Links */}
            <div className="p-4 space-y-4">
              {navigation.map((item) => (
                <div key={item.slug} className="py-1">
                  <Link
                    href={item.link ? item.link : `/${item.slug}`}
                    className={`${plusJakarta.className} block text-[0.9rem] font-bold tracking-[0.07em] uppercase text-[#1A1F16] dark:text-white hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
              
              {/* About and Blogs */}
              {/* <Link 
                href="/about" 
                className="block text-[0.9rem] font-bold tracking-[0.07em] uppercase text-[#1A1F16] dark:text-white hover:text-[#1865F2] dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About 99Notes
              </Link> */}
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
