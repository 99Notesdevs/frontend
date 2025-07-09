import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AdProps {
  imageUrl: string;
  altText?: string;
}

const Ads: React.FC<AdProps> = ({ imageUrl, altText = 'Advertisement' }) => {
  return (
    <div className="w-full my-4 rounded-lg overflow-hidden shadow-md hover:shadow-lg dark:shadow-slate-900/20 dark:hover:shadow-slate-800/30 transition-all duration-300 border border-gray-200 dark:border-slate-700 dark:hover:border-slate-600 bg-white dark:bg-slate-800">
      <Link 
        href="https://shop.99notes.in/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block group h-full flex flex-col"
      >
        <div className="relative w-full h-48 sm:h-60 overflow-hidden flex-1">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={altText}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
              <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-all duration-300" />
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-slate-800/50 flex items-center justify-center text-gray-500 dark:text-slate-400">
              Advertisement
            </div>
          )}
        </div>
        <div className="bg-blue-50 dark:bg-slate-800/80 py-2.5 px-3 text-xs text-center text-blue-700 dark:text-blue-300 font-medium border-t border-gray-200 dark:border-slate-700 transition-colors duration-300 group-hover:bg-blue-100 dark:group-hover:bg-slate-700/90">
          Visit our shop <span aria-hidden="true">→</span>
        </div>
      </Link>
    </div>
  );
};

export default Ads;