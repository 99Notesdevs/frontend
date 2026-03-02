import { useMemo, useState, useEffect } from "react";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
  parentTagId?: number | null;
}

interface MultiCategorySelectProps {
  selectedCategoryIds: number[];
  onCategoryChange: (categoryIds: number[]) => void;
  className?: string;
}

export default function MultiCategorySelect({
  selectedCategoryIds,
  onCategoryChange,
  className = "",
}: MultiCategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const categoryById = useMemo(() => {
    const map = new Map<number, Category>();
    for (const category of categories) {
      map.set(category.id, category);
    }
    return map;
  }, [categories]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${env.API_TEST}/categories`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const { data } = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCategory = (categoryId: number) => {
    if (selectedCategoryIds.includes(categoryId)) {
      onCategoryChange(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategoryIds, categoryId]);
    }
  };

  const getSelectedCategoryNames = () => {
    return categories
      .filter(cat => selectedCategoryIds.includes(cat.id))
      .map(cat => cat.name)
      .join(", ");
  };

  const getHierarchyText = (categoryId: number) => {
    const selected = categoryById.get(categoryId);
    const selectedName = selected?.name ?? `Category ${categoryId}`;

    const parent = selected?.parentTagId != null ? categoryById.get(selected.parentTagId) : undefined;
    const parentName = parent?.name ?? "—";

    const grandparent = parent?.parentTagId != null ? categoryById.get(parent.parentTagId) : undefined;
    const grandparentName = grandparent?.name ?? "—";

    return `${grandparentName} › ${parentName} › ${selectedName}`;
  };

  return (
    <div className={className}>
      <label className="block mb-2 text-lg font-bold [color:var(--admin-bg-dark)]">
        Select Categories <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white text-left text-[var(--admin-bg-dark)] border border-gray-300 font-medium shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition px-3 py-2 rounded-md flex items-center justify-between"
        >
          <span className={selectedCategoryIds ? selectedCategoryIds.length === 0 ? "text-gray-400" : "" : ""}>
            {selectedCategoryIds ? selectedCategoryIds.length === 0 
              ? "Select categories..." 
              : `${selectedCategoryIds.length} selected: ${getSelectedCategoryNames()}` : "Select..."}
          </span>
          <svg 
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
            <div className="sticky top-0 z-10 bg-white p-2 border-b">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredCategories.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm">No categories found</div>
              ) : (
                filteredCategories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-3"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))
              )}
            </div>
            <div className="sticky bottom-0 bg-gray-50 p-2 border-t flex justify-between items-center">
              <span className="text-xs text-gray-600">
                {selectedCategoryIds.length} selected
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryChange([]);
                  }}
                  className="text-xs h-7"
                >
                  Clear All
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-xs h-7 bg-indigo-600 hover:bg-indigo-700"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      { selectedCategoryIds && selectedCategoryIds.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {categories.length === 0 ? (
            <p>Loading category hierarchy…</p>
          ) : (
            <div className="space-y-1">
              {selectedCategoryIds.map((categoryId) => (
                <div key={categoryId} className="flex items-start gap-2">
                  <span className="mt-[2px] text-gray-400">•</span>
                  <span className="leading-relaxed">{getHierarchyText(categoryId)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {selectedCategoryIds && selectedCategoryIds.length === 0 && (
        <p className="mt-1 text-xs text-red-600">At least one category is required</p>
      )}
    </div>
  );
}
