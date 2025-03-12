import React from 'react';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string;
}

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4">
      <h2 className="text-xl font-bold mb-2 text-black">{blog.title}</h2>
      <Link href={`/blogs/${blog.id}`} legacyBehavior>
        <a className="text-blue-600 hover:underline">Read More</a>
      </Link>
    </div>
  );
};

export default BlogCard;