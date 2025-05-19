"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content?: string; // Raw HTML content passed from the parent
  onLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  content,
  onLinkClick,
}) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Function to close the TOC
  const closeToc = () => {
    const tocCheckbox = document.getElementById('toc-toggle') as HTMLInputElement;
    if (tocCheckbox) {
      tocCheckbox.checked = false;
    }
  };

  useEffect(() => {
    if (!content) return;

    // Parse the HTML content to extract headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = Array.from(
      doc.querySelectorAll("h2")
    ).map((element, index) => {
      // Generate a clean ID from the heading text
      const text = element.textContent || '';
      const cleanText = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .replace(/\s+/g, '-')    // Replace spaces with hyphens
        .replace(/-+/g, '-')     // Remove consecutive hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
      // Set the ID on the element
      const id = cleanText || `heading-${index}`;
      element.id = id;
      
      return {
        id,
        text,
        level: parseInt(element.tagName.charAt(1)),
      };
    });

    // Update the content with proper IDs
    const newContent = doc.body.innerHTML;
    
    // Update the parent component with the modified content
    const parent = document.querySelector('.prose');
    if (parent) {
      parent.innerHTML = newContent;
    }

    setHeadings(elements);

    // Set up intersection observer for active heading tracking
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-100px 0px -66%",
      threshold: 0.5
    });

    elements.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <nav className="space-y-2">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`block text-sm hover:text-[var(--accent-link)] transition-colors
                ${heading.level === 1 ? "font-medium" : ""}
                ${heading.level > 1 ? `pl-${(heading.level - 1) * 4}` : ""}
                ${
                  activeId === heading.id
                    ? "text-[var(--accent-link)]"
                    : "text-[var(--text-base)] dark:text-[var(--text-tertiary)]"
                }`}
              onClick={(e) => {
                e.preventDefault();
                if (onLinkClick) {
                  onLinkClick(e, heading.id);
                } else {
                  const target = document.getElementById(heading.id);
                  if (target) {
                    // Close the TOC
                    closeToc();
                    
                    // Calculate the offset for the navbar
                    const navbar = document.querySelector('nav');
                    const navbarHeight = navbar?.offsetHeight || 0;
                    
                    // Get the target's position relative to the viewport
                    const targetRect = target.getBoundingClientRect();
                    const offset = navbarHeight + 20;
                    
                    // Scroll to the target with smooth behavior
                    window.scrollTo({
                      top: targetRect.top + window.scrollY - offset,
                      behavior: 'smooth'
                    });
                  }
                }
              }}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};
