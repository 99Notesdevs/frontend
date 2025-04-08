"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { env } from "@/config/env";

interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  metadata: string;
  status: string;
  imageUrl: string;
  templateId: string;
  parentId: number | null;
  level: number;
  showInNav: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Material {
  title: string;
  image: string;
  description: string;
}

const StudyMaterials = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const navigationResponse = await axios.get(`${env.API}/page/order`);
        const navigationData = navigationResponse.data.data;
        setPages(navigationData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPages();
  }, []);

  const getFilteredMaterials = () => {
    if (selectedCategory === "All") {
      return pages.filter(page => page.level === 3);
    }
    return pages.filter(page => page.title.toLowerCase() === selectedCategory.toLowerCase());
  };

  const renderCategoryItems = (category: string) => {
    const items = pages.filter(page => page.parentId === pages.find(p => p.title === category)?.id);
    return items.map((item) => (
      <div
        key={item.id}
        className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 mb-4"
      >
        <Image
          src={item.imageUrl}
          alt={item.title}
          width={500}
          height={192}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl text-black font-semibold mb-2">
            {item.title}
          </h3>
          <p className="text-black mb-4">
            {item.content ? item.content.substring(0, 100) + "..." : "No description available"}
          </p>
          <Link
            href={`${item.slug}`}
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
          >
            Learn More
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            UPSC Study Material & Notes
          </h2>
          <p className="text-lg text-gray-600">
            Complete coverage of all topics along with PYQs from UPSC & State
            PSCs
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            "All",
            ...pages
              .filter(item => item.slug.startsWith("upsc-notes") && item.level === 2)
              .map(item => item.title)
          ].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Study Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {selectedCategory === "All" 
            ? getFilteredMaterials().map((page) => (
                <div
                  key={page.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 mb-4"
                >
                  <Image
                    src={page?.imageUrl || "https://www.psdstack.com%2Fwp-content%2Fuploads%2F2019%2F08%2Fcopyright-free-images-750x420.jpg&w=828&q=75"}
                    alt={page.title}
                    width={500}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl text-black font-semibold mb-2">
                      {page.title}
                    </h3>
                    <p className="text-black mb-4" dangerouslySetInnerHTML={{ __html: page.content ? page.content.substring(0, 100) + "..." : "No description available" }} />
                    <Link
                      href={`${page.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                    >
                      Learn More
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))
            : renderCategoryItems(selectedCategory)}
        </div>
      </div>
    </section>
  );
};

export default StudyMaterials;
