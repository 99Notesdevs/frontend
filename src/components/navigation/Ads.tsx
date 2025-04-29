import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AdProps {
  imageUrl: string;
  altText?: string;
}

const Ads: React.FC<AdProps> = ({ imageUrl, altText = 'Advertisement' }) => {
  return (
    <div className="w-full my-4 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link 
        href="https://shop.99notes.in/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative w-full h-48 sm:h-60">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={altText}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
              priority
            />
          ) : (
            <div className="w-full h-full bg-[var(--text-disabled)] flex items-center justify-center text-[var(--text-tertiary)]">
              Advertisement
            </div>
          )}
        </div>
        <div className="bg-[var(--info-surface)] py-2 px-3 text-xs text-center text-[var(--text-base)]">
          Visit our shop
        </div>
      </Link>
    </div>
  );
};

export default Ads;