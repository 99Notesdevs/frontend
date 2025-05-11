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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
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
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Delete Selected ({selectedFiles.length})
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {currentMediaFiles.map((url, index) => (
          <div
            key={index}
            className="relative group border border-gray-300 rounded-lg overflow-hidden"
            style={{ width: "150px", height: "150px" }}
          >
            <Image
              src={url}
              alt={`Media ${index + 1}`}
              width={150}
              height={150}
              className="object-cover w-full h-full cursor-pointer"
              onClick={() => toggleFileSelection(url)} 
            />
            {selectedFiles.includes(url) && ( 
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none">
                <span className="text-white text-lg font-bold">Selected</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {url}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
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
