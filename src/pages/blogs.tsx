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
        <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-xl shadow-lg my-8 max-w-7xl">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8 py-5">Blogs</h1>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <div className="w-full md:w-1/4">
              <div className="mb-4 p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="border border-gray-200 p-3 rounded-lg w-full mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-700 transition-all duration-300 mb-4 font-medium shadow-sm hover:shadow-md" onClick={handleSearch}>
                  Search
                </button>
                <select className="border border-gray-200 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 focus:border-transparent transition-all duration-300">
                  <option value="">Select Category</option>
                  <option value="category1">Category 1</option>
                  <option value="category2">Category 2</option>
                </select>
                <select className="border border-gray-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 focus:border-transparent transition-all duration-300">
                  <option value="">Sort By</option>
                  <option value="date">Date</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredBlogs.slice(0, 8).map((blog) => (
                    <div key={blog.id} className="rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blogs" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 1024px) and (max-width: 1550px) {
          .container {
            padding: 2.5rem;
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
