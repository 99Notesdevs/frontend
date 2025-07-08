import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AdProps {
  imageUrl: string;
  altText?: string;
}

const Ads: React.FC<AdProps> = ({ imageUrl, altText = 'Advertisement' }) => {
  return (
    <div className="w-full my-4 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 dark:border dark:border-slate-700 dark:hover:border-slate-600">
      <Link 
        href="https://shop.99notes.in/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="relative w-full h-48 sm:h-60 overflow-hidden">
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
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400">
              Advertisement
            </div>
          )}
        </div>
        <div className="bg-blue-50 dark:bg-slate-800 py-2 px-3 text-xs text-center text-blue-700 dark:text-blue-300 font-medium border-t border-gray-200 dark:border-slate-700 transition-colors duration-300 group-hover:bg-blue-100 dark:group-hover:bg-slate-700">
          Visit our shop
        </div>
      </Link>
    </div>
  );
};

export default Ads;