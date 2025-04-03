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
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  content,
}) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!content) return;

    // Parse the HTML content to extract headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = Array.from(
      doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ).map((element, index) => ({
      id: element.id || `heading-${index}`, // Generate a unique ID if missing
      text: element.textContent || "",
      level: parseInt(element.tagName.charAt(1)), // Extract heading level (e.g., 1 for h1)
    }));

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
              className={`block text-sm  hover:text-blue-500 transition-colors
                ${heading.level === 1 ? "font-medium" : ""}
                ${heading.level > 1 ? `pl-${(heading.level - 1) * 4}` : ""}
                ${
                  activeId === heading.id
                    ? "text-blue-500"
                    : "text-gray-600 dark:text-gray-500"
                }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
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
