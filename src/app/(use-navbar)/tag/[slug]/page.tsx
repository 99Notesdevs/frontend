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
        console.log('skip:', skip);
        console.log('slug:', slug);
        const response = await fetch(`${env.API}/tag/${slug}?skip=${skip}&take=${itemsPerPage}`);
        const data = await response.json();
        console.log('response data:', data);
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{slug}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages?.map((page) => (
          <Card 
            key={page.id}
            className="cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => router.push(`/${page.slug}`)}
          >
            <CardHeader>
              <CardTitle>{page.title}</CardTitle>
              <CardDescription>
                {new Date(page.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {page.imageUrl && (
                <img 
                  src={page.imageUrl}
                  alt={page.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <p className="line-clamp-2">
                {page.content}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Read More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}