'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { env } from "@/config/env";

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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tag: {slug}</h1>
      
      {/* Pages Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-600">Pages</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (currentPage.pages > 1) {
                  setCurrentPage(prev => ({ ...prev, pages: prev.pages - 1 }));
                }
              }}
              disabled={currentPage.pages === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (currentPage.pages < totalPages.pages) {
                  setCurrentPage(prev => ({ ...prev, pages: prev.pages + 1 }));
                }
              }}
              disabled={currentPage.pages === totalPages.pages}
            >
              Next
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Card 
                key={page.id} 
                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => handlePageClick(page.slug)}
              >
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2">{page.content}</p>
                  {page.imageUrl && (
                    <img 
                      src={page.imageUrl} 
                      alt={page.title} 
                      className="mt-2 rounded-md w-full h-40 object-cover"
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{new Date(page.createdAt).toLocaleDateString()}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePageClick(page.slug);
                    }}
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Blogs Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-600">Blogs</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (currentPage.blogs > 1) {
                  setCurrentPage(prev => ({ ...prev, blogs: prev.blogs - 1 }));
                }
              }}
              disabled={currentPage.blogs === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (currentPage.blogs < totalPages.blogs) {
                  setCurrentPage(prev => ({ ...prev, blogs: prev.blogs + 1 }));
                }
              }}
              disabled={currentPage.blogs === totalPages.blogs}
            >
              Next
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card 
                key={blog.id} 
                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => handleBlogClick(blog.slug)}
              >
                <CardHeader>
                  <CardTitle>{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2">{blog.content}</p>
                  {blog.imageUrl && (
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title} 
                      className="mt-2 rounded-md w-full h-40 object-cover"
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlogClick(blog.slug);
                    }}
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}