"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { env } from '@/config/env';
import Cookies from 'js-cookie';

const UpdateSubsections = () => {
  const [parentSlug, setParentSlug] = useState('');
  const [subarticleSlug, setSubarticleSlug] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }

      const response = await axios.put(
        `${env.API}/article/parent/${subarticleSlug}`,
        { parentSlug },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      } else {
        alert('Subsection updated successfully');
        console.log('Subsection updated:', response.data);
      }

      // After updating, redirect to the subsections list
      router.push('/dashboard/');
    } catch (error: any) {
      console.error('Failed to update subsection:', error);
      alert(`Failed to update subsection: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-black text-center mb-6">Update Subsections</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-black font-medium mb-2">Parent Article Slug:</label>
            <input
              type="text"
              value={parentSlug}
              onChange={(e) => setParentSlug(e.target.value)}
              required
              className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">Subarticle Slug:</label>
            <input
              type="text"
              value={subarticleSlug}
              onChange={(e) => setSubarticleSlug(e.target.value)}
              required
              className="w-full p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
          >
            Update Subsection
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSubsections;