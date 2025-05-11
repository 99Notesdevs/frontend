"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { env } from "@/config/env";
import LoadingSpinner from "@/components/Loading/loading";

const MediaLibrary = () => {
  const [mediaFiles, setMediaFiles] = useState<string[]>([]); // State to hold media files
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State to manage errors
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]); // State to manage selected files
  const [currentPage, setCurrentPage] = useState(1); // State to manage current page
  const itemsPerPage = 20; // Number of items per page

  // Fetch media files from the API
  useEffect(() => {
    const fetchMediaFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${env.API}/aws/get-all-images`); // Replace with actual API endpoint
        setMediaFiles(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch media files.");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaFiles();
  }, []);

  // Delete a media file
  const deleteMediaFile = async (url: string) => {
    try {
      await axios.delete("/api/media", { data: { url } }); // Replace with actual API endpoint
      setMediaFiles((prev) => prev.filter((file) => file !== url));
    } catch (err) {
      alert("Failed to delete media file.");
    }
  };

  // Handle file selection
  const toggleFileSelection = (url: string) => {
    setSelectedFiles((prev) => {
      const updatedSelection = prev.includes(url)
        ? prev.filter((file) => file !== url)
        : [...prev, url];
      console.log("Updated Selected Files:", updatedSelection); // Debugging
      return updatedSelection;
    });
  };

  // Bulk delete selected media files
const bulkDeleteMediaFiles = async () => {
  try {
    await axios.delete("/api/media/bulk", { data: { urls: selectedFiles } }); // Replace with actual API endpoint
    setMediaFiles((prev) =>
      prev.filter((file) => !selectedFiles.includes(file))
    );
    setSelectedFiles([]); // Clear selection after deletion
  } catch (err) {
    alert("Failed to delete selected media files.");
  }
};

  // Pagination logic
  const totalPages = Math.ceil(mediaFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMediaFiles = mediaFiles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <LoadingSpinner />
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Media Library</h1>
        {selectedFiles.length > 0 && (
          <button
            onClick={bulkDeleteMediaFiles}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Delete Selected ({selectedFiles.length})
          </button>
        )}
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
              onClick={() => toggleFileSelection(url)} // Toggles selection
            />
            {selectedFiles.includes(url) && ( // If selected, show overlay
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none">
                <span className="text-white text-lg font-bold">Selected</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {url} {/* Show URL on hover */}
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
