'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    excerpt?: string;
    publishedDate: string;
    category?: string;
    author?: string;
    imageUrl?: string;
  };
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const { id, title, excerpt, publishedDate, category, author, imageUrl } = blog;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return 'Date not available';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
      <div className="relative w-full h-[200px]">
        <Image
          src={imageUrl || '/placeholder.jpg'}
          alt={title}
          fill
          className="object-contain rounded-t-xl"
          priority
        />
      </div>
      {category && (
        <span className="text-primary-600 text-sm font-medium mb-2">{category}</span>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-3 flex-grow">
        <Link href={`/blogs/${id}`} className="hover:text-primary-600 transition-colors">
          {title}
        </Link>
      </h3>
      {excerpt && (
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
      )}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{formatDate(publishedDate)}</span>
        {author && <span>By {author}</span>}
      </div>
    </div>
  );
};
