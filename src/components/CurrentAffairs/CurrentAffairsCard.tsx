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
      className="group block bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-[var(--surface-darker)] group-hover:text-blue-600 transition-colors font-opensans">
            {title}
          </h3>
          {typeof icon === 'object' && 'image' in icon ? (
            <div className="text-2xl text-blue-600">
              <Image src={icon.image} alt={title} width={32} height={32} />
            </div>
          ) : (
            <div className="text-2xl text-blue-600">{icon}</div>
          )}
        </div>
        <p className="text-[var(--text-base)] font-normal font-opensans">
          Click to view the latest updates and analysis
        </p>
      </div>
    </Link>
  );
};

export default CurrentAffairsCard;