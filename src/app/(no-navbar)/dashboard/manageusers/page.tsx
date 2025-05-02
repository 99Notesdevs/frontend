'use client';
import { useState } from "react";
import { env } from "@/config/env";
import { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userData: {
        paidUser: boolean;
        validTill: string;
    }
}
export default function ManageUsers() {
    const token = Cookies.get("token");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [id, setId] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [paidUser, setPaidUser] = useState("false");
    const [validityDays, setValidityDays] = useState(0);

    // Add new user
    const addUser = async (user: any) => {
        try {
            const response = await axios.post(`${env.API}/user/signup`, user, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.data.success) throw new Error("Failed to add user");
            alert("User added successfully");
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error("Error adding user:", error);
            alert("Error adding user");
        }
    };

    // Fetch single user
    const fetchUser = async (id: string) => {
        try {
            const response = await axios.get(`${env.API}/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // if (!response.data.ok) throw new Error("Failed to fetch user");
            setSelectedUser(response.data.data as User);
            setPaidUser(response.data.data.userData.paidUser || false);
            setValidityDays(response.data.data.userData.validTill ? Math.ceil((new Date(response.data.data.userData.validTill).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0);
        } catch (error) {
            console.error("Error fetching user:", error);
            alert("Error fetching user");
        }
    };

    // Update subscription
    const updateSubscription = async () => {
        try {
            const response = await axios.put(`${env.API}/user/updateUser/${id}`, {
                paidUser,
                validTill: new Date(Date.now() + (validityDays * 24 * 60 * 60 * 1000))
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.data.success) throw new Error("Failed to update subscription");
            alert("Subscription updated successfully");
            setSelectedUser(null);
            setId("");
        } catch (error) {
            console.error("Error updating subscription:", error);
            alert("Error updating subscription");
        }
    };

    return (
        <div className="container mx-auto px-6 lg:px-18">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            
            {/* Add New User Section */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Add New User</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">First Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter first name"
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Last Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter last name"
                            onChange={(e) => setLastName(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Email</label>
                        <input 
                            type="email" 
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>
                </div>
                <button 
                    onClick={() => addUser({ firstName, lastName, email, password })}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add User
                </button>
            </div>

            {/* Update Subscription Section */}
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Update Subscription</h2>
                <div className="mb-6">
                    <input 
                        type="text" 
                        placeholder="Enter User ID" 
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="border rounded px-3 py-2 mr-2 w-64"
                    />
                    <button 
                        onClick={() => fetchUser(id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Fetch User
                    </button>
                </div>

                {selectedUser && (
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2">First Name: {selectedUser.firstName}</label>
                            <label className="block mb-2">Last Name: {selectedUser.lastName}</label>
                            <label className="block mb-2">Email: {selectedUser.email}</label>
                        </div>
                        <div>
                            <label className="block mb-2">Paid Status:</label>
                            <select
                                value={paidUser}
                                onChange={(e) => setPaidUser(e.target.value === "true" ? "true" : "false")}
                                className="border rounded px-3 py-2"
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Validity Days:</label>
                            <input
                                type="number"
                                value={validityDays}
                                onChange={(e) => setValidityDays(parseInt(e.target.value))}
                                className="border rounded px-3 py-2"
                            />
                        </div>
                        <button 
                            onClick={updateSubscription}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Update Subscription
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}