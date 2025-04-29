import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, basePath }) => {
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
    if (start > 2) visiblePages.push('...');
    
    // Current page and neighbors
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
    
    // Ellipsis after current page
    if (end < totalPages - 1) visiblePages.push('...');
    
    // Last page
    if (end < totalPages) visiblePages.push(totalPages);
    
    return visiblePages;
  };

  return (
    <div className="flex justify-center mt-8 w-full">
      <div className="flex flex-wrap justify-center max-w-2xl mx-auto">
        {getPagesToShow().map((page) => (
          <Link key={page} href={`${basePath}?page=${page}`} legacyBehavior>
            <a 
              className={`inline-flex items-center justify-center px-3 py-1.5 border rounded-md transition-colors duration-300 
                ${page === currentPage ? 'bg-[var(--primary)] text-white' : 'bg-white text-[var(--surface-darker)] hover:bg-[var(--bg-main)]'}
                ${page === '...' ? 'cursor-default opacity-50' : ''}`}
            >
              {page}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
