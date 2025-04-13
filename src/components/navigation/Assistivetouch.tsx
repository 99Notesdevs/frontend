'use client';

import React, { useState, useEffect } from 'react';
import { TableOfContents } from './TableOfContents';
import { SidebarNavigation } from './SidebarNavigation';
import { Menu, List, Navigation2, X } from 'lucide-react';

interface AssistiveTouchProps {
  content: string;
}

export default function AssistiveTouch({ content }: AssistiveTouchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showComponent, setShowComponent] = useState<'toc' | 'nav' | null>(null);
  const [showBackdrop, setShowBackdrop] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !event.target) {
        setIsOpen(false);
        setShowBackdrop(false);
        setShowComponent(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTocLinkClick = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
      setShowBackdrop(false);
      setShowComponent(null);
    }
  };

  return (
    <>
      {showBackdrop && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => {
            setIsOpen(false);
            setShowBackdrop(false);
            setShowComponent(null);
          }}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
        {isOpen && (
          <div className="flex flex-col items-end space-y-2 mb-2">
            <button
              className="backdrop-blur-md bg-white/10 border border-white/20 text-white p-3 rounded-full shadow-xl hover:scale-105 transition-all"
              onClick={() => setShowComponent('toc')}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              className="backdrop-blur-md bg-white/10 border border-white/20 text-white p-3 rounded-full shadow-xl hover:scale-105 transition-all"
              onClick={() => setShowComponent('nav')}
            >
              <Navigation2 className="w-5 h-5" />
            </button>
          </div>
        )}

        <button
          className="bg-black bg-opacity-80 text-white p-5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.35)] backdrop-blur-sm border border-white/10 transition-all hover:scale-105 active:scale-95"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowBackdrop(true);
          }}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {showComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setIsOpen(false);
                  setShowBackdrop(false);
                  setShowComponent(null);
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">
                {showComponent === 'toc' ? '📑 Table of Contents' : '🗄️ Navigation'}
              </h3>

              <div className="space-y-4">
                {showComponent === 'toc' && (
                  <div className="max-h-[70vh] overflow-y-auto">
                    <TableOfContents content={content} onLinkClick={handleTocLinkClick} />
                  </div>
                )}
                {showComponent === 'nav' && (
                  <div className="max-h-[70vh] overflow-y-auto">
                    <SidebarNavigation />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
