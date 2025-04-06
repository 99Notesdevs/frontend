"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { env } from "@/config/env";
import Cookies from "js-cookie";

interface Form {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const FormsPage = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const token = Cookies.get("token");
  const backendUrl = `${env.API}/form`;

  // Fetch all forms from the backend
  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error("Failed to fetch forms");
      const { data } = await response.json();
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a form by ID
  const deleteForm = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${backendUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error("Failed to delete form");
      setForms((prev) => prev.filter((form) => form.id !== id));
    } catch (error) {
      console.error("Error deleting form:", error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Submitted Forms
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            <p>No forms have been submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.id} className="border-t">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {form.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <a
                        href={`mailto:${form.email}`}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {form.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {form.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {form.message}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(form.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="destructive"
                        className="flex items-center justify-center gap-2"
                        onClick={() => deleteForm(form.id)}
                        disabled={deletingId === form.id}
                      >
                        {deletingId === form.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormsPage;
