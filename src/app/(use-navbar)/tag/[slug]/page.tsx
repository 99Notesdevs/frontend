'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight, Calendar, Tag as TagIcon } from "lucide-react";
import { env } from "@/config/env";
import { cn } from "@/lib/utils";

interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  tags: Array<{
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface Blog {
  id: number;
  slug: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  tags: Array<{
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export default function TagPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState({
    pages: 1,
    blogs: 1
  });
  const [totalPages, setTotalPages] = useState({
    pages: 1,
    blogs: 1
  });
  const [totalItems, setTotalItems] = useState({
    pages: 0,
    blogs: 0
  });
  const router = useRouter();
  const pathname = usePathname();
  
  const slug = pathname.split('/').pop() || '';

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch pages count
        const pagesCountResponse = await fetch(`${env.API}/tag/count/${slug}`);
        const pagesCountData = await pagesCountResponse.json();
        
        // Fetch blogs count
        const blogsCountResponse = await fetch(`${env.API}/tag/blogs/count/${slug}`);
        const blogsCountData = await blogsCountResponse.json();
        
        setTotalItems({
          pages: pagesCountData.data,
          blogs: blogsCountData.data
        });
        setTotalPages({
          pages: Math.ceil(pagesCountData.data / itemsPerPage),
          blogs: Math.ceil(blogsCountData.data / itemsPerPage)
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    const fetchContent = async () => {
      try {
        // Fetch pages
        const skipPages = (currentPage.pages - 1) * itemsPerPage;
        const responsePages = await fetch(`${env.API}/tag/${slug}?skip=${skipPages}&take=${itemsPerPage}`);
        const dataPages = await responsePages.json();
        setPages(dataPages.data);

        // Fetch blogs
        const skipBlogs = (currentPage.blogs - 1) * itemsPerPage;
        const responseBlogs = await fetch(`${env.API}/tag/blogs/${slug}?skip=${skipBlogs}&take=${itemsPerPage}`);
        const dataBlogs = await responseBlogs.json();
        setBlogs(dataBlogs.data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts().then(() => fetchContent());
  }, [slug, currentPage.pages, currentPage.blogs]);

  const handlePageClick = (slug: string) => {
    router.push(`/${slug}`);
  };

  const handleBlogClick = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  const handlePageChange = (type: 'pages' | 'blogs', page: number) => {
    setCurrentPage(prev => ({ ...prev, [type]: page }));
    setLoading(true); // Show loading state while fetching new page
  };

  // Loading skeleton component
  const CardSkeleton = () => (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = ({ type }: { type: 'pages' | 'blogs' }) => (
    <div className="text-center py-12 border rounded-lg">
      <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No {type} found</h3>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        There are no {type} associated with this tag yet.
      </p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="text-muted-foreground">Tag:</span> {slug}
        </h1>
      </div>
      
      {/* Pages Section */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-yellow-500">
            Related Articles
          </h2>
          {totalPages.pages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('pages', currentPage.pages - 1)}
                disabled={currentPage.pages === 1 || loading}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage.pages} of {totalPages.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('pages', currentPage.pages + 1)}
                disabled={currentPage.pages === totalPages.pages || loading}
                className="h-8 w-8 p-0"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={`page-skeleton-${i}`} />
            ))}
          </div>
        ) : pages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Card 
                key={page.id}
                className="group h-full flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => handlePageClick(page.slug)}
              >
                {page.imageUrl && (
                  <div className="relative pt-[56.25%] overflow-hidden">
                    <img 
                      src={page.imageUrl} 
                      alt={page.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardHeader className="flex-1">
                  <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {page.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3">
                    {page.content.replace(/<[^>]*>?/gm, '')}
                  </p>
                </CardContent>
                <CardFooter className="border-t py-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="ml-auto group-hover:text-blue-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePageClick(page.slug);
                    }}
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState type="pages" />
        )}
      </section>

      {/* Blogs Section */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-yellow-500">
            Related Blogs
          </h2>
          {totalPages.blogs > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('blogs', currentPage.blogs - 1)}
                disabled={currentPage.blogs === 1 || loading}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage.blogs} of {totalPages.blogs}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('blogs', currentPage.blogs + 1)}
                disabled={currentPage.blogs === totalPages.blogs || loading}
                className="h-8 w-8 p-0"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={`blog-skeleton-${i}`} />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card 
                key={blog.id}
                className="group h-full flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => handleBlogClick(blog.slug)}
              >
                {blog.imageUrl && (
                  <div className="relative pt-[56.25%] overflow-hidden">
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardHeader className="flex-1">
                  <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-green-600 transition-colors">
                    {blog.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3">
                    {blog.content.replace(/<[^>]*>?/gm, '')}
                  </p>
                </CardContent>
                <CardFooter className="border-t py-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="ml-auto group-hover:text-green-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlogClick(blog.slug);
                    }}
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState type="blogs" />
        )}
      </section>
    </div>
  );
}