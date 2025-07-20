"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiCalendar, FiPackage, FiGrid } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from "@/components/ui/alert";

const toastVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { y: -50, opacity: 0, transition: { duration: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const token = Cookies.get("token");
import { api } from "@/config/api/route";


interface Order {
  id: string;
  name: string;
  type: "Articles";
  description: string;
  price: number;
  validity: number;
  createdAt: string;
  updatedAt: string;
  status: string;
}

interface Category {
  id: string;
  name: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [newOrderTitle, setNewOrderTitle] = useState("");
  const [newOrderDescription, setNewOrderDescription] = useState("");
  const [newOrderAmount, setNewOrderAmount] = useState<number>(0);
  const [newOrderValidity, setNewOrderValidity] = useState<number>(0);
  const [newOrderStock, setNewOrderStock] = useState<number>(0);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const fetchOrders = async () => {
    const response = (await api.get(`/product`)) as {
      success: boolean; data: Order[];
    };
    if (!response.success) throw new Error("Failed to fetch orders");
    setOrders(response.data);
  };

  const fetchCategories = async () => {
    const response = (await api.get(`/category`)) as {
      success: boolean; data: Category[];
    };
    if (!response.success) throw new Error("Failed to fetch categories");
    setCategories(response.data);
  };

  useEffect(() => {
    fetchOrders();
    fetchCategories();
  }, []);

  const createOrder = async () => {
    if (
      !newOrderTitle.trim() || // Validate name
      !newOrderDescription.trim() || // Validate description
      !newOrderAmount || // Validate price
      !newOrderStock || // Validate stock
      !newOrderValidity || // Validate validity
      !selectedCategoryId // Validate categoryId
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const response = (await api.post(`/product`, {
      name: newOrderTitle,
      description: newOrderDescription,
      price: newOrderAmount,
      stock: newOrderStock, // Include stock
      validity: newOrderValidity,
      categoryId: selectedCategoryId, // Pass the selected category ID
    })) as { success: boolean; data: Order };

    if (response.success) {
      setNewOrderTitle("");
      setNewOrderDescription("");
      setNewOrderAmount(0);
      setNewOrderStock(0);
      setNewOrderValidity(0);
      setSelectedCategoryId(null);
      await fetchOrders();
      setToast({ message: "Product created successfully", type: "success" });
    } else {
      setToast({
        message: "Failed to create the product. Please try again.",
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
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Subscription Management</h1>
          <p className="text-slate-600">Create and manage your subscription plans</p>
        </div>
        
        {/* Create New Subscription Plan */}
        <motion.div 
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <FiPlus className="mr-2 text-indigo-600" />
              Create New Subscription Plan
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Plan Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPackage className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Premium Articles"
                    value={newOrderTitle}
                    onChange={(e) => setNewOrderTitle(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiGrid className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
                    value={selectedCategoryId || ""}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    value={newOrderAmount}
                    onChange={(e) => setNewOrderAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Validity (Days)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="30"
                    value={newOrderValidity}
                    onChange={(e) => setNewOrderValidity(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Stock</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPackage className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Available quantity"
                    value={newOrderStock}
                    onChange={(e) => setNewOrderStock(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Detailed description of the subscription plan..."
                  value={newOrderDescription}
                  onChange={(e) => setNewOrderDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={createOrder}
                disabled={!newOrderTitle || !selectedCategoryId || !newOrderAmount || !newOrderValidity || !newOrderStock}
                className={`inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                  (!newOrderTitle || !selectedCategoryId || !newOrderAmount || !newOrderValidity || !newOrderStock) 
                    ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Create Subscription Plan
              </button>
            </div>
          </div>
        </motion.div>
        {/* Subscription Plans List */}
        <motion.div 
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50">
            <h2 className="text-xl font-semibold text-slate-800">Active Subscription Plans</h2>
          </div>
          
          <div className="overflow-x-auto">
            {orders.length > 0 ? (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Validity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <FiPackage className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{order.name}</div>
                            <div className="text-xs text-slate-500">{order.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 line-clamp-2">{order.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">₹{order.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiCalendar className="h-4 w-4 text-slate-400 mr-1" />
                          <span className="text-sm text-slate-700">{order.validity} days</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Edit plan"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete plan"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
                  <FiPackage className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No subscription plans yet</h3>
                <p className="text-slate-500">Create your first subscription plan to get started</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
