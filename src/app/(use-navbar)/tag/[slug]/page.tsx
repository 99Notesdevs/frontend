'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Tag as TagIcon } from "lucide-react";
import { api } from '@/config/api/route';

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

interface CurrentArticleBlog {
  id: number;
  slug: string;
  title: string;
  content: string;
  parentSlug: string;
  createdAt: string;
  updatedAt: string;
  tags: Array<{
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
const itemsPerPage = 10;

export default function TagPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentBlog, setCurrentBlog] = useState<CurrentArticleBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState({
    pages: 1,
    blogs: 1,
    currentBlog: 1
  });
  const [totalPages, setTotalPages] = useState({
    pages: 1,
    blogs: 1,
    currentBlog: 1
  });
  const [totalItems, setTotalItems] = useState({
    pages: 0,
    blogs: 0,
    currentBlog: 0
  });
  const router = useRouter();
  const pathname = usePathname();
  
  const slug = pathname.split('/').pop() || '';


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch pages count
        const pagesCountResponse = await api.get(`/tag/count/${slug}`) as { success: boolean, data: number };
        const pagesCountData = pagesCountResponse.data;
        
        // Fetch blogs count
        const blogsCountResponse = await api.get(`/tag/blogs/count/${slug}`) as { success: boolean, data: number };
        const blogsCountData = blogsCountResponse.data;

        //Fetch currentBlog Count
        const currentBlogCountResponse = await api.get(`/tag/currentBlog/count/${slug}`) as { success: boolean, data: number };
        const currentBlogCountData = currentBlogCountResponse.data;

        setTotalItems({
          pages: pagesCountData,
          blogs: blogsCountData,
          currentBlog: currentBlogCountData
        });
        setTotalPages({
          pages: Math.ceil(pagesCountData / itemsPerPage),
          blogs: Math.ceil(blogsCountData / itemsPerPage),
          currentBlog: Math.ceil(currentBlogCountData / itemsPerPage)
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    const fetchContent = async () => {
      try {
        // Fetch pages
        const skipPages = (currentPage.pages - 1) * itemsPerPage;
        const responsePages = await api.get(`/tag/${slug}?skip=${skipPages}&take=${itemsPerPage}`) as { success: boolean, data: Page[] };
        setPages(responsePages.data);

        // Fetch blogs
        const skipBlogs = (currentPage.blogs - 1) * itemsPerPage;
        const responseBlogs = await api.get(`/tag/blogs/${slug}?skip=${skipBlogs}&take=${itemsPerPage}`) as { success: boolean, data: Blog[] };
        setBlogs(responseBlogs.data);

        // Fetch currentBlog
        const skipCurrentBlog = (currentPage.currentBlog - 1) * itemsPerPage;
        const responseCurrentBlog = await api.get(`/tag/currentBlog/${slug}?skip=${skipCurrentBlog}&take=${itemsPerPage}`) as { success: boolean, data: CurrentArticleBlog };
        setCurrentBlog(responseCurrentBlog.data);
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

  const handlePageChange = (type: 'pages' | 'blogs' | 'currentBlog', page: number) => {
    setCurrentPage(prev => ({ ...prev, [type]: page }));
    setLoading(true); // Show loading state while fetching new page
  };

  // Loading skeleton component
  const CardSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow dark:shadow-slate-900/30 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = ({ type }: { type: 'pages' | 'blogs' | 'current affairs' }) => (
    <div className="text-center py-12 border rounded-lg bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
      <TagIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No {type} found</h3>
      <p className="mt-1 text-gray-500 dark:text-slate-400">
        There are no {type} associated with this tag yet.
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow dark:shadow-slate-900/30 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-r" role="alert">
          <p className="font-bold flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Error
          </p>
          <p className="mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 dark:bg-slate-900">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Tag: <span className="text-[var(--nav-primary)]">{slug}</span>
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)] rounded-full"></div>
      </div>
      
      {/* Pages Section */}
      <section className="mb-10">
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
                className="group h-full flex flex-col hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300 cursor-pointer overflow-hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
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
                  <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
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
                className="group h-full flex flex-col hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300 cursor-pointer overflow-hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
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
                  <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-gray-900 dark:text-white">
                    {blog.title}
                  </CardTitle>
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
                    className="ml-auto group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors"
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
      {/* Current Affairs Section */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-yellow-500">
            Related Current Affairs
          </h2>
          {totalPages.currentBlog > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('currentBlog', currentPage.currentBlog - 1)}
                disabled={currentPage.currentBlog === 1 || loading}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage.currentBlog} of {totalPages.currentBlog}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('currentBlog', currentPage.currentBlog + 1)}
                disabled={currentPage.currentBlog === totalPages.currentBlog || loading || !currentBlog}
                className="h-8 w-8 p-0"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            <CardSkeleton />
          </div>
        ) : currentBlog ? (
          <Card 
            className="group h-full flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => router.push(`/${currentBlog.parentSlug}/#${currentBlog.slug}`)}
          >
            <CardHeader className="flex-1">
              <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-green-600 transition-colors">
                {currentBlog.title}
              </CardTitle>
              {currentBlog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentBlog.tags.map((tag) => (
                    <span 
                      key={tag.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              <div 
                className="prose dark:prose-invert max-w-none line-clamp-3 text-muted-foreground prose-p:text-gray-600 dark:prose-p:text-gray-300"
                dangerouslySetInnerHTML={{ __html: currentBlog.content }}
              />
            </CardContent>
            <CardFooter className="border-t py-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-auto group-hover:text-green-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/${currentBlog.parentSlug}/#${currentBlog.slug}`);
                }}
              >
                Read More
                <ArrowRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <EmptyState type="current affairs" />
        )}
      </section>
    </div>
  );
}