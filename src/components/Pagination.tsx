import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, basePath }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center mt-8 space-x-2">
      {pages.map((page) => (
        <Link key={page} href={`${basePath}?page=${page}`} legacyBehavior>
          <a className={`px-4 py-2 border rounded-md ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}>
            {page}
          </a>
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
