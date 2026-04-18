"use client";

import { useEffect, useMemo, useState } from "react";
import { env } from "@/config/env";
import { Input } from "@/components/ui/input";

interface Category {
  id: number;
  name: string;
}

interface CurrentAffairCategorySelectorProps {
  selectedCategoryIds: number[];
  onChange: (categoryIds: number[]) => void;
  title?: string;
}

export default function CurrentAffairCategorySelector({
  selectedCategoryIds,
  onChange,
  title = "Link Categories",
}: CurrentAffairCategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${env.API_TEST}/categories`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const payload = (await response.json()) as {
          success: boolean;
          data: Category[];
        };

        if (payload.success) {
          setCategories(payload.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories for current affairs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }, [categories, searchTerm]);

  return (
    <div className="rounded-lg border border-slate-200 p-4 bg-white">
      <p className="text-sm font-semibold text-slate-800 mb-2">{title}</p>
      <Input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search categories"
        className="mb-3"
      />

      <div className="max-h-44 overflow-y-auto space-y-2">
        {isLoading && <p className="text-xs text-slate-500">Loading categories...</p>}

        {!isLoading && filteredCategories.length === 0 && (
          <p className="text-xs text-slate-500">No categories found.</p>
        )}

        {!isLoading &&
          filteredCategories.map((category) => {
            const checked = selectedCategoryIds.includes(category.id);
            return (
              <label
                key={category.id}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    const nextCategoryIds = isChecked
                      ? [...selectedCategoryIds, category.id]
                      : selectedCategoryIds.filter((id) => id !== category.id);
                    onChange(nextCategoryIds);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{category.name}</span>
              </label>
            );
          })}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Selected: {selectedCategoryIds.length}
      </p>
    </div>
  );
}
