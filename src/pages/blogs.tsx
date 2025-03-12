import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';
import Head from 'next/head';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string;
}

interface BlogsPageProps {
  blogs: Blog[];
  currentPage: number;
  totalPages: number;
}

const BlogsPage: React.FC<BlogsPageProps> = ({ blogs, currentPage, totalPages }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);

  const handleSearch = () => {
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBlogs(filtered);
  };

  return (
    <>
      <Head>
        <title>99Notes Blogs</title>
        <meta name="description" content="Read the latest blogs from 99Notes" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
        <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-lg shadow-md my-8 max-w-7xl">
          <h1 className="text-4xl font-bold text-black text-center mb-8">Blogs</h1>
          <div className="flex flex-col md:flex-row justify-center">
            <div className="w-full md:w-1/4 pr-4 mb-4 md:mb-0">
              <div className="mb-4 border border-black p-4 rounded-lg bg-gray-50">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="border p-2 rounded w-full mb-4 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition-colors duration-300 mb-4" onClick={handleSearch}>
                  Search
                </button>
                <select className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black">
                  <option value="">Select Category</option>
                  <option value="category1">Category 1</option>
                  <option value="category2">Category 2</option>
                  {/* Add more categories as needed */}
                </select>
                <select className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-black">
                  <option value="">Sort By</option>
                  <option value="date">Date</option>
                  <option value="popularity">Popularity</option>
                  {/* Add more sorting options as needed */}
                </select>
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredBlogs.slice(0, 8).map((blog) => (
                    <div key={blog.id} className="hover:shadow-lg transition-shadow duration-300">
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blogs" />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 1024px) and (max-width: 1550px) {
          .container {
            padding: 2rem;
          }
          .text-4xl {
            font-size: 2.5rem;
          }
          .grid-cols-1 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .md\:w-1\/4 {
            width: 30%;
          }
          .md\:w-3\/4 {
            width: 70%;
          }
        }
      `}</style>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Fetch blogs from an API or CMS
  // For demonstration, we'll simulate with dummy data:
  const perPage = 9;
  const currentPage = 1;
  const totalBlogs = 100; // for example
  const totalPages = Math.ceil(totalBlogs / perPage);

  // Replace this with actual fetching logic
  const blogs: Blog[] = Array.from({ length: perPage }).map((_, i) => ({
    id: `blog-${i + 1}`,
    title: `Blog Title ${i + 1}`,
    excerpt: `This is an excerpt for blog ${i + 1}.`,
    publishedDate: new Date().toISOString(),
  }));

  return {
    props: {
      blogs,
      currentPage,
      totalPages,
    },
    revalidate: 60, // Regenerate the page every minute
  };
};

export default BlogsPage;
