import React from "react";
import { FilterOptions } from "@/types/currentAffairs";

interface FiltersProps {
  topics: string[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const Filters: React.FC<FiltersProps> = ({
  topics,
  filters,
  onFilterChange,
}) => {
  const handleChange = (key: keyof FilterOptions, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Topic Filter */}
        <select
          className="px-3 py-2 border rounded-md text-sm text-gray-700"
          value={filters.topic || "all"}
          onChange={(e) => handleChange("topic", e.target.value)}
        >
          <option value="all">All Topics</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        {/* Sort Order */}
        <select
          className="px-3 py-2 border rounded-md text-sm text-gray-700"
          value={filters.sortBy}
          onChange={(e) => handleChange("sortBy", e.target.value)}
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
        </select>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="px-3 py-2 border rounded-md text-sm text-gray-700"
            value={filters.dateRange?.start?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              handleChange("dateRange", {
                ...filters.dateRange,
                start: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            className="px-3 py-2 border rounded-md text-sm text-gray-700"
            value={filters.dateRange?.end?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              handleChange("dateRange", {
                ...filters.dateRange,
                end: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
          />
        </div>

        {/* Search */}
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full px-3 py-2 border rounded-md text-sm text-gray-700"
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        {(filters.topic !== "all" ||
          filters.sortBy !== "latest" ||
          filters.search ||
          filters.dateRange) && (
          <button
            onClick={() =>
              onFilterChange({
                sortBy: "latest",
                topic: "all",
              })
            }
            className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;
