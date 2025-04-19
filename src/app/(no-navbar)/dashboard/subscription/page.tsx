"use client";

import { env } from "@/config/env";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

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

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    const response = await fetch(`${env.API}/orders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.ok) {
      await fetchOrders();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      
      <div className="mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Title</label>
          <input
            type="text"
            value={newOrderTitle}
            onChange={(e) => setNewOrderTitle(e.target.value)}
            placeholder="Enter order title"
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Description</label>
          <input
            type="text"
            value={newOrderDescription}
            onChange={(e) => setNewOrderDescription(e.target.value)}
            placeholder="Enter order description"
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Amount (Rs.)</label>
          <input
            type="number"
            value={newOrderAmount}
            onChange={(e) => setNewOrderAmount(Number(e.target.value))}
            placeholder="Enter amount"
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Validity (Days)</label>
          <input
            type="number"
            value={newOrderValidity}
            onChange={(e) => setNewOrderValidity(Number(e.target.value))}
            placeholder="Enter validity"
            className="border rounded p-2"
          />
        </div>

        <button
          onClick={createOrder}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Order
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Amount (Rs.)</th>
              <th className="border p-2">Validity (Days)</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border p-2">{order.title}</td>
                <td className="border p-2">{order.description}</td>
                <td className="border p-2">{order.amount}</td>
                <td className="border p-2">{order.validity}</td>
                <td className="border p-2">
                  <button
                    onClick={() => setEditingOrder(order)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
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
              className="border rounded p-2"
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
              className="border rounded p-2"
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
              className="border rounded p-2"
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
              className="border rounded p-2"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => updateOrder(editingOrder)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingOrder(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
      