"use client";
import { useEffect, useState } from "react";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2, Trash2, ChevronRight } from "lucide-react";

// Define the type for a category
interface Category {
  id: number;
  name: string;
  parentTagId: number | null;
  weight: number;
  createdAt: string;
  updatedAt: string;
  children: Category[] | null;
  level: number;
  isExpanded?: boolean;
  isLoading?: boolean;
}

interface ApiCategory extends Omit<Category, "weight" | "children" | "level"> {
  weight: string | number;
}

// Fetch all categories from the API
const fetchCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${env.API_TEST}/categories`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || res.statusText);
    }

    const result = await res.json();
    if (!result.success) {
      throw new Error("Failed to fetch categories");
    }
    return (result.data as ApiCategory[]).map((category) => ({
      ...category,
      weight: Number(category.weight) || 0,
      children: [],
      level: 1,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Build hierarchical structure from flat array
const buildHierarchy = (categories: Category[]): Category[] => {
  const map = new Map<number, Category>();
  const result: Category[] = [];

  // First pass: create map and set children array
  categories.forEach((category) => {
    map.set(category.id, { ...category, children: [] });
  });

  // Second pass: build hierarchy
  categories.forEach((category) => {
    if (category.parentTagId !== null) {
      const parent = map.get(category.parentTagId);
      if (parent) {
        const child = map.get(category.id);
        if (child && parent.children) {
          parent.children.push(child);
        }
      } else {
        // Keep orphan categories visible when parent is missing from API response.
        const orphanCategory = map.get(category.id);
        if (orphanCategory) {
          result.push(orphanCategory);
        }
      }
    } else {
      const rootCategory = map.get(category.id);
      if (rootCategory) {
        result.push(rootCategory);
      }
    }
  });

  // Third pass: calculate levels and sort by weight
  const calculateLevelsAndSort = (categories: Category[], currentLevel = 1) => {
    categories.sort((a, b) => a.weight - b.weight);
    categories.forEach((category) => {
      category.level = currentLevel;
      if (category.children && category.children.length > 0) {
        calculateLevelsAndSort(category.children, currentLevel + 1);
      }
    });
  };

  calculateLevelsAndSort(result);

  return result;
};

// Category Item Component
const CategoryItem = ({ 
  category, 
  onDelete
}: { 
  category: Category, 
  onDelete: (id: number, name: string) => void
}) => {
  const children = category.children ?? [];
  const hasChildren = children.length > 0;
  const [isExpanded, setIsExpanded] = useState(true);

  // Different background colors for different levels
  const levelColors = [
    'bg-blue-50 border-blue-200', // Level 1
    'bg-green-50 border-green-200', // Level 2
    'bg-yellow-50 border-yellow-200', // Level 3
    'bg-purple-50 border-purple-200', // Level 4
    'bg-pink-50 border-pink-200', // Level 5
  ];
  
  const levelColor = levelColors[Math.min(category.level - 1, levelColors.length - 1)] || levelColors[0];
  const indentSizeRem = 1.1;
  
  return (
    <div className="mb-1" style={{ marginLeft: `${Math.max(category.level - 1, 0) * indentSizeRem}rem` }}>
      <div
        className={`relative category-item ${levelColor} shadow-sm rounded-lg p-3 border transition-colors hover:shadow-md`}
      >
        {category.level > 1 && (
          <>
            <span className="absolute -left-3 top-0 h-1/2 border-l border-gray-300" />
            <span className="absolute -left-3 top-1/2 w-3 border-t border-gray-300" />
          </>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="rounded-sm p-0.5 text-gray-500 hover:bg-white/80"
                aria-label={isExpanded ? "Collapse children" : "Expand children"}
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : "rotate-0"}`}
                />
              </button>
            ) : (
              <span className="w-5" />
            )}
            <div className={`w-3 h-3 rounded-full ${
              levelColor.includes('blue') ? 'bg-blue-500' :
              levelColor.includes('green') ? 'bg-green-500' :
              levelColor.includes('yellow') ? 'bg-yellow-500' :
              levelColor.includes('purple') ? 'bg-purple-500' : 'bg-pink-500'
            }`} />
            <h3 className="text-base font-medium text-gray-800">
              {category.name}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white border border-gray-200 text-gray-600">
              L{category.level}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white border border-gray-200 text-gray-600">
              W:{category.weight}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(category.id, category.name)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1 ml-3 border-l border-dashed border-gray-300 pl-3">
          {children.map((childCategory) => (
            <CategoryItem
              key={childCategory.id}
              category={childCategory}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await fetchCategories();
        const hierarchicalCategories = buildHierarchy(categoriesData);
        setCategories(hierarchicalCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setAlertMessage('Failed to load categories. Please try again.');
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    };
    getCategories();
  }, []);

  // Handle delete category
  const handleDeleteCategory = async (id: number, name: string) => {
    setCategoryToDelete({ id, name });
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const BASE_URL = env.API_TEST; // Use test API URL for categories
      const res = await fetch(`${BASE_URL}/categories/${categoryToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || res.statusText);
      }
      
      // Remove category from state
      const removeCategory = (items: Category[]): Category[] => {
        return items
          .filter((item) => item.id !== categoryToDelete.id)
          .map((item) => ({
            ...item,
            children: item.children ? removeCategory(item.children) : [],
          }));
      };

      setCategories(prevCategories => removeCategory(prevCategories));
      setAlertMessage(`Category "${categoryToDelete.name}" deleted successfully!`);
      setShowAlert(true);
    } catch (error) {
      console.error('Error deleting category:', error);
      setAlertMessage('Failed to delete category. Please try again.');
      setShowAlert(true);
    } finally {
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No categories found
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map(category => (
              <CategoryItem 
                key={category.id} 
                category={category} 
                onDelete={handleDeleteCategory}
              />
            ))}
          </div>
        )}
      </div>

      {/* Alert Toast */}
      {showAlert && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className={`flex items-center gap-3 p-4 rounded-lg shadow-lg ${
            alertMessage.includes('success') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {alertMessage.includes('success') ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            )}
            <span className="text-sm">{alertMessage}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <DialogTitle className="text-lg font-semibold">Delete Category</DialogTitle>
            </div>
            <DialogDescription className="pt-2 text-gray-600">
              Are you sure you want to delete the category "{categoryToDelete?.name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setCategoryToDelete(null);
              }}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCategories;