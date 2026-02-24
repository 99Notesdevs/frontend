import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { env } from "@/config/env";

interface Category {
  id: number;
  name: string;
}

interface CategorySelectProps {
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number) => void;
  className?: string;
}

export default function CategorySelect({
  selectedCategoryId,
  onCategoryChange,
  className = "",
}: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${env.API_TEST}/categories`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const { data } = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={className}>
      <label className="block mb-2 text-lg font-bold [color:var(--admin-bg-dark)]">
        Select Category
      </label>
      <Select
        value={selectedCategoryId?.toString()}
        onValueChange={(value) => onCategoryChange(Number(value))}
      >
        <SelectTrigger className="w-full bg-white text-[var(--admin-bg-dark)] border border-gray-300 font-medium shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition mb-3">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="z-50 border border-gray-700 shadow-2xl rounded-lg mt-1 min-w-[200px] max-h-64 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-sm"
              autoFocus
            />
          </div>
          {filteredCategories.length === 0 ? (
            <div className="px-4 py-2 text-gray-500 text-sm">No categories found</div>
          ) : (
            filteredCategories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id.toString()}
                className="text-[var(--admin-bg-dark)] px-4 py-2 hover:bg-[#2d323c] cursor-pointer rounded"
              >
                {category.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
