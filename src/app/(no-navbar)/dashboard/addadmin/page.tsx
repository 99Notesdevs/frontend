"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { env } from '@/config/env';
import Cookies from 'js-cookie';
import { FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]); // State to store the list of admins

  // Fetch the list of admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${env.API}/admin/all `, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch admins");
        }

        const { data } = await response.json();
        setAdmins(data || []); // Assuming the API returns an array of admins in `data.admins`
      } catch (err) {
        console.error("Error fetching admins:", err);
      }
    };

    fetchAdmins();
  }, []);

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
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-10 border border-slate-100">
        <h1
          className={`${plusJakarta.className} text-2xl font-bold text-slate-800 mb-8 text-center`}
        >
          Add New Admin
        </h1>
        {error && (
          <div className="mb-4 text-center text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block text-slate-700 mb-1 font-medium">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                required
                value={adminData.email}
                onChange={(e) =>
                  setAdminData({ ...adminData, email: e.target.value })
                }
                className="w-full pl-9 border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400"
                placeholder="admin@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={adminData.password}
                onChange={(e) =>
                  setAdminData({ ...adminData, password: e.target.value })
                }
                className="w-full pl-9 pr-10 border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-slate-700 mb-1 font-medium">
              Secret Key
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
                <FaKey />
              </span>
              <input
                type={showSecret ? "text" : "password"}
                required
                value={adminData.secretKey}
                onChange={(e) =>
                  setAdminData({ ...adminData, secretKey: e.target.value })
                }
                className="w-full pl-9 pr-10 border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400"
                placeholder="Secret Key"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowSecret((prev) => !prev)}
                tabIndex={-1}
              >
                {showSecret ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-2/3 mx-auto block py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-colors shadow-sm mt-2"
          >
            Add Admin
          </button>
        </form>

        {/* List of Admins */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            List of Admins
          </h2>
          <ul className="space-y-2">
            {admins.map((admin, index) => (
              <li
                key={index}
                className="p-2 bg-slate-100 rounded shadow-sm flex justify-between items-center"
              >
                <span className="text-slate-700 font-medium">
                  {admin.email}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}