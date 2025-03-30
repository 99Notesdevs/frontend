"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from '../../../public/logo.png'
import SearchBar from "./SearchBar";
import { NavItem } from "@/types/navigation";

interface NavbarProps {
  navigation: NavItem[];
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
            className="group"
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
              href={`/${item.slug}`}
              className="px-3 py-2 text-gray-800 hover:text-blue-700 rounded-md text-sm font-bold transition-colors duration-200 flex items-center"
            >
              {item.title}
              {item.children.length > 0 && (
                <svg 
                  className="w-4 h-4 ml-1.5 fill-current opacity-80"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.7071 15.2929L19.7071 8.29289C20.0976 7.90237 20.0976 7.2692 19.7071 6.87868C19.3166 6.48815 18.6834 6.48815 18.2929 6.87868L12 13.1716L5.70711 6.87868C5.31658 6.48815 4.68342 6.48815 4.29289 6.87868C3.90237 7.2692 3.90237 7.90237 4.29289 8.29289L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929Z"/>
                </svg>
              )}
            </Link>
            {item.children.length > 0 && (
              <div className={`absolute left-0 mt-0 w-[800px] min-h-[350px] invisible group-hover:visible bg-white rounded-md shadow-lg border border-gray-200 z-50 ${
                item.slug === 'current-affairs' ? 'p-6' : ''
              }`}>
                <div className={`${item.slug === 'current-affairs' ? 'grid grid-cols-4 gap-6' : 'flex h-full'}`}>
                  {item.slug === 'current-affairs' ? (
                    // Special layout for Current Affairs
                    item.children.map((child) => (
                      <div key={child.slug} className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-[15px] font-bold text-gray-900 pb-2 border-b border-gray-100">
                            {child.title}
                          </h3>
                          {child.children.length > 0 && (
                            <div className="space-y-1">
                              {child.children.map((grandChild) => (
                                <Link
                                  key={grandChild.slug}
                                  href={`/${grandChild.slug}`}
                                  className="block py-1.5 text-[13px] text-gray-600 hover:text-blue-600 transition-colors duration-150 hover:bg-gray-50 rounded px-2 flex items-center"
                                >
                                  <svg 
                                    className="w-3 h-3 mr-2 fill-current"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z"/>
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
                      <div className="w-[250px] border-r border-gray-100 p-4 h-[350px] overflow-y-auto">
                        {item.children.map((child) => (
                          <div key={child.slug} className="mb-2">
                            <Link
                              href={`/${child.slug}`}
                              className={` px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm font-medium flex items-center justify-between ${
                                openDropdown === child.slug ? 'bg-gray-50 text-blue-600' : ''
                              }`}
                              onMouseEnter={() => setOpenDropdown(child.slug)}
                            >
                              <span>{child.title}</span>
                              {child.children.length > 0 && (
                                <svg
                                  className="w-3 h-3 fill-current transform -rotate-90 opacity-80"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M12.7071 15.2929L19.7071 8.29289C20.0976 7.90237 20.0976 7.2692 19.7071 6.87868C19.3166 6.48815 18.6834 6.48815 18.2929 6.87868L12 13.1716L5.70711 6.87868C5.31658 6.48815 4.68342 6.48815 4.29289 6.87868C3.90237 7.2692 3.90237 7.90237 4.29289 8.29289L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929Z"/>
                                </svg>
                              )}
                            </Link>
                          </div>
                        ))}
                      </div>
                      
                      {/* Level 3 and 4 - Right column */}
                      <div className="flex-1 p-4 h-[350px] overflow-y-auto">
                        {openDropdown &&
                          items.map((parentItem) =>
                            parentItem.slug === hoveredParent &&
                            parentItem.children.map(
                              (child) =>
                                child.slug === openDropdown && (
                                  <div key={child.slug}>
                                    <div className="grid grid-cols-3 gap-4">
                                      {child.children.map((grandChild) => (
                                        <div key={grandChild.slug} className="mb-4">
                                          <Link
                                            href={`/${grandChild.slug}`}
                                            className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm font-medium flex items-center"
                                          >
                                            <svg 
                                              className="w-3 h-3 mr-2 fill-current"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z"/>
                                            </svg>
                                            {grandChild.title}
                                          </Link>
                                          {grandChild.children.length > 0 && (
                                            <div className="pl-3 mt-2 space-y-1 border-l-2 border-gray-100">
                                              {grandChild.children.map((greatGrandChild) => (
                                                <Link
                                                  key={greatGrandChild.slug}
                                                  href={`/${greatGrandChild.slug}`}
                                                  className="block px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors duration-200 flex items-center"
                                                >
                                                  <svg 
                                                    className="w-3 h-3 mr-2 fill-current"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                  >
                                                    <path d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z"/>
                                                  </svg>
                                                  {greatGrandChild.title}
                                                </Link>
                                              ))}
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
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileSubmenu = (slug: string) => {
    setMobileMenuOpen(mobileMenuOpen === slug ? null : slug);
  };

  return (
    <>
      {/* Spacer div to prevent content overlap */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled ? "h-[60px]" : "h-[72px]"
        }`}
      />

      <nav className="fixed w-full top-0 z-50">
        {/* Top Bar - Hidden when scrolled */}
        <div
          className={`bg-gradient-to-r from-orange-500 to-orange-600 w-full transition-all duration-300 ${
            isScrolled ? "h-0 overflow-hidden opacity-0" : "h-12"
          }`}
        >
          <div className="container mx-auto px-6 flex justify-between items-center h-12">
            <div className="mt-1.75">
              <Link href="/shop" passHref>
                <span className="text-[13px] font-bold tracking-wide text-white hover:text-white/90 transition-colors 
                               bg-gradient-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 
                               px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                  Shop Now
                </span>
              </Link>
            </div>

            {/* Login Text with Icon - Right Side */}
            <div className="ml-30">
              <Link href="/users/login" passHref>
                <div className="flex items-center gap-2 hover:text-white/90 transition-colors">
                  <span className="text-[13px] font-bold tracking-wide text-white ">
                    Login
                  </span>
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div
          className={` w-full transition-all duration-300 -mt-[1px] ${
            isScrolled
              ? "bg-gradient-to-r from-[#f4d03f] via-[#f5ab35] to-[#f39c12] shadow-lg"
              : "bg-white"
          }`}
        >
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex justify-between items-center h-[60px]">
              {/* Logo */}
              <div className="flex-shrink-0 min-w-[40px]">
                <Link href="/" passHref>
                  <Image
                    src={logo}
                    alt="99Notes"
                    width={40}
                    height={40}
                    className="h-10 w-auto object-contain"
                    priority
                  />
                </Link>
              </div>
              <div className="hidden lg:flex flex-1 justify-center items-center gap-1 ml-4 xl:ml-8">
                <div className="flex items-center space-x-1 xl:space-x-2"></div>
                <NestedNavigation items={navigation} />
                <Link href="/about" passHref>
                  <span
                    className={`text-[14px] whitespace-nowrap font-bold tracking-wide py-6 px-2 xl:px-3 
                            transition-all duration-300 relative after:absolute after:bottom-5 after:left-2 
                            after:w-[calc(100%-16px)] after:h-0.5 after:bg-blue-600 after:transform after:scale-x-0 
                            after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                      isScrolled
                        ? "text-gray-800 hover:text-blue-700"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    About 99Notes
                  </span>
                </Link>
                <Link href="/blogs" passHref>
                  <span
                    className={`text-[14px] whitespace-nowrap font-bold tracking-wide py-6 px-2 xl:px-3 transition-colors duration-300 ${
                      isScrolled
                        ? "text-black hover:text-gray-800"
                        : "text-gray-800 hover:text-blue-700"
                    }`}
                  >
                    Blogs
                  </span>
                </Link>
              </div>

              {/* Search Bar - Moved to rightmost */}
              <div className="hidden lg:block ml-auto">
                <SearchBar />
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 
                         hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-all duration-300"
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transform transition-all duration-300 ease-in-out ${
            isOpen 
              ? "translate-y-0 opacity-100" 
              : "-translate-y-2 opacity-0 pointer-events-none"
          } bg-white/95 backdrop-blur-lg shadow-lg`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Search Bar in mobile menu */}
            <div className="px-3 py-2">
              <SearchBar />
            </div>
            
            {navigation.map((item) => (
              <div key={item.slug} className="py-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${item.slug}`}
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    {item.title}
                  </Link>
                  {item.children.length > 0 && (
                    <button
                      onClick={() => toggleMobileSubmenu(item.slug)}
                      className="px-2 py-1 text-gray-500"
                    >
                      {mobileMenuOpen === item.slug ? (
                        <svg
                          className="h-5 w-5 transform rotate-180 fill-current opacity-80"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12.7071 15.2929L19.7071 8.29289C20.0976 7.90237 20.0976 7.2692 19.7071 6.87868C19.3166 6.48815 18.6834 6.48815 18.2929 6.87868L12 13.1716L5.70711 6.87868C5.31658 6.48815 4.68342 6.48815 4.29289 6.87868C3.90237 7.2692 3.90237 7.90237 4.29289 8.29289L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929Z"/>
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 fill-current opacity-80"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12.7071 15.2929L19.7071 8.29289C20.0976 7.90237 20.0976 7.2692 19.7071 6.87868C19.3166 6.48815 18.6834 6.48815 18.2929 6.87868L12 13.1716L5.70711 6.87868C5.31658 6.48815 4.68342 6.48815 4.29289 6.87868C3.90237 7.2692 3.90237 7.90237 4.29289 8.29289L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929Z"/>
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                {mobileMenuOpen === item.slug && item.children.length > 0 && (
                  <div className="pl-4 space-y-1 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/${child.slug}`}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* About and Blogs links in mobile menu */}
            <Link href="/about" passHref>
              <span className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md">
                About 99Notes
              </span>
            </Link>
            <Link href="/blogs" passHref>
              <span className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md">
                Blogs
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
