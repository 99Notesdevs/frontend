"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../layout/sidebar";
import Cookies from "js-cookie";
import axios from "axios";
import { env } from "@/config/env";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const token = Cookies.get("token");
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    username: "johndoe123",
    role: "Student",
    dob: "1995-05-15",
    gender: "Male",
    location: "New York, USA",
    avatar: "/default-avatar.png",
    enrolledCourses: [
      { name: "Advanced Mathematics", progress: 75 },
      { name: "Physics 101", progress: 60 },
      { name: "Computer Science", progress: 90 },
    ],
    completedCourses: [
      { name: "Basic Algebra", grade: "A" },
      { name: "Introduction to Programming", grade: "A+" },
    ],
    subscription: {
      plan: "Premium",
      validUntil: "2024-12-31",
    },
    linkedAccounts: {
      google: true,
      facebook: false,
      github: true,
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (token) {
          const res = await axios.get(`${env.API}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.data.success) {
            setUserData(res.data.data);
          } else {
            router.push(`${env.AUTH_PORTAL}/login`);
          }
        } else {
          router.push(`${env.AUTH_PORTAL}/login`);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        router.push(`${env.AUTH_PORTAL}/login`);
      }
    };
    fetchUserData();
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[var(--bg-main)] to-yellow-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-50 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          onClose={() => setIsMobileMenuOpen(false)}
          isMobileOpen={isMobileMenuOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden fixed top-4 left-4 p-2 rounded-full bg-white shadow-lg z-40"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <svg
            className="w-6 h-6 text-[var(--text-tertiary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800/50">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 py-12 relative">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-yellow-100 dark:border-yellow-900/30 shadow-lg">
                  <img
                    src={imagePreview || userData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 hover:shadow-xl">
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </label>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400">
                  Current Plan: {userData.subscription.plan}
                </h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <button className="mt-4 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg">
                    Manage Subscription
                  </button>
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {/* {userData.subscription.plan} */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto p-6 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Personal Information */}
            <div className="bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-slate-700/50">
              <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mb-6">
                Profile Information
              </h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={`${userData.firstName} ${userData.lastName}`}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={userData.phone}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    value={userData.username}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={new Date(userData.dob).toLocaleDateString()}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={userData.gender}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={userData.location}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Reset Password Button */}
            <button className="mx-auto bg-[var(--primary)] text-white px-6 py-2.5 rounded-lg hover:bg-[var(--secondary)] transition-colors duration-300 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
