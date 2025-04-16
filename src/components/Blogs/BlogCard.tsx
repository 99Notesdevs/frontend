import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  createdAt: Date;
  slug: string;
  metadata: string;
  imageUrl: string;
}

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <Link href={`/blogs/${blog.slug}`}>
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-[360px] flex flex-col">
      <div className="relative h-[160px] w-full overflow-hidden">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-[32px]">
          {blog.title}
        
        </h3>
        
        <div className="flex items-center justify-between flex-grow">
          <span className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}
          </span>
          
          <div className="line-clamp-2 h-[32px]">
            {JSON.parse(blog.metadata)?.metaDescription}
          </div>
        </div>
      </div>
    </div>
  </Link>
  );
};


export default BlogCard;