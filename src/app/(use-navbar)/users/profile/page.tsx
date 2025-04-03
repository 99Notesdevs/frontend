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
            router.push("/users/login");
          }
        } else {
          router.push("/users/login");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        router.push("/users/login");
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
    <div className="flex h-screen bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
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
            className="w-6 h-6 text-gray-600"
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
        <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 py-12 relative">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white/90 shadow-xl transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={imagePreview || userData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 hover:shadow-xl">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
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
                <h1 className="text-4xl font-bold mb-2 text-white/90">
                  {userData.firstName}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {userData.role}
                  </span>
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                <span className="h-8 w-1 bg-yellow-500 rounded-full"></span>
                Personal Information
              </h2>
              <div className="space-y-6">
                {[
                  {
                    label: "Full Name",
                    value: userData.firstName + " " + userData.lastName,
                    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                  },
                  {
                    label: "Email Address",
                    value: userData.email,
                    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  },
                  {
                    label: "Phone Number",
                    value: userData.phone,
                    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                  },
                  {
                    label: "Username",
                    value: userData.username,
                    icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                  {
                    label: "Date of Birth",
                    value: userData.dob,
                    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                  },
                  {
                    label: "Gender",
                    value: userData.gender,
                    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                  },
                  {
                    label: "Location",
                    value: userData.location,
                    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                  },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="group hover:bg-gray-50/50 p-4 rounded-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-500/70 group-hover:text-yellow-500 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={field.icon}
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                          {field.label}
                        </label>
                        <div className="text-gray-900 font-medium mt-1">
                          {field.value}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Password Button */}
            <button className="mx-auto bg-yellow-500 text-white px-6 py-2.5 rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-sm">
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
