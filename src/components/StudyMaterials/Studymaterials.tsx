"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Material {
  title: string;
  image: string;
  description: string;
}

const studyMaterials: Record<string, Material[]> = {
  "General Studies 1": [
    {
      title: "Medieval Indian History",
      image:
        "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      description: "Complete coverage of Medieval Indian History with PYQs",
    },
    {
      title: "Society",
      image:
        "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      description: "Comprehensive study of Indian Society and Social Issues",
    },
    {
      title: "Geography",
      image:
        "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      description: "Physical, Human and Economic Geography",
    },
    {
      title: "Indian Polity Part-1",
      image:
        "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      description: "Constitutional Framework and Governance",
    },
  ],
  "General Studies 2": [
    {
      title: "Governance",
      image:
        "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      description: "Government Policies and Interventions",
    },
    {
      title: "International Relations",
      image:
        "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      description: "India and its International Relations",
    },
  ],
  "General Studies 3": [
    {
      title: "Indian Economy",
      image:
        "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      description: "Economic Development and Planning",
    },
    {
      title: "Agriculture",
      image:
        "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      description: "Agriculture and Allied Activities",
    },
  ],
  "General Studies 4": [
    {
      title: "Ethics",
      image:
        "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      description: "Ethics, Integrity and Aptitude",
    },
    {
      title: "Case Studies",
      image:
        "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      description: "Case Studies for Ethics Paper",
    },
  ],
};

const StudyMaterials: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const getFilteredMaterials = (): Material[] => {
    return selectedCategory === "All"
      ? Object.values(studyMaterials).flat()
      : studyMaterials[selectedCategory] || [];
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

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["All", ...Object.keys(studyMaterials)].map((category) => (
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
          {getFilteredMaterials().map((material, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <Image
                src={material.image}
                alt={material.title}
                width={500}
                height={192}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl text-black font-semibold mb-2">
                  {material.title}
                </h3>
                <p className="text-black mb-4">{material.description}</p>
                <Link
                  href={`/study-material/${material.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudyMaterials;
