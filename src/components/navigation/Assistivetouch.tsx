"use client";

import React, { useState, useEffect, useRef } from "react";
import { TableOfContents } from "./TableOfContents";
import { SidebarNavigation } from "./SidebarNavigation";
import { List, Navigation2, X } from "lucide-react";

interface AssistiveTouchProps {
  content: string;
}

export default function AssistiveTouch({ content }: AssistiveTouchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showComponent, setShowComponent] = useState<"toc" | "nav" | null>(
    null
  );
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [expandDirection, setExpandDirection] = useState<"up" | "down">("up");

  const buttonRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      moveAssistive(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // Touch event handlers
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const touch = e.touches[0];
      moveAssistive(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const moveAssistive = (clientX: number, clientY: number) => {
    const newX = clientX - offset.current.x;
    const newY = clientY - offset.current.y;

    const buttonSize = 56;
    const maxX = window.innerWidth - buttonSize;
    const maxY = window.innerHeight - buttonSize - 20;

    setPosition({
      x: Math.max(0, Math.min(maxX, newX)),
      y: Math.max(0, Math.min(maxY, newY)),
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      isDragging.current = true;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default behavior
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const touch = e.touches[0];
      offset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      isDragging.current = true;
    }
  };

  const handleAssistiveClick = () => {
    if (isDragging.current) return; // prevent click when dragging
    const threshold = window.innerHeight / 2;
    setExpandDirection(position.y < threshold ? "down" : "up");
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowComponent(null);
    }
  };

  const handleTocLinkClick = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
      setShowBackdrop(false);
      setShowComponent(null);
    }
  };

  const handleComponentClick = (component: "toc" | "nav") => {
    setShowComponent(component);
    setShowBackdrop(true);
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

      <div
        ref={buttonRef}
        style={{ top: position.y, left: position.x }}
        className="fixed z-[9999] transition-transform duration-100 pointer-events-auto touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleAssistiveClick}
      >
        {isOpen && (
          <div
            className={`flex flex-col items-end space-y-2 absolute ${
              expandDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            <button
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 p-2.5 rounded-full shadow-xl transition-colors duration-200 border border-gray-200 dark:border-gray-700"
              onClick={() => handleComponentClick("toc")}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 p-2.5 rounded-full shadow-xl transition-colors duration-200 border border-gray-200 dark:border-gray-700"
              onClick={() => handleComponentClick("nav")}
            >
              <Navigation2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          onClick={handleAssistiveClick}
          className="inline-flex items-center justify-center p-3 rounded-full text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none transition-colors shadow-xl"
          aria-label={isOpen ? "Close assistive menu" : "Open assistive menu"}
        >
          <span className="sr-only">
            {isOpen ? "Close assistive menu" : "Open assistive menu"}
          </span>
          {isOpen ? (
            <svg
              className="block h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="block h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {showComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-strong)]"
                onClick={() => {
                  setIsOpen(false);
                  setShowBackdrop(false);
                  setShowComponent(null);
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 dark:bg-[var(--surface-dark)] ">
              <h3 className="text-lg font-semibold mb-4 text-[var(--surface-dark)] dark:text-[var(--text-tertiay)] border-b-2 border-blue-200 pb-2">
                {showComponent === "toc"
                  ? "📑 Table of Contents"
                  : "🗄️ Navigation"}
              </h3>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {showComponent === "toc" && (
                  <TableOfContents
                    content={content}
                    onLinkClick={handleTocLinkClick}
                  />
                )}
                {showComponent === "nav" && <SidebarNavigation />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
