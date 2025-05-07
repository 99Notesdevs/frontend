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

export default function TagPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const pathname = usePathname();
  
  const slug = pathname.split('/').pop() || '';

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const skip = (currentPage - 1) * itemsPerPage;
        const response = await fetch(`${env.API}/tag/${slug}?skip=${skip}&take=${itemsPerPage}`);
        const data = await response.json();
        setPages(data.data);
        setTotalPages(Math.ceil(data.data.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [slug, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--bg-main)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-elevated)] pt-8">
      <div className="w-full max-w-[2000px] px-4 sm:px-8 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--surface-darker)] text-left">
            {slug}
          </h1>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--text-tertiary)] text-lg">No posts found for this tag.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pages.map((page) => (
              <div 
                key={page.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out transform hover:scale-[1.02] overflow-hidden cursor-pointer w-full"
                onClick={() => router.push(`/${page.slug}`)}
              >
                <Card className="border-none">
                  <CardHeader>
                    {page.imageUrl && (
                      <img 
                        src={page.imageUrl}
                        alt={page.title}
                        className="w-full h-40 object-cover rounded-t-xl"
                      />
                    )}
                    <CardTitle className="text-lg font-semibold mt-2">{page.title}</CardTitle>
                    <CardDescription>
                      {new Date(page.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-[var(--text-tertiary)]">
                      {page.content}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full bg-[var(--primary)] text-white hover:bg-[var(--secondary)] transition-all duration-200 rounded-lg"
                    >
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8 mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
            >
              ← Previous
            </Button>
            <span className="text-sm font-medium text-[var(--text-strong)]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}