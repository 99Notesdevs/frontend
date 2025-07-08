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

interface CurrentAffairsProps {
  title: string;
  description: string;
}

const CurrentAffairs: React.FC<CurrentAffairsProps> = ({ title, description }) => {
  const [sections, setSections] = useState<CurrentAffairSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentAffairs = async () => {
    try {
      setError(null);
      const response = await axios.get(`${env.API}/currentAffair/type/daily`);
      if (response.data.status === 'success' && response.data.data) {
        setSections(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching current affairs:', error);
      setError('Failed to load current affairs. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentAffairs();
  }, []);

  if (error) {
    return (
      <div className="py-16 bg-[var(--bg-main)] dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[var(--surface-darker)] dark:text-white mb-4">Current Affairs</h2>
            <div className="w-24 h-1 bg-[var(--accent)] rounded-full mx-auto"></div>
          </div>
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Error</h3>
            <p className="text-[var(--text-tertiary)] dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={fetchCurrentAffairs}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (    
      <div className="py-16 bg-[var(--bg-main)] dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[var(--surface-darker)] dark:text-white mb-4">Current Affairs</h2>
            <div className="w-24 h-1 bg-[var(--accent)] rounded-full mx-auto"></div>
          </div>
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
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
    <section className="py-16 bg-[var(--bg-main)] dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
        <span className="text-[var(--primary)] font-medium tracking-wider text-sm uppercase font-opensans">Current Affairs</span>
          <h2 className="text-3xl font-semibold text-[var(--surface-darker)] dark:text-white mb-4 font-opensans">{title}</h2>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto mb-6"></div>
          <p className="text-lg font-normal text-[var(--text-tertiary)] dark:text-gray-300 max-w-3xl mx-auto font-opensans">
            {description}
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
