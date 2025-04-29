"use client";
import React, { useState, ReactNode } from 'react';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[var(--border-light)] rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <button
        className="w-full py-4 px-6 flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-[var(--tertiary)] focus:ring-opacity-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-gray-800 flex-1 pr-4">{title}</span>
        <div className={`w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-amber-100' : ''}`}>
          <svg
            className={`w-5 h-5 text-[var(--primary)] transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`p-5 pt-2 border-t border-[var(--border-light)] transition-all duration-300 ${
          isOpen ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-4 opacity-0'
        }`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
