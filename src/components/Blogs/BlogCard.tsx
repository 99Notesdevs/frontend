import React from 'react';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  slug: string;
}

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h3>
      <p className="text-gray-600 mb-4">{blog.excerpt}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{new Date(blog.publishedDate).toLocaleDateString()}</span>
        <Link
          href={`/blogs/${blog.slug.replace(/\s+/g, '-')}`} // Convert spaces to hyphens
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;