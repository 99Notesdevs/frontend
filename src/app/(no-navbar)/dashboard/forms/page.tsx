"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ArrowLeft } from "lucide-react";
import { env } from "@/config/env";
import Cookies from "js-cookie";

interface Form {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const FormsPage = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
          Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Submitted Forms</h1>
              <p className="text-sm text-slate-500">View all submitted forms</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            <p>No forms have been submitted yet.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {forms.map((form) => (
                  <tr key={form.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {form.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      <a
                        href={`mailto:${form.email}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {form.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {form.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      <div className="line-clamp-2">
                        {form.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(form.createdAt).toLocaleString()}
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
