import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  createdAt: Date;
  slug: string;
  content: string;
  metadata: string;
  imageUrl: string;
}

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <Link href={`/blog/${blog.slug}`} className="h-[400px] w-full md:w-[275px] lg:w-[275px] xl:w-[275px] bg-white rounded-2xl transition-all duration-300 overflow-hidden">
      <div className="relative h-[180px] w-full overflow-hidden rounded-xl">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className=" pt-4 flex-1">
        <div className="space-y-3 ">
          <h3 className="text-lg font-normal text-gray-800 line-clamp-3">
            {blog.title}
          </h3>
          <span className="text-sm text-gray-500">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
          <p className="text-gray-600 text-sm line-clamp-4">
            {blog.content
              ? blog.content
                  .replace(/<[^>]*>/g, '')
                  .replace(/&nbsp;/g, ' ')
                  .slice(0, 150)
                  .trim() + (blog.content.length > 150 ? '...' : '')
              : 'No content available'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;