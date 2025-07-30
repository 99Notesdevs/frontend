"use client";
import { useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "@/config/api/route";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface admin {
  id: number;
  email: string;
}

export default function AddAdmin() {
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    secretKey: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [admins, setAdmins] = useState<admin[]>([]); // State to store the list of admins

  // Fetch the list of admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = (await api.get(`/admin/all`)) as {
          data: admin[];
        };
        
        setAdmins(response.data || []); // Assuming the API returns an array of admins in `data.admins`
      } catch (err) {
        console.error("Error fetching admins:", err);
      }
    };

    fetchAdmins();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const data = await api.post(`/admin/signup`, adminData) as {
        success: boolean;
      };

      if (!data.success) throw new Error("Failed to add admin");

      // Show success message
      setSuccess("Admin added successfully");
      setError(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while adding admin"
      );
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className={`${plusJakarta.className} text-3xl font-extrabold text-gray-900`}>
                Admin Management
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Add new administrators to the system
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Admin Form */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Add New Admin</h2>
                
                {error && (
                  <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={adminData.email}
                        onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg transition duration-150 ease-in-out"
                        placeholder="admin@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={adminData.password}
                        onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg transition duration-150 ease-in-out"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-4 w-4" />
                        ) : (
                          <FaEye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Secret Key
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaKey className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showSecret ? "text" : "password"}
                        required
                        value={adminData.secretKey}
                        onChange={(e) => setAdminData({ ...adminData, secretKey: e.target.value })}
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg transition duration-150 ease-in-out"
                        placeholder="Enter secret key"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowSecret(!showSecret)}
                        tabIndex={-1}
                      >
                        {showSecret ? (
                          <FaEyeSlash className="h-4 w-4" />
                        ) : (
                          <FaEye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                    >
                      Add New Admin
                    </button>
                  </div>
                </form>
              </div>

              {/* Admin List */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">Admin List</h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {admins.length} {admins.length === 1 ? 'Admin' : 'Admins'}
                  </span>
                </div>

                {admins.length > 0 ? (
                  <div className="space-y-4">
                    {admins.map((admin, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {admin.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{admin.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto h-16 w-16 text-gray-400 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No admins yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Add your first admin to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
