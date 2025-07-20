"use client";

import { useState, useEffect } from "react";
import { Alert } from "@/components/ui/alert";
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
    <>
      {toast && (
        <Alert
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
      <div className="container mx-auto max-w-5xl px-2 sm:px-6 py-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-bg-secondary)] mb-8 text-center">
            Manage Article Subscriptions
          </h1>
          {/* Create Order Form */}
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-700"
                placeholder="Title"
                value={newOrderTitle}
                onChange={(e) => setNewOrderTitle(e.target.value)}
              />
              <input
                className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-700"
                placeholder="Description"
                value={newOrderDescription}
                onChange={(e) => setNewOrderDescription(e.target.value)}
              />
              <input
                type="number"
                className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-700"
                placeholder="Amount (Rs.)"
                value={newOrderAmount}
                onChange={(e) => setNewOrderAmount(Number(e.target.value))}
              />
              <input
                type="number"
                className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-700"
                placeholder="Validity (Days)"
                value={newOrderValidity}
                onChange={(e) => setNewOrderValidity(Number(e.target.value))}
              />
              <input
                type="number"
                className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-700"
                placeholder="Stock"
                value={newOrderStock}
                onChange={(e) => setNewOrderStock(Number(e.target.value))}
              />
              <select
                className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors text-slate-700"
                value={selectedCategoryId || ""}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="mt-4 w-full sm:w-auto px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold shadow transition"
              onClick={createOrder}
            >
              Create Order
            </button>
          </div>
          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border-b border-slate-200 px-6 py-3 text-slate-700 font-semibold uppercase text-left">
                    Title
                  </th>
                  <th className="border-b border-slate-200 px-6 py-3 text-slate-700 font-semibold uppercase text-left">
                    Description
                  </th>
                  <th className="border-b border-slate-200 px-6 py-3 text-slate-700 font-semibold uppercase text-left">
                    Amount (Rs.)
                  </th>
                  <th className="border-b border-slate-200 px-6 py-3 text-slate-700 font-semibold uppercase text-left">
                    Validity (Days)
                  </th>
                  <th className="border-b border-slate-200 px-6 py-3 text-slate-700 font-semibold uppercase text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="even:bg-white hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-3 text-slate-900 font-medium align-middle">
                      {order.name}
                    </td>
                    <td className="px-6 py-3 text-slate-700 align-middle">
                      {order.description}
                    </td>
                    <td className="px-6 py-3 text-slate-700 align-middle">
                      ₹{order.price}
                    </td>
                    <td className="px-6 py-3 text-slate-700 align-middle">
                      {order.validity}
                    </td>
                    <td className="px-6 py-3 align-middle">
                      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white mr-2 text-xs font-semibold transition">
                        Edit
                      </button>
                      <button className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
