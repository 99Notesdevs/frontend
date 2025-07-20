"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/config/api/route";

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
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [selectedFormIds, setSelectedFormIds] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const backendUrl = `/form`;

  // Delete multiple forms by IDs
  const deleteForms = async (ids: number[]) => {
    setDeletingIds(ids);
    try {
      const response = (await api.post(`${backendUrl}/bulk-delete`, {
        ids,
      })) as { success: boolean; data: any[] };
      if (!response.success) throw new Error("Failed to delete forms");
      setForms((prev) => prev.filter((form) => !ids.includes(form.id)));
    } catch (error) {
      console.error("Error deleting forms:", error);
    } finally {
      setDeletingIds([]);
      setShowConfirmModal(false);
      setSelectedFormIds([]);
    }
  };

  // Fetch all forms from the backend
  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const response = (await api.get(`${backendUrl}/all`)) as {
        success: boolean; data: Form[];
      };
      if (!response.success) throw new Error("Failed to fetch forms");
      setForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setIsLoading(false);
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
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div>
              <h1 className="text-3xl font-bold text-[var(--admin-bg-dark)] mb-2">
                Submitted Forms
              </h1>
              <p className="text-sm text-[var(--admin-primary)]">
                View all submitted forms
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center text-[var(--admin-primary)] py-10">
            <p>No forms have been submitted yet.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                disabled={selectedFormIds.length === 0}
                className="bg-red-600 hover:bg-red-700 border-red-700"
              >
                <Trash className="h-4 w-4 mr-2 text-white" />
                <div className="text-white">Delete Selected</div>
              </Button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-[var(--admin-border)] sm:mx-0 mx-[-1.5rem] sm:mt-0 mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--admin-border)] text-sm">
                  <thead className="bg-[var(--admin-bg-light)]">
                    <tr>
                      <th className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedFormIds.length === forms.length}
                          onChange={handleSelectAll}
                          className="accent-indigo-500 w-4 h-4 rounded border-slate-300 focus:ring-2 focus:ring-indigo-400"
                        />
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-[var(--admin-bg-primary)] uppercase tracking-wide">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-[var(--admin-bg-primary)] uppercase tracking-wide">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-[var(--admin-bg-primary)] uppercase tracking-wide">
                        Mobile
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-[var(--admin-bg-primary)] uppercase tracking-wide">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-[var(--admin-bg-primary)] uppercase tracking-wide">
                        Submitted At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--admin-border)]">
                    {forms.map((form, idx) => (
                      <tr
                        key={form.id}
                        className={`transition-colors ${
                          idx % 2 === 0
                            ? "bg-white"
                            : "bg-[var(--admin-bg-lightest)]"
                        } hover:bg-[var(--admin-bg-light)]`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedFormIds.includes(form.id)}
                            onChange={() => handleSelectForm(form.id)}
                            className="accent-indigo-500 w-4 h-4 rounded border-slate-300 focus:ring-2 focus:ring-indigo-400"
                          />
                        </td>
                        <td className="px-6 py-4 text-[var(--admin-bg-dark)] font-medium">
                          {form.name}
                        </td>
                        <td className="px-6 py-4 text-[var(--admin-bg-primary)]">
                          <a
                            href={`mailto:${form.email}`}
                            className="text-indigo-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {form.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-[var(--admin-bg-primary)]">
                          {form.phone}
                        </td>
                        <td className="px-6 py-4 text-[var(--admin-bg-primary)] max-w-xs break-words">
                          {form.message}
                        </td>
                        <td className="px-6 py-4 text-[var(--admin-primary)] text-xs">
                          {new Date(form.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-[var(--admin-bg-dark)] mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-[var(--admin-primary)] mb-6">
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
