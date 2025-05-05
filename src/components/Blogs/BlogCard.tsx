import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  // createdAt: Date;
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
    <Link href={`/blog/${blog.slug}`} className="group block bg-white border border-[var(--border-light)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-[360px] w-full">
      <div className="relative h-[160px] w-full overflow-hidden">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--surface-darker)] mb-2 line-clamp-2 group-hover:text-[var(--secondary)] transition-colors duration-200">
            {blog.title}
          </h3>
          <span className="text-xs text-[var(--text-secondary)] mb-2 block">
            By 99Notes
          </span>
          <p className="text-[var(--text-strong)] text-sm line-clamp-4">
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