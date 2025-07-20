"use client";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { FiUserPlus, FiRefreshCw, FiCheck, FiX, FiUser, FiMail, FiLock, FiCalendar, FiDollarSign } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

const toastVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { y: -50, opacity: 0, transition: { duration: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userData: {
    paidUser: boolean;
    validTill: string;
  };
}

function ManageUsers() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [paidUser, setPaidUser] = useState("false");
  const [validityDays, setValidityDays] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  // Add new user
  const addUser = async (user: any) => {
    try {
      const response = (await api.post(`/user/signup`, user)) as {
        success: boolean; data: any;
      };
      if (!response.success) throw new Error("Failed to add user");
      setToast({ message: "User added successfully", type: "success" });
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Error adding user:", error);
      setToast({
        message: error.message || "Error adding user",
        type: "error",
      });
    }
  };

  // Fetch single user
  const fetchUser = async (id: string) => {
    try {
      const response = (await api.get(`/user/${id}`)) as {
        success: boolean; data: User;
      };
      setSelectedUser(response.data as User);
      setPaidUser(response.data.userData.paidUser ? "true" : "false");
      setValidityDays(
        response.data.userData.validTill
          ? Math.ceil(
              (new Date(response.data.userData.validTill).getTime() -
                Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          : 0
      );
    } catch (error: any) {
      console.error("Error fetching user:", error);
      setToast({
        message: error.message || "Error fetching user",
        type: "error",
      });
    }
  };

  // Update subscription
  const updateSubscription = async () => {
    try {
      const response = (await api.put(`/user/updateUser/${id}`, {
        paidUser,
        validTill: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000),
      })) as { success: boolean };
      if (!response.success)
        throw new Error("Failed to update subscription");
      setToast({
        message: "Subscription updated successfully",
        type: "success",
      });
      setSelectedUser(null);
      setId("");
    } catch (error: any) {
      console.error("Error updating subscription:", error);
      setToast({
        message: error.message || "Error updating subscription",
        type: "error",
      });
    }
  };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={toastVariants}
                    >
                        <Alert
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                            duration={3000}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-2">User Management</h1>
                    <p className="text-slate-600">Manage user accounts and subscriptions with ease</p>
                </div>
                
                {/* Add New User Section */}
                <motion.div 
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50">
                        <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                            <FiUserPlus className="mr-2 text-indigo-600" />
                            Add New User
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-slate-700">First Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={firstName}
                                        placeholder="John"
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-slate-700">Last Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={lastName}
                                        placeholder="Doe"
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input 
                                        type="email" 
                                        value={email}
                                        placeholder="john@example.com"
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input 
                                        type="password" 
                                        value={password}
                                        placeholder="••••••••"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={() => addUser({ firstName, lastName, email, password })}
                                disabled={!firstName || !lastName || !email || !password}
                                className={`inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                                    (!firstName || !lastName || !email || !password) ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                <FiUserPlus className="mr-2 h-4 w-4" />
                                Add User
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Update Subscription Section */}
                <motion.div 
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                >
                    <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50">
                        <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                            <FiDollarSign className="mr-2 text-indigo-600" />
                            Manage Subscriptions
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <label htmlFor="userId" className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiUser className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="userId"
                                            value={id}
                                            onChange={(e) => setId(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter user ID"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => fetchUser(id)}
                                        disabled={!id.trim()}
                                        className={`inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 h-[42px] ${
                                            !id.trim() ? 'opacity-70 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        <FiRefreshCw className="mr-2 h-4 w-4" />
                                        Fetch User
                                    </button>
                                </div>
                            </div>
                        </div>

                        {selectedUser ? (
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-slate-500 mb-3">USER INFORMATION</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs font-medium text-slate-500">First Name</p>
                                            <p className="text-sm font-medium text-slate-900">{selectedUser.firstName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-500">Last Name</p>
                                            <p className="text-sm font-medium text-slate-900">{selectedUser.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-500">Email</p>
                                            <p className="text-sm font-medium text-slate-900 break-all">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-slate-500 mb-3">SUBSCRIPTION DETAILS</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                                                Subscription Status
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="status"
                                                    value={paidUser}
                                                    onChange={(e) => setPaidUser(e.target.value === "true" ? "true" : "false")}
                                                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                                                >
                                                    <option value="true">Active</option>
                                                    <option value="false">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="validity" className="block text-sm font-medium text-slate-700 mb-1">
                                                Validity (Days)
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiCalendar className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    id="validity"
                                                    type="number"
                                                    min="0"
                                                    value={validityDays}
                                                    onChange={(e) => setValidityDays(parseInt(e.target.value) || 0)}
                                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="30"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-2">
                                    <button
                                        onClick={() => {
                                            setSelectedUser(null);
                                            setId("");
                                        }}
                                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={updateSubscription}
                                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                    >
                                        <FiCheck className="mr-2 h-4 w-4" />
                                        Update Subscription
                                    </button>
                                </div>
                            </div>
                        ) : id ? (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                                    <FiX className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-1">User not found</h3>
                                <p className="text-slate-500 mb-4">No user found with the provided ID.</p>
                                <button
                                    onClick={() => {
                                        setId("");
                                        setSelectedUser(null);
                                    }}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                                >
                                    Clear search and try again
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
                                    <FiUser className="h-8 w-8 text-indigo-500" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-1">No user selected</h3>
                                <p className="text-slate-500">Enter a user ID and click 'Fetch User' to get started</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default ManageUsers;
