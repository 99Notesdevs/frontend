"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { env } from "@/config/env";
import LoadingSpinner from "@/components/Loading/loading";
import Cookies from "js-cookie";

const MediaLibrary = () => {
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [filter, setFilter] = useState("all"); 
  const itemsPerPage = 20; 

  useEffect(() => {
    const fetchMediaFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${env.API}/aws/get-all-images`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            }
        }); 
        setMediaFiles(response.data.data || []);
        setFilteredMediaFiles(response.data.data || []); 
      } catch (err) {
        setError("Failed to fetch media files.");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaFiles();
  }, []);

  const handleFilterChange = (filter: string) => {
    setFilter(filter);
    setCurrentPage(1); 

    if (filter === "all") {
      setFilteredMediaFiles(mediaFiles);
    } else {
      setFilteredMediaFiles(
        mediaFiles.filter((url) =>
          url.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  };

  const toggleFileSelection = (url: string) => {
    setSelectedFiles((prev) =>
      prev.includes(url) ? prev.filter((file) => file !== url) : [...prev, url]
    );
  };

  const bulkDeleteMediaFiles = async () => {
    try {
      await axios.delete(`${env.API}/aws/delete-image`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        data: { selectedFiles },
      });
      setMediaFiles((prev) =>
        prev.filter((file) => !selectedFiles.includes(file))
      );
      setFilteredMediaFiles((prev) =>
        prev.filter((file) => !selectedFiles.includes(file))
      );
      setSelectedFiles([]);
    } catch (err) {
      alert("Failed to delete selected media files.");
    }
  };

  const totalPages = Math.ceil(filteredMediaFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMediaFiles = filteredMediaFiles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">Media Library</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 outline-none rounded-lg px-4 py-2 shadow-sm text-base bg-white transition duration-200"
          >
            <option value="all">All</option>
            <option value="GeneralStudies">General Studies</option>
            <option value="CurrentArticle">Current Article</option>
            <option value="CurrentAffairs">Current Affairs</option>
            <option value="CurrentAffairImages">Current Affair Images</option>
            <option value="ContentImages">Content Images</option>
            <option value="BlogsContent">Blogs Content</option>
            <option value="Blogs">Blogs</option>
            <option value="ArticlesType">Articles Type</option>
          </select>
          {selectedFiles.length > 0 && (
            <button
              onClick={bulkDeleteMediaFiles}
              className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg font-semibold shadow-md"
            >
              Delete Selected ({selectedFiles.length})
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {currentMediaFiles.map((url, index) => (
          <div
            key={index}
            className="relative group bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition overflow-hidden flex items-center justify-center aspect-square cursor-pointer"
            onClick={() => toggleFileSelection(url)}
          >
            <Image
              src={url}
              alt={`Media ${index + 1}`}
              fill
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
              style={{ minWidth: '100%', minHeight: '100%' }}
            />
            {selectedFiles.includes(url) && (
              <div className="absolute inset-0 bg-blue-600 bg-opacity-60 flex items-center justify-center pointer-events-none z-10">
                <span className="text-white text-lg font-bold drop-shadow">Selected</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none truncate">
              {url}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center items-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index + 1)}
            className={`px-4 py-2 rounded-lg font-medium shadow-sm transition border ${
              currentPage === index + 1
                ? "bg-blue-500 text-white border-blue-500 scale-105"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MediaLibrary;
