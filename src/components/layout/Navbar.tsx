"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/assets/images/logo.png"; 
import { navItems, sectionDescriptions } from "../Navbar/navData";
import CustomDropdown from "../Navbar/CustomDropdown";
import UPSCNotesDropdown from "../Navbar/UPSCNotesDropdown";
import SearchBar from "../Navbar/SearchBar";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="w-full sticky top-0 z-50">
      {/* Top Bar - Hidden when scrolled */}
      <div className={`bg-[#E67E22] w-full border-b border-[#e69b12] transition-all duration-300 ${
        isScrolled ? 'h-0 overflow-hidden' : 'h-12'
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center h-12">
          {/* Shop Now Button - Left Side */}
          <div>
            <Link href="/shop" passHref>
              <span className="text-[13px] font-bold tracking-wide text-white hover:text-white/90 transition-colors bg-[#d35400] px-4 py-1.5 rounded">
                Shop Now
              </span>
            </Link>
          </div>

          {/* Login Text with Icon - Right Side */}
          <div>
            <Link href="/login" passHref>
              <div className="flex items-center gap-2 hover:text-white/90 transition-colors">
                <span className="text-[13px] font-bold tracking-wide text-white">
                  Login
                </span>
                <svg 
                  className="w-6 h-6 text-white" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-[#f4d03f] via-[#f5ab35] to-[#f39c12] shadow-lg' 
          : 'bg-white'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-[70px]">
            {/* Logo */}
            <Link href="/" passHref>
              <Image src={logo} alt="99Notes" width={40} height={40} className="h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-1">
              <div className="flex items-center">
                {Object.entries(navItems).map(([key, value], index) => (
                  <div key={key}>
                    {key === "UPSC Notes" ? (
                      <UPSCNotesDropdown title={key} items={value} />
                    ) : (
                      <CustomDropdown 
                        title={key} 
                        items={Object.entries(value).map(([name, link]) => ({ name, link }))} 
                        defaultDescription={sectionDescriptions[key.replace(" UPSC", "")]} 
                      />
                    )}
                  </div>
                ))}
              </div>

              <Link href="/about" passHref>
                <span className={`text-[14px] font-bold tracking-wide py-6 px-2 transition-colors duration-300 ${
                  isScrolled ? 'text-black hover:text-gray-800' : 'text-gray-800 hover:text-blue-700'
                }`}>
                  About 99Notes
                </span>
              </Link>
              <Link href="/blogs" passHref>
                <span className={`text-[14px] font-bold tracking-wide py-6 px-2 transition-colors duration-300 ${
                  isScrolled ? 'text-black hover:text-gray-800' : 'text-gray-800 hover:text-blue-700'
                }`}>
                  Blogs
                </span>
              </Link>

              {/* Search Bar */}
              <div className="ml-50">
                <SearchBar />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden ${isOpen ? "block" : "hidden"} py-3`}>
            <div className="flex flex-col space-y-3">
              {Object.keys(navItems).map((key) => (
                <Link key={key} href={`/${key.toLowerCase().replace(/\s+/g, "-")}`} passHref>
                  <span className="text-[14px] font-bold tracking-wide text-gray-800 hover:text-blue-700 py-2 px-4">
                    {key}
                  </span>
                </Link>
              ))}
              <Link href="/about" passHref>
                <span className="text-[14px] font-bold tracking-wide text-gray-800 hover:text-blue-700 py-2 px-4">
                  About 99Notes
                </span>
              </Link>
              <Link href="/blogs" passHref>
                <span className="text-[14px] font-bold tracking-wide text-gray-800 hover:text-blue-700 py-2 px-4">
                  Blogs
                </span>
              </Link>

              {/* Mobile Search */}
              <div className="mt-4 px-4">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
