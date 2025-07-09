"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface CurrentAffairsCardProps {
  title: string;
  icon: string | { image: StaticImageData };
  link: string;
}

const CurrentAffairsCard: React.FC<CurrentAffairsCardProps> = ({ title, icon, link }) => {
  return (
    <Link
      href={link}
      className="group block bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/30 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-slate-900/50"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-[var(--surface-darker)] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-opensans">
            {title}
          </h3>
          {typeof icon === 'object' && 'image' in icon ? (
            <div className="text-2xl text-blue-600 dark:text-blue-400">
              <Image 
                src={icon.image} 
                alt={title} 
                width={32} 
                height={32} 
                className="transition-transform group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="text-2xl text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110">
              {icon}
            </div>
          )}
        </div>
        <p className="text-[var(--text-base)] dark:text-slate-300 font-normal font-opensans">
          Click to view the latest updates and analysis
        </p>
      </div>
    </Link>
  );
};

export default CurrentAffairsCard;