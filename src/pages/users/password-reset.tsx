"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { env } from '@/config/env';
import Cookies from 'js-cookie';

const PasswordReset = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${env.API}/forgot-password`, {
        email: username,
      });
      if (response.data.success) {
        alert('Password reset link has been sent to your email');
        router.push('/users/login');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-white px-4 sm:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl h-100 shadow-lg w-full max-w-[500px] sm:max-w-lg border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4">Password Reset</h2>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <h4 className='text-gray-600  mb-4 pt-2'>Please Enter your username or email address.
            <br/>You will receive a link to create a new password via email
            </h4>
            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 pt-10">Username or Email Adress:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 sm:p-2.5 text-sm sm:text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
        className="w-full bg-yellow-500 text-white py-2 sm:py-2.5 rounded-lg hover:bg-slate-700 transition duration-200 font-medium mt-2 text-sm sm:text-base">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
