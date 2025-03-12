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
          <a className={`px-4 py-2 border rounded-md transition-colors duration-300 ${page === currentPage ? 'bg-yellow-500 text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
            {page}
          </a>
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
