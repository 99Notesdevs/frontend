import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
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
  className = ""
}: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`${env.API_TEST}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
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
        <SelectContent className="z-50 border border-gray-700 shadow-2xl rounded-lg mt-1 min-w-[200px]">
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id.toString()}
              className="text-[var(--admin-bg-dark)] px-4 py-2 hover:bg-[#2d323c] cursor-pointer rounded"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
