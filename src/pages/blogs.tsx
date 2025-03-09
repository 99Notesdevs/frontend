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
      <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-gray-100 rounded-lg shadow-md max-w-7xl my-8">
        <h1 className="text-4xl font-bold text-center mb-8">Blogs</h1>
        <div className="flex justify-center">
          <div className="w-1/4 pr-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search blogs..."
                className="border p-2 rounded w-full mb-2 placeholder-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-blue-600 text-white p-2 rounded w-full" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="mb-4">
              <select className="border p-2 rounded w-full mb-4">
                <option value="">Select Category</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
                {/* Add more categories as needed */}
              </select>
              <select className="border p-2 rounded w-full">
                <option value="">Sort By</option>
                <option value="date">Date</option>
                <option value="popularity">Popularity</option>
                {/* Add more sorting options as needed */}
              </select>
            </div>
          </div>
          <div className="w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.slice(0, 6).map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blogs" />
          </div>
        </div>
      </div>
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
