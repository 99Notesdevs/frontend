"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { env } from "@/config/env";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const router = useRouter();

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${env.API}/user/forgot-password`, { email });
      if (response.data.success) {
        showToast("Password reset instructions sent to your email!", "success");
        router.push("/users/login");
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to send password reset instructions. Please try again later.", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[var(--bg-main)] to-white dark:from-slate-900 dark:to-slate-800 px-4 sm:px-6 transition-colors duration-200">
      {toast && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : toast.type === 'warning'
            ? 'bg-yellow-500 text-white'
            : 'bg-red-500 text-white'
          }`}>
          <p className="text-sm">{toast.message}</p>
        </div>
      )}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-[340px] sm:max-w-sm border border-[var(--bg-elevated)] dark:border-slate-700/50 hover:shadow-xl transition-shadow duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">Reset Password</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Enter your email to receive a password reset link</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 text-sm text-gray-800 dark:text-white bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white py-2.5 rounded-lg transition duration-200 font-medium mt-4 text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
