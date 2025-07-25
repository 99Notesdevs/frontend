"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { isAuth } from "@/lib/isAuth";
import logo from "../../../public/Logo.svg";
import SearchBar from "./SearchBar";
import { NavItem } from "@/types/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ToggleMode } from "./togglemode";

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
              className={`${plusJakarta.className} px-3 py-2 text-[var(--text-strong)] dark:text-slate-200 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)] rounded-md text-[14px] font-semibold tracking-[-0.01em] transition-colors duration-200 flex items-center`}
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
                className={`absolute mt-0 w-[max(700px,100%)] min-h-[350px] invisible group-hover:visible bg-white dark:bg-slate-800 rounded-md shadow-lg border border-[var(--border-light)] dark:border-slate-700 z-50 ${
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
                          <h3 className="text-[14px] font-normal text-[var(--surface-darker)] dark:text-slate-300 pb-2 border-b border-[var(--bg-elevated)] dark:border-slate-700 font-opensans w-full">
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
                                  className={`${plusJakarta.className} flex px-3 py-1 text-[var(--text-strong)] dark:text-slate-200 hover:bg-[var(--bg-main)] dark:hover:bg-slate-700 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)] rounded-md transition-colors duration-200 text-[13px] font-normal tracking-[-0.01em] items-center`}
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
                      <div className="w-[200px] border-r border-[var(--bg-elevated)] dark:border-slate-700 p-4 h-[350px] overflow-y-auto">
                        {item.children.map((child) => (
                          <div key={child.slug} className="mb-2">
                            <Link
                              href={child.link ? child.link : `/${child.slug}`}
                              className="flex px-1 py-1 text-[var(--text-strong)] dark:text-slate-200 hover:bg-[var(--bg-main)] dark:hover:bg-slate-700 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)] rounded-md transition-colors duration-200 text-[14px] font-medium items-center justify-between font-urbanist tracking-wide"
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
                      <div className="flex-1 p-3 h-[350px] overflow-y-auto dark:bg-slate-800">
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
                                              className="flex px-3 py-1 text-[var(--text-strong)] dark:text-slate-200 hover:bg-[var(--bg-main)] dark:hover:bg-slate-700 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)] rounded-md transition-colors duration-200 text-[14px] font-normal items-center font-opensans"
                                            >
                                              {grandChild.title}
                                            </Link>
                                            {grandChild.children.length > 0 && (
                                              <div className="pl-2 mt-1 space-y-1 border-l-2 border-[var(--bg-elevated)]">
                                                {grandChild.children.map(
                                                  (greatGrandChild) => (
                                                    <Link
                                                      key={greatGrandChild.slug}
                                                      href={
                                                        greatGrandChild.link
                                                          ? greatGrandChild.link
                                                          : `/${greatGrandChild.slug}`
                                                      }
                                                      className="flex px-1 py-1 text-[12.5px] font-inter font-normal tracking-normal text-[var(--text-tertiary)] dark:text-slate-400 hover:bg-[var(--bg-main)] dark:hover:bg-slate-700 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)] rounded-md transition-colors duration-200 items-center"
                                                    >
                                                      <svg
                                                        className="w-3 h-3 mr-2 fill-current"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z" />
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
  const [showSearch, setShowSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenus, setOpenMenus] = useState<OpenMenuState>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await isAuth();
        setIsLoggedIn(authStatus.isAuthenticated);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileSubmenu = (slug: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <>
      {/* Spacer div to prevent content overlap */}
      <div className="h-[70px] w-full" />

      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled ? "border-b-0" : ""
        }`}
      >
        {/* Top Bar - Hidden when scrolled */}
        {/* <div
          className={`hidden md:block bg-[var(--primary)] w-full transition-all duration-300 h-0 overflow-hidden opacity-0`}
        >
          <div className="container mx-auto px-6 flex justify-between items-center h-12">
            <div className="mt-1.75">
              <Link href="/shop" passHref>
                <span className="text-[12px] text-white font-bold tracking-wide 
                               bg-[var(--primary)] border border-white px-4 py-1.5 shadow-sm hover:shadow-md transition-all">
                  Shop Now
                </span>
              </Link>
            </div>

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
        </div> */}

        {/* Main Navbar */}
        <div
          className={` w-full max-w-[2000px] transition-all duration-300 -mt-[1px]  ${
            isScrolled
              ? "bg-white h-[70px] dark:bg-slate-900 shadow-md "
              : "bg-white h-[70px] dark:bg-slate-700"
          }`}
        >
          <div className="container w-full max-w-[2000px] px-2 lg:px-12">
            <div className="flex justify-between items-center h-[72px] lg:px-3">
              {/* Logo */}
              <div className="flex-shrink-0 min-w-[35px] mx-2 flex items-center">
                <Link href="/" passHref>
                  <Image
                    src={logo}
                    alt="99Notes"
                    width={180}
                    height={60}
                    className="h-16 w-auto object-contain"
                    priority
                  />
                </Link>
              </div>
              <div className="hidden lg:flex flex-1 justify-end items-center gap-1 2xl:pr-8 ">
                {/* <div className="flex font-bold items-center space-x-1 xl:space-x-2 "></div> */}
                <NestedNavigation items={navigation} />
                <Link href="/about" passHref>
                  <span
                    className={`${plusJakarta.className} px-3 py-2 text-[var(--text-strong)] dark:text-slate-200 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)] rounded-md text-[14px] font-semibold tracking-[-0.01em] transition-colors duration-200 flex items-center`}
                  >
                    About 99Notes
                  </span>
                </Link>
                <Link href="/blog" passHref>
                  <span
                    className={`${plusJakarta.className} px-3 py-2 text-[var(--text-strong)] dark:text-slate-200 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)] rounded-md text-[14px] font-semibold tracking-[-0.01em] transition-colors duration-200 flex items-center`}
                  >
                    Blogs
                  </span>
                </Link>
                <div className="ml-2 flex items-center gap-4">
                  {!isLoading &&
                    (isLoggedIn ? (
                      <Link
                        href="/users/dashboard"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-gray-600 dark:text-gray-300"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href="/users/login"
                        className="group flex items-center gap-2 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)] transition-colors duration-200"
                      >
                        <span className="text-[14px] font-semibold text-[var(--text-strong)] dark:text-slate-200 group-hover:text-[var(--action-primary)] dark:group-hover:text-[var(--action-primary)] transition-colors duration-200">
                          Login
                        </span>
                        <svg
                          className="w-5 h-5 text-[var(--text-strong)] dark:text-slate-200 group-hover:text-[var(--action-primary)] dark:group-hover:text-[var(--action-primary)] transition-colors duration-200"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </Link>
                    ))}
                  {/* Search icon */}
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                  <ToggleMode />
                </div>
              </div>

              {/* Search bar that appears below navbar */}
              {showSearch && (
                <div className="absolute right-0 w-80 top-full bg-white dark:bg-gray-800 shadow-md z-50 p-4 mr-2">
                  <SearchBar onClose={() => setShowSearch(false)} />
                </div>
              )}

              {/* Mobile menu button */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="flex lg:hidden">
                  <ToggleMode />
                  {!isLoading && (
                    <Link
                      href={isLoggedIn ? "/users/dashboard" : "/users/login"}
                      passHref
                    >
                      <div className="flex items-center gap-3 cursor-pointer">
                        {isLoggedIn ? (
                          <div className="w-8 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-gray-600 dark:text-gray-300"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-10 text-[var(--text-strong)] dark:text-slate-200 hover:text-[var(--action-primary)] dark:hover:text-[var(--primary)]"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </>
                        )}
                      </div>
                    </Link>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-[var(--text-tertiary)] bg-[var(--tertiary)] dark:bg-amber-900/20
                         hover:text-[var(--primary)] hover:bg-[var(--quaternary)] dark:hover:bg-amber-900/20 focus:outline-none transition-colors"
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
              ? "translate-y-0 opacity-100 max-h-[80vh] overflow-y-auto"
              : "-translate-y-2 opacity-0 pointer-events-none max-h-0"
          } bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Search Bar in mobile menu */}
            <div className="px-3 py-2 mb-2 border-b border-gray-200 dark:border-slate-700">
              <SearchBar onClose={() => setIsOpen(false)} compact={true} />
            </div>
            {navigation.map((item) => (
              <div key={item.slug} className="py-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.link ? item.link : `/${item.slug}`}
                    className={`${plusJakarta.className} block px-3 py-2.5 text-[14px] font-semibold text-[var(--text-strong)] dark:text-slate-200 hover:bg-[var(--bg-main)] dark:hover:bg-slate-800 rounded-md transition-colors duration-200 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)]`}
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
                            className={`${plusJakarta.className} block px-3 py-2.5 text-[14px] font-semibold text-[var(--text-strong)] dark:text-slate-200 hover:bg-[var(--bg-main)] dark:hover:bg-slate-800 rounded-md transition-colors duration-200 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)]`}
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
                                    className="block px-4 py-2 text-sm font-normal text-[var(--text-strong)] dark:text-slate-200 hover:bg-[var(--bg-main)] dark:hover:bg-slate-800 rounded-md transition-colors duration-200 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)] font-inter tracking-normal"
                                    onClick={() => setIsOpen(false)}
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
                                            className="block px-4 py-2 text-sm text-[var(--text-tertiary)] dark:text-slate-400 hover:bg-[var(--bg-main)] dark:hover:bg-slate-800 rounded-md transition-colors duration-200 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)] font-inter font-normal tracking-normal"
                                            onClick={() => setIsOpen(false)}
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
            <Link href="/about" passHref>
              <span
                className={`${plusJakarta.className} block px-3 py-2.5 text-[14px] font-semibold text-[var(--text-strong)] dark:text-slate-200 hover:bg-[var(--bg-main)] dark:hover:bg-slate-800 rounded-md transition-colors duration-200 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)]`}
                onClick={() => setIsOpen(false)}
              >
                About 99Notes
              </span>
            </Link>
            <Link href="/blog" passHref>
              <span
                className={`${plusJakarta.className} block px-3 py-2.5 text-[14px] font-semibold text-[var(--text-strong)] dark:text-slate-200 hover:bg-[var(--bg-main)] dark:hover:bg-slate-800 rounded-md transition-colors duration-200 hover:text-[var(--action-primary)] dark:hover:text-[var(--action-primary)]`}
                onClick={() => setIsOpen(false)}
              >
                Blogs
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
