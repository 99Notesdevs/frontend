"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { env } from "@/config/env";
import axios from "axios";
import CurrentAffairsCard from './CurrentAffairsCard';
import { StaticImageData } from 'next/image';

interface CurrentAffairSection {
  id: number;
  title: string;
  content: string;
  type: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface CurrentAffairsItem {
  title: string;
  icon: string | { image: StaticImageData };
  link: string;
}

const CurrentAffairs: React.FC = () => {
  const [sections, setSections] = useState<CurrentAffairSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentAffairs = async () => {
      try {
        const response = await axios.get(`${env.API}/currentAffair/type/daily`);
        if (response.data.status === 'success' && response.data.data) {
          setSections(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching current affairs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentAffairs();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loading Current Affairs...</h2>
          </div>
        </div>
      </div>
    );
  }

  const currentAffairsData: CurrentAffairsItem[] = sections.map((section) => ({
    title: section.title,
    icon: '📰',
    link: `/current-affairs/${section.slug.split('/').pop()}`,
  }));

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">UPSC Current Affairs</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Here you can also attempt questions carefully developed by our team on those topics, 
            which have high likelihood of being asked in the future exams, alongside the notes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentAffairsData.map((item) => (
            <CurrentAffairsCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrentAffairs;
