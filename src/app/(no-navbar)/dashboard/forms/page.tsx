"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { env } from "@/config/env";
import Cookies from "js-cookie";

interface Form {
  id: number; // Numeric ID
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const FormsPage = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [selectedFormIds, setSelectedFormIds] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  // Delete multiple forms by IDs
  const deleteForms = async (ids: number[]) => {
    setDeletingIds(ids);
    try {
      const response = await fetch(`${backendUrl}/bulk-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) throw new Error("Failed to delete forms");
      setForms((prev) => prev.filter((form) => !ids.includes(form.id)));
    } catch (error) {
      console.error("Error deleting forms:", error);
    } finally {
      setDeletingIds([]);
      setShowConfirmModal(false);
      setSelectedFormIds([]);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleSelectForm = (id: number) => {
    setSelectedFormIds((prev) =>
      prev.includes(id) ? prev.filter((formId) => formId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFormIds.length === forms.length) {
      setSelectedFormIds([]);
    } else {
      setSelectedFormIds(forms.map((form) => form.id));
    }
  };

  const handleDeleteSelected = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    deleteForms(selectedFormIds);
  };

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
          <>
            <div className="flex justify-end mb-4">
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                disabled={selectedFormIds.length === 0}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedFormIds.length === forms.length}
                        onChange={handleSelectAll}
                      />
                    </th>
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
                  </tr>
                </thead>
                <tbody>
                  {forms.map((form) => (
                    <tr key={form.id} className="border-t">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedFormIds.includes(form.id)}
                          onChange={() => handleSelectForm(form.id)}
                        />
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete the selected forms? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deletingIds.length > 0}
              >
                {deletingIds.length > 0 ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsPage;
