"use client";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { api } from "@/config/api/route";

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
    <>
      {toast && (
        <Alert
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
      <div className="container mx-auto px-6 lg:px-18 py-8">
        <h1 className="text-3xl font-bold text-center mb-12">
          User Management
        </h1>
        {/* Add New User Section */}
        <div className="mb-12 p-8 bg-white rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-center">Add New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>
          <button
            onClick={() => addUser({ firstName, lastName, email, password })}
            className="mt-8 w-full md:w-auto bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-200 font-medium"
          >
            Add User
          </button>
        </div>

        {/* Update Subscription Section */}
        <div className="p-8 bg-white rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Update Subscription
          </h2>
          <div className="mb-8 flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter User ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full md:w-64 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            <button
              onClick={() => fetchUser(id)}
              className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-200 font-medium"
            >
              Fetch User
            </button>
          </div>

          {selectedUser && (
            <div className="space-y-4">
              <div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      First Name:
                    </span>
                    <span className="font-medium text-slate-900">
                      {selectedUser.firstName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Last Name:
                    </span>
                    <span className="font-medium text-slate-900">
                      {selectedUser.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Email:
                    </span>
                    <span className="font-medium text-slate-900">
                      {selectedUser.email}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-2">Paid Status:</label>
                <div className="relative">
                  <select
                    value={paidUser}
                    onChange={(e) =>
                      setPaidUser(e.target.value === "true" ? "true" : "false")
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2">Validity Days:</label>
                <div className="relative">
                  <input
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 pr-10"
                    placeholder="Enter days"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <span className="text-sm text-slate-400">days</span>
                  </div>
                </div>
              </div>
              <button
                onClick={updateSubscription}
                className="w-full md:w-auto bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-200 font-medium"
              >
                Update Subscription
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ManageUsers;
