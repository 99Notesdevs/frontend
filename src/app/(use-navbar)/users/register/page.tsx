"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { env } from "@/config/env";
import Cookies from "js-cookie";

const Register = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const router = useRouter();

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      showToast("Passwords do not match!", "warning");
      return;
    }
    try {
      const response = await axios.post(`${env.API}/user/signup`, {
        email,
        firstName,
        lastName,
        password,
      });
      if (response.data.success) {
        const data = response.data.data;
        if (!data) {
          showToast("No token received from server. Please try again later.", "error");
          return;
        }
        Cookies.set('token', data.token, { expires: 5 });
        router.push('/users/dashboard');
        showToast("Registration successful!", "success");
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
      showToast("Registration failed. Please try again later.", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-white px-4 sm:px-6">
      {toast && (
        <div className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-slate-900 text-white' 
            : toast.type === 'warning'
            ? 'bg-yellow-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          <p className="text-sm">{toast.message}</p>
        </div>
      )}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-[340px] sm:max-w-sm border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
              First Name*
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-2 sm:p-2.5 text-sm sm:text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 sm:p-2.5 text-sm sm:text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
              Email*
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 sm:p-2.5 text-sm sm:text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 sm:p-2.5 text-sm sm:text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 leading-5"
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 2L22 22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5C18.3636 5 22 12 22 12C22 12 18.3636 19 12 19C5.63636 19 2 12 2 12C2 12 5.63636 5 12 5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
              Repeat Password*
            </label>
            <input
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              className="w-full p-2 sm:p-2.5 text-sm sm:text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 sm:py-2.5 rounded-lg hover:bg-slate-700 transition duration-200 font-medium mt-2 text-sm sm:text-base"
          >
            Register
          </button>
          <div className="flex justify-between items-center pt-2 text-sm">
            <a
              href="/users/login"
              className="text-yellow-500 hover:text-yellow-600 font-medium"
            >
              Already have an account? Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
