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
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-transparent">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 border border-slate-100">
        <h1 className={`${plusJakarta.className} text-2xl font-bold text-slate-800 mb-6 text-center`}>Add New Admin</h1>
        {error && <div className="mb-4 text-center text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              required
              value={adminData.email}
              onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-slate-50 placeholder-slate-400"
              placeholder="admin@email.com"
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-1 font-medium">Password</label>
            <input
              type="password"
              required
              value={adminData.password}
              onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-slate-50 placeholder-slate-400"
              placeholder="Password"
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-1 font-medium">Secret Key</label>
            <input
              type="text"
              required
              value={adminData.secretKey}
              onChange={(e) => setAdminData({ ...adminData, secretKey: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-slate-50 placeholder-slate-400"
              placeholder="Secret Key"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-semibold transition-colors shadow-sm mt-2"
          >
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
}