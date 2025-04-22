"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { env } from '@/config/env';
import Cookies from 'js-cookie';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function AddAdmin() {
  const router = useRouter();
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    secretKey: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${env.API}/admin/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        throw new Error('Failed to create admin');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create Admin</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={adminData.email}
              onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={adminData.password}
              onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Secret Key</label>
            <input
              type="text"
              value={adminData.secretKey}
              onChange={(e) => setAdminData({ ...adminData, secretKey: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}