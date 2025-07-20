"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/config/api/route";

type Category = {
  id: string;
  name: string;
  weight: string;
  pageId: string;
  parentTagId?: string;
  createdAt: string;
  updatedAt: string;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    weight: "0.0",
    pageId: "",
    parentTagId: "",
  });

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = (await api.get(`/categories`)) as {
        data: { success: boolean; data: any[] };
      };
      const result = response.data;
      if (result.success && Array.isArray(result.data)) {
        // Convert the data to match our Category type
        const categories = result.data.map((item: any) => ({
          ...item,
          id: item.id?.toString() || "",
          pageId: item.pageId?.toString() || "",
          parentTagId: item.parentTagId?.toString() || "",
        }));
        setCategories(categories);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // First update the weight using the specific endpoint
      const weightResponse = (await api.put(
        `/categories/${currentCategory.id}/weight`,
        { weight: formData.weight }
      )) as { data: { success: boolean } };

      if (!weightResponse.data.success)
        throw new Error("Failed to update category weight");

      // Then update other fields using the regular update endpoint
      const updateResponse = (await api.put(
        `/categories/${currentCategory.id}`,
        {
          name: formData.name,
          pageId: Number(formData.pageId), // Convert to number
          parentTagId: formData.parentTagId
            ? Number(formData.parentTagId)
            : null,
        }
      )) as { data: { success: boolean } };

      if (!updateResponse.data.success) {
        console.error("Update error details!");
        throw new Error("Failed to update category");
      }

      toast.success("Category updated successfully");
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      weight: category.weight,
      pageId: category.pageId.toString(),
      parentTagId: category.parentTagId?.toString() || "",
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = (await api.delete(`/categories/${id}`)) as {
        data: { success: boolean };
      };

      if (!response.data.success) throw new Error("Failed to delete category");

      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", weight: "0.0", pageId: "", parentTagId: "" });
    setCurrentCategory({});
    setIsEditing(false);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="p-8">Loading categories...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage existing categories. Editing and deletion only.
        </p>
      </div>

      <div className="border rounded-md">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Weight: {category.weight}</CardDescription>
                <CardDescription>Page ID: {category.pageId}</CardDescription>
                <CardDescription>
                  Parent Tag ID: {category.parentTagId}
                </CardDescription>
                <CardDescription>
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardContent>
              <CardFooter className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(category)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No categories found
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Category</h2>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                &times;
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium mb-1"
                >
                  Weight
                </label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">Update Category</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
