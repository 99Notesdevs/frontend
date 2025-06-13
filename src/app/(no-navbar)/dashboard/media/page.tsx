"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { env } from "@/config/env";
import LoadingSpinner from "@/components/Loading/loading";
import Cookies from "js-cookie";
import { uploadImageToS3 } from "@/config/imageUploadS3";

const MediaLibrary = () => {
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [filter, setFilter] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] =
    useState<string>("GeneralStudies");
  const [uploading, setUploading] = useState(false);
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      {/* Backdrop for loading state */}
      {uploading && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-gray-700 font-medium">Uploading image...</p>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
          Media Library
        </h1>
        <button
          onClick={() => setUploadDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
        >
          <span>Upload Image</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536M9 13h6m2 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6"
            />
          </svg>
        </button>
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
      {/*
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
              style={{ minWidth: "100%", minHeight: "100%" }}
            />
            {selectedFiles.includes(url) && (
              <div className="">
                <span className="">
                  Selected
                </span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none truncate">
              {url}
            </div>
          </div>
        ))}

        */}
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentMediaFiles.map((url, index) => (
            <div
              key={index}
              className="relative group bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden aspect-square transform hover:-translate-y-1"
            >
              {/* Checkbox for selection */}
              <input
                type="checkbox"
                checked={selectedFiles.includes(url)}
                onChange={() => toggleFileSelection(url)}
                className="absolute top-2 left-2 z-20 w-5 h-5 accent-blue-500 rounded border border-gray-300 bg-white shadow"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Copy URL icon */}
              <button
                className="absolute top-2 right-2 z-20 bg-white bg-opacity-80 rounded-full p-1 hover:bg-blue-100 transition"
                title="Copy URL"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(url);
                }}
              >
                {/* Simple link icon (SVG) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 010 5.656m1.415-1.414a2 2 0 000-2.828m-6.364 6.364a4 4 0 010-5.656m-1.415 1.414a2 2 0 000 2.828M12 8v4m0 0v4m0-4h4m-4 0H8"
                  />
                </svg>
              </button>

              <div className="w-full h-full relative">
                {!url.toLowerCase().endsWith(".pdf") ? (
                  <Image
                    src={url}
                    alt={`Media ${index + 1}`}
                    fill
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    priority={index < 6} // Load first 6 images with priority
                  />
                ) : (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center w-full h-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-red-500 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-xs text-gray-700 font-semibold">
                      View PDF
                    </span>
                  </a>
                )}
              </div>
              {selectedFiles.includes(url) && (
                <div className="absolute inset-0 bg-blue-600 bg-opacity-60 flex items-center justify-center pointer-events-none z-10">
                  <span className="text-white text-lg font-bold drop-shadow">
                    Selected
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <p className="truncate text-xs font-medium">
                  {url.split("/").pop()}
                </p>
                <p className="text-xs text-gray-300 truncate">
                  {new URL(url).hostname}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center mt-10 gap-2">
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
      {uploadDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setUploadDialogOpen(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4">Upload Image</h2>
            <label className="block mb-2 font-medium">Choose Folder</label>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full"
            >
              <option value="GeneralStudies">General Studies</option>
              <option value="CurrentArticle">Current Article</option>
              <option value="CurrentAffairs">Current Affairs</option>
              <option value="CurrentAffairImages">Current Affair Images</option>
              <option value="ContentImages">Content Images</option>
              <option value="BlogsContent">Blogs Content</option>
              <option value="Blogs">Blogs</option>
              <option value="ArticlesType">Articles Type</option>
            </select>
            <input
              type="file"
              accept="*/*"
              onChange={async (e) => {
                setUploading(true);
                try {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append("imageUrl", file);
                    formData.append("fileName", file.name);
                    await uploadImageToS3(formData, selectedFolder, file.name);
                    setUploadDialogOpen(false);
                    // Optionally, refresh media files:
                    // fetchMediaFiles();
                  }
                } catch (err) {
                  alert("Failed to upload image.");
                } finally {
                  setUploading(false);
                }
              }}
              className="mb-4"
              disabled={uploading}
            />
            {uploading && <p className="text-blue-500">Uploading...</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
