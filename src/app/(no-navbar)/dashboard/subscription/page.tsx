"use client";

import { env } from "@/config/env";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FaExclamationTriangle } from 'react-icons/fa';

const token = Cookies.get("token");

interface Order {
  id: string;
  title: string;
  type: 'Articles';
  description: string;
  amount: number;
  validity: number;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrderTitle, setNewOrderTitle] = useState("");
  const [newOrderDescription, setNewOrderDescription] = useState("");
  const [newOrderAmount, setNewOrderAmount] = useState<number>(0);
  const [newOrderValidity, setNewOrderValidity] = useState<number>(0);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    const response = await fetch(`${env.API}/orders/type/Articles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    const { data } = await response.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async () => {
    if (!newOrderTitle.trim() || !newOrderDescription.trim() || !newOrderAmount || !newOrderValidity) return;
    
    const response = await fetch(`${env.API}/orders`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        title: newOrderTitle, 
        description: newOrderDescription, 
        amount: newOrderAmount,
        validity: newOrderValidity,
        type: 'Articles',
        status: 'active'
      })
    });
    
    if (response.ok) {
      setNewOrderTitle("");
      setNewOrderDescription("");
      setNewOrderAmount(0);
      setNewOrderValidity(0);
      await fetchOrders();
    }
  };

  const updateOrder = async (order: Order) => {
    if (!order || !order.id) return;
    
    const response = await fetch(`${env.API}/orders/${order.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        title: order.title, 
        description: order.description, 
        amount: order.amount,
        validity: order.validity,
        status: order.status
      })
    });
    
    if (response.ok) {
      setEditingOrder(null);
      await fetchOrders();
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteOrderId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = async () => {
    if (!deleteOrderId) return;
    const response = await fetch(`${env.API}/orders/${deleteOrderId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      await fetchOrders();
    }
    setShowDeleteModal(false);
    setDeleteOrderId(null);
  };

  return (
    <div className="container mx-auto max-w-5xl px-2 sm:px-6 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-8 text-center">Manage Article Subscriptions</h1>
        {/* Create Order Form */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-800"
              placeholder="Title"
              value={newOrderTitle}
              onChange={e => setNewOrderTitle(e.target.value)}
            />
            <input
              className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-800"
              placeholder="Description"
              value={newOrderDescription}
              onChange={e => setNewOrderDescription(e.target.value)}
            />
            <input
              type="number"
              className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-800"
              placeholder="Amount (Rs.)"
              value={newOrderAmount}
              onChange={e => setNewOrderAmount(Number(e.target.value))}
            />
            <input
              type="number"
              className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-800"
              placeholder="Validity (Days)"
              value={newOrderValidity}
              onChange={e => setNewOrderValidity(Number(e.target.value))}
            />
          </div>
          <button
            className="mt-4 w-full sm:w-auto px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow transition"
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
                <th className="border-b px-6 py-3 text-slate-700 font-semibold uppercase text-left">Title</th>
                <th className="border-b px-6 py-3 text-slate-700 font-semibold uppercase text-left">Description</th>
                <th className="border-b px-6 py-3 text-slate-700 font-semibold uppercase text-left">Amount (Rs.)</th>
                <th className="border-b px-6 py-3 text-slate-700 font-semibold uppercase text-left">Validity (Days)</th>
                <th className="border-b px-6 py-3 text-slate-700 font-semibold uppercase text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="even:bg-slate-50 hover:bg-slate-100 transition">
                  <td className="px-6 py-3 text-slate-900 font-medium align-middle">{order.title}</td>
                  <td className="px-6 py-3 text-slate-700 align-middle">{order.description}</td>
                  <td className="px-6 py-3 text-slate-700 align-middle">₹{order.amount}</td>
                  <td className="px-6 py-3 text-slate-700 align-middle">{order.validity}</td>
                  <td className="px-6 py-3 align-middle">
                    <button className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white mr-2 text-xs font-semibold transition" onClick={() => setEditingOrder(order)}>Edit</button>
                    <button className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition" onClick={() => handleDeleteClick(order.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editingOrder && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Edit Order</h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={editingOrder.title}
                onChange={(e) => {
                  setEditingOrder({
                    ...editingOrder,
                    title: e.target.value
                  });
                }}
                className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Description</label>
              <input
                type="text"
                value={editingOrder.description}
                onChange={(e) => {
                  setEditingOrder({
                    ...editingOrder,
                    description: e.target.value
                  });
                }}
                className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Amount (Rs.)</label>
              <input
                type="number"
                value={editingOrder.amount}
                onChange={(e) => {
                  setEditingOrder({
                    ...editingOrder,
                    amount: Number(e.target.value)
                  });
                }}
                className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Validity (Days)</label>
              <input
                type="number"
                value={editingOrder.validity}
                onChange={(e) => {
                  setEditingOrder({
                    ...editingOrder,
                    validity: Number(e.target.value)
                  });
                }}
                className="border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors placeholder-slate-400 text-slate-800"
              />
            </div>

            <div className="flex space-x-2 mt-3"> 
              <button
                className="px-6 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow transition"
                onClick={() => updateOrder(editingOrder)}
              >
                Save Changes
              </button>
              <button
                className="px-6 py-2 rounded-md bg-white text-slate-700 hover:bg-slate-100 font-semibold shadow transition"
                onClick={() => setEditingOrder(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full relative">
              <div className="flex flex-col items-center">
                <FaExclamationTriangle className="text-yellow-500 text-4xl mb-3" />
                <h2 className="text-lg font-bold text-slate-800 mb-2">Confirm Deletion</h2>
                <p className="text-slate-600 mb-6 text-center">Are you sure you want to delete this order? This action cannot be undone.</p>
                <div className="flex gap-4 w-full justify-center">
                  <button
                    className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
                    onClick={confirmDeleteOrder}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}