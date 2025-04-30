"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from '../../../public/logo.png'
import SearchBar from "./SearchBar";
import { NavItem } from "@/types/navigation";
// import { isAuth } from "@/lib/isAuth";

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
              href={item.link ? item.link : `/${item.slug}`}
              className="px-3 py-2 text-[var(--surface-darker)] hover:text-[var(--action-primary)] rounded-md text-sm font-inter font-medium tracking-tight transition-colors duration-200 flex items-center"
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
              <div className={`absolute left-0 mt-0 w-[700px] min-h-[350px] invisible group-hover:visible bg-white rounded-md shadow-lg border border-[var(--border-light)] z-50 ${
                item.slug === 'current-affairs' ? 'p-4' : ''
              }`}>
                <div className={`${item.slug === 'current-affairs' ? 'grid grid-cols-3 gap-2' : 'flex h-full'}`}>
                  {item.slug === 'current-affairs' ? (
                    // Special layout for Current Affairs
                    item.children.map((child) => (
                      <div key={child.slug} className="space-y-2">
                        <div className="space-y-1">
                          <h3 className="text-[14px] font-normal text-[var(--surface-darker)] pb-2 border-b border-[var(--bg-elevated)] font-opensans w-full">
                            {child.title}
                          </h3>
                          {child.children.length > 0 && (
                            <div className="space-y-1">
                              {child.children.map((grandChild) => (
                                <Link
                                  key={grandChild.slug}
                                  href={grandChild.link ? grandChild.link : `/${grandChild.slug}`}
                                  className="block px-2 py-1 text-[var(--text-strong)] hover:bg-[var(--bg-main)] hover:text-[var(--action-primary)] rounded-md transition-colors duration-200 text-[14px] font-normal flex items-center font-opensans"
                                >
                                  <svg 
                                    className="w-3 h-3 mr-2 fill-current opacity-80"
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
                      <div className="w-[200px] border-r border-[var(--bg-elevated)] p-4 h-[350px] overflow-y-auto">
                        {item.children.map((child) => (
                          <div key={child.slug} className="mb-2">
                            <Link
                              href={child.link ? child.link : `/${child.slug}`}
                              className="flex px-1 py-1 text-[var(--text-strong)] hover:bg-[var(--bg-main)] hover:text-[var(--action-primary)] rounded-md transition-colors duration-200 text-[14px] font-medium items-center justify-between font-urbanist tracking-wide"
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
                      <div className="flex-1 p-3 h-[350px] overflow-y-auto">
                        {openDropdown &&
                          items.map((parentItem) =>
                            parentItem.slug === hoveredParent &&
                            parentItem.children.map(
                              (child) =>
                                child.slug === openDropdown && (
                                  <div key={child.slug}>
                                    <div className="grid grid-cols-2 gap-3">
                                      {child.children.map((grandChild) => (
                                        <div key={grandChild.slug} className="mb-2">
                                          <Link
                                            href={grandChild.link ? grandChild.link : `/${grandChild.slug}`}
                                            className="block px-3 py-1 text-[var(--text-strong)] hover:bg-[var(--bg-main)] hover:text-[var(--action-primary)] rounded-md transition-colors duration-200 text-[14px] font-normal items-center flex font-opensans"
                                          >
                                            {grandChild.title}
                                          </Link>
                                          {grandChild.children.length > 0 && (
                                            <div className="pl-2 mt-1 space-y-1 border-l-2 border-[var(--bg-elevated)]">
                                              {grandChild.children.map((greatGrandChild) => (
                                                <Link
                                                  key={greatGrandChild.slug}
                                                  href={greatGrandChild.link ? greatGrandChild.link : `/${greatGrandChild.slug}`}
                                                  className="flex px-1 py-1 text-[12.5px] font-inter font-normal tracking-normal text-[var(--text-tertiary)] hover:bg-[var(--bg-main)] hover:text-[var(--action-primary)] rounded-md transition-colors duration-200 items-center"
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
  const [openMenus, setOpenMenus] = useState<OpenMenuState>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(navigation);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileSubmenu = (slug: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  return (
    <body>
    <>
      {/* Spacer div to prevent content overlap */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled ? "h-[60px]" : "h-[72px]"
        }`}
      />

      <nav className={`navbar-bottom-line fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b-0' : ''}`}>
        {/* Top Bar - Hidden when scrolled */}
        <div
          className={`hidden md:block bg-[var(--primary)] w-full transition-all duration-300 ${
            isScrolled ? "h-0 overflow-hidden opacity-0" : "h-12"
          }`}
        >
          <div className="container mx-auto px-6 flex justify-between items-center h-12">
            <div className="mt-1.75">
              <Link href="/shop" passHref>
                <span className="text-[12px] text-white font-bold tracking-wide hover:text-[var(--surface-dark)] 
                               bg-[var(--primary)] border border-white px-4 py-1.5 shadow-sm hover:shadow-md transition-all">
                  Shop Now
                </span>
              </Link>
            </div>

            {/* Login Text with Icon - Right Side */}
            <div className="ml-30">
              <Link href={isLoggedIn ? "/users/dashboard" : "/users/login"} passHref>
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
              <div className="flex-shrink-0 min-w-[35px] mx-2">
                <Link href="/" passHref>
                  <Image
                    src={logo}
                    alt="99Notes"
                    width={40}
                    height={40}
                    className="h-8 w-auto object-contain"
                    priority
                  />
                </Link>
              </div>
              <div className="hidden lg:flex flex-1 justify-center items-center gap-1 ml-4 xl:ml-8">
                <div className="flex items-center space-x-1 xl:space-x-2"></div>
                <NestedNavigation items={navigation} />
                <Link href="/about" passHref>
                  <span
                    className={`px-3 py-2 text-[var(--surface-darker)] hover:text-[var(--action-primary)] rounded-md text-sm font-inter font-medium tracking-tight transition-colors duration-200 flex items-center`}
                  >
                    About 99Notes
                  </span>
                </Link>
                <Link href="/blog" passHref>
                  <span
                    className={`px-3 py-2 text-[var(--surface-darker)] hover:text-[var(--action-primary)] rounded-md text-sm font-inter font-medium tracking-tight transition-colors duration-200 flex items-center`}
                  >
                    Blogs
                  </span>
                </Link>
              </div>

              {/* Desktop search bar */}
              <div className="hidden pr-20 md:block">
                <SearchBar />
              </div>  

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-[var(--text-tertiary)] bg-[var(--tertiary)]
                         hover:text-[var(--warning-border)] hover:bg-[var(--quaternary)] focus:outline-none transition-colors"
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

        {/* Yellow line below navbar */}
        {/* <div className="w-full h-[1px] bg-[var(--primary)]"></div> */}

        {/* Mobile menu */}
        <div
          className={`lg:hidden transform transition-all duration-300 ease-in-out ${
            isOpen 
              ? "translate-y-0 opacity-100 max-h-[80vh] overflow-y-auto" 
              : "-translate-y-2 opacity-0 pointer-events-none max-h-0"
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
                    href={item.link ? item.link : `/${item.slug}`}
                    className="block px-3 py-2 text-base font-medium text-[var(--surface-darker)] hover:bg-[var(--bg-main)] rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.children.length > 0 && (
                    <button
                      onClick={() => toggleMobileSubmenu(item.slug)}
                      className="px-2 py-1 text-[var(--text-tertiary)]"
                    >
                      <svg
                        className={`h-5 w-5 transform transition-transform duration-200 ${
                          openMenus[item.slug] ? 'rotate-180' : ''
                        }`}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                      >
                        <path d="M12.7071 15.2929L19.7071 8.29289C20.0976 7.90237 20.0976 7.2692 19.7071 6.87868C19.3166 6.48815 18.6834 6.48815 18.2929 6.87868L12 13.1716L5.70711 6.87868C5.31658 6.48815 4.68342 6.48815 4.29289 6.87868C3.90237 7.2692 3.90237 7.90237 4.29289 8.29289L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929Z"/>
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
                            className="block px-3 py-2.5 text-base font-medium text-[var(--surface-dark)] hover:bg-[var(--bg-main)] rounded-md transition-colors duration-200 hover:text-[var(--action-primary)]"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.title}
                          </Link>
                          {child.children.length > 0 && (
                            <button
                              onClick={() => toggleMobileSubmenu(child.slug)}
                              className="px-2 py-1 text-[var(--text-tertiary)]"
                            >
                              <svg
                                className={`h-4 w-4 transform transition-transform duration-200 ${
                                  openMenus[child.slug] ? 'rotate-180' : ''
                                }`}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                              >
                                <path d="M12.7071 15.2929L19.7071 8.29289C20.0976 7.90237 20.0976 7.2692 19.7071 6.87868C19.3166 6.48815 18.6834 6.48815 18.2929 6.87868L12 13.1716L5.70711 6.87868C5.31658 6.48815 4.68342 6.48815 4.29289 6.87868C3.90237 7.2692 3.90237 7.90237 4.29289 8.29289L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929Z"/>
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
                                    href={grandChild.link ? grandChild.link : `/${grandChild.slug}`}
                                    className="block px-4 py-2 text-sm font-normal text-[var(--text-strong)] hover:bg-[var(--bg-main)] rounded-md transition-colors duration-200 hover:text-[var(--action-primary)] font-inter font-normal tracking-normal"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {grandChild.title}
                                  </Link>
                                </div>
                                {openMenus[grandChild.slug] && grandChild.children.length > 0 && (
                                  <div className="pl-4 space-y-1 mt-1">
                                    {grandChild.children.map((greatGrandChild) => (
                                      <Link
                                        key={greatGrandChild.slug}
                                        href={greatGrandChild.link ? greatGrandChild.link : `/${greatGrandChild.slug}`}
                                        className="block px-4 py-2 text-sm text-[var(--text-tertiary)] hover:bg-[var(--bg-main)] rounded-md transition-colors duration-200 hover:text-[var(--action-primary)] font-inter font-normal tracking-normal"
                                        onClick={() => setIsOpen(false)}
                                      >
                                        {greatGrandChild.title}
                                      </Link>
                                    ))}
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
            <Link href="/about" passHref>
              <span className="block px-3 py-2.5 text-base font-semibold text-[var(--surface-dark)] hover:bg-[var(--bg-main)] rounded-md transition-colors duration-200 hover:text-[var(--action-primary)] font-opensans" onClick={() => setIsOpen(false)}>
                About 99Notes
              </span>
            </Link>
            <Link href="/blog" passHref>
              <span className="block px-3 py-2.5 text-base font-semibold text-[var(--surface-dark)] hover:bg-[var(--bg-main)] rounded-md transition-colors duration-200 hover:text-[var(--action-primary)] font-opensans" onClick={() => setIsOpen(false)}>
                Blogs
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
    </body>
  );
}
