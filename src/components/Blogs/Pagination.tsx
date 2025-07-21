import React from "react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  basePath,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Function to determine which pages to show
  const getPagesToShow = () => {
    if (totalPages <= 5) return pages;

    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(currentPage + 2, totalPages);

    const visiblePages = [];

    // First page
    if (start > 1) visiblePages.push(1);

    // Ellipsis before current page
    if (start > 2) visiblePages.push("...");

    // Current page and neighbors
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    // Ellipsis after current page
    if (end < totalPages - 1) visiblePages.push("...");

    // Last page
    if (end < totalPages) visiblePages.push(totalPages);

    return visiblePages;
  };

  return (
    <div className="flex justify-center mt-8 w-full">
      <div className="flex flex-wrap justify-center max-w-2xl mx-auto gap-1">
        {currentPage > 1 && (
          <Link href={`${basePath}?page=${currentPage - 1}`} legacyBehavior>
            <a className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-md transition-colors duration-300 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
              &laquo; Prev
            </a>
          </Link>
        )}

        {getPagesToShow().map((page, index) => (
          <div key={page === "..." ? `ellipsis-${index}` : page}>
            {page === "..." ? (
              <span className="inline-flex items-center justify-center px-3 py-1.5 text-gray-500 dark:text-gray-400">
                {page}
              </span>
            ) : (
              <Link href={`${basePath}?page=${page}`} legacyBehavior>
                <a
                  className={`inline-flex items-center justify-center w-10 h-10 border rounded-md transition-colors duration-200
                    ${
                      page === currentPage
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                    }
                    ${page === "..." ? "cursor-default" : ""}`}
                >
                  {page}
                </a>
              </Link>
            )}
          </div>
        ))}

        {currentPage < totalPages && (
          <Link href={`${basePath}?page=${currentPage + 1}`} legacyBehavior>
            <a className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-md transition-colors duration-300 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
              Next &raquo;
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Pagination;
