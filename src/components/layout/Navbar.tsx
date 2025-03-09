"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "C:/Dchip/PROJECTS/my-99notes-app/public/assets/images/logo.png"; 
import { navItems, sectionDescriptions } from "../Navbar/navData";
import CustomDropdown from "../Navbar/CustomDropdown";
import UPSCNotesDropdown from "../Navbar/UPSCNotesDropdown";
import SearchBar from "../Navbar/SearchBar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#ff8732] w-full border-b border-[#e67422]">
        <div className="container mx-auto px-6 flex justify-end items-center h-8">
          <div className="flex space-x-10">
            <Link href="/shop" passHref>
              <span className="text-[13px] font-extrabold tracking-wide text-white hover:text-white/90 transition-colors">
                Shop Now
              </span>
            </Link>
            <Link href="/login" passHref>
              <span className="text-[13px] font-extrabold tracking-wide text-white hover:text-white/90 transition-colors">
                Login Account
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-[70px]">
          {/* Logo */}
          <Link href="/" passHref>
            <Image src={logo} alt="99Notes" width={40} height={40} className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-end items-center gap-6 pl-16">
            <div className="flex items-center space-x-10">
              {Object.entries(navItems).map(([key, value]) => (
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
              <span className="text-[14px] font-bold tracking-wide text-gray-800 py-6 px-2 hover:text-blue-700">
                About 99Notes
              </span>
            </Link>
            <Link href="/blogs" passHref>
              <span className="text-[14px] font-bold tracking-wide text-gray-800 py-6 px-2 hover:text-blue-700">
                Blogs
              </span>
            </Link>

            {/* Search Bar */}
            <div className="ml-6">
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
    </nav>
  );
};

export default Navbar;
