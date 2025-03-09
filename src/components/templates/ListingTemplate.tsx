import React from 'react';
import { BaseTemplate, BaseTemplateProps } from './BaseTemplate';

interface ListItem {
  title: string;
  description: string;
  slug: string;
  image?: string;
  date?: string;
  category?: string;
  tags?: string[];
}

interface ListingTemplateProps extends Omit<BaseTemplateProps, 'children'> {
  items: ListItem[];
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  filters?: React.ReactNode;
  sortOptions?: Array<{
    label: string;
    value: string;
  }>;
  onSortChange?: (value: string) => void;
  selectedSort?: string;
}

export const ListingTemplate: React.FC<ListingTemplateProps> = ({
  items,
  totalItems = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  filters,
  sortOptions,
  onSortChange,
  selectedSort,
  ...baseProps
}) => {
  return (
    <BaseTemplate {...baseProps}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{baseProps.title}</h1>
          {sortOptions && (
            <select
              className="border rounded-md px-3 py-2"
              value={selectedSort}
              onChange={(e) => onSortChange?.(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {filters && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {filters}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <a
              key={item.slug}
              href={item.slug}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {item.image && (
                <div className="aspect-video relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {item.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  {item.date && (
                    <>
                      <time dateTime={item.date}>
                        {new Date(item.date).toLocaleDateString()}
                      </time>
                      <span className="mx-2">•</span>
                    </>
                  )}
                  {item.category && (
                    <span className="text-blue-600">{item.category}</span>
                  )}
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </BaseTemplate>
  );
}; 