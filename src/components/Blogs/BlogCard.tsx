import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  metadata: string;
  imageUrl: string;
  alt: string;
  createdAt?: string;
  author?: string;
}

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get excerpt from content
  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (!content) return 'No content available';
    
    const text = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')  // Replace &nbsp; with space
      .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
      .trim();

    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <article className="group block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <Link href={`/blog/${blog.slug}`} className="block h-full">
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-slate-700">
          {blog.imageUrl ? (
            <Image
              src={blog.imageUrl}
              alt={blog.alt || blog.title || 'Blog post image'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/images/placeholder-blog.png';
              }}
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-slate-700">
              <span className="text-gray-400 dark:text-gray-500 text-sm">No image available</span>
            </div>
          )}
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
              {blog.title}
            </h3>
            
            {blog.createdAt && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>{formatDate(blog.createdAt)}</span>
                <span className="mx-2">•</span>
                <span>{blog.author || '99Notes'}</span>
              </div>
            )}
            
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {getExcerpt(blog.content, 120)}
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <span className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
              Read more
              <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;