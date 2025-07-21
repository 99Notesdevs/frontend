"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TOCItem {
  id: string;
  text: string;
  level: number;
  isBlog?: boolean;
}

interface BlogContent {
  content: string;
}

interface TableOfContentsProps {
  content?: string;
  blogs?: BlogContent[];
  onLinkClick?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  content = "",
  blogs = [],
  onLinkClick,
}) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const contentRef = useRef<string>("");
  const blogsRef = useRef<BlogContent[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isInitialMount = useRef(true);

  // Function to close the TOC
  const closeToc = useCallback((): void => {
    const tocCheckbox = document.getElementById(
      "toc-toggle"
    ) as HTMLInputElement;
    if (tocCheckbox) {
      tocCheckbox.checked = false;
    }
  }, []);

  // Generate a slug from text
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Process content and extract headings
  const processContent = useCallback((): void => {
    if (
      (!content || content === contentRef.current) &&
      (!blogs.length ||
        JSON.stringify(blogs) === JSON.stringify(blogsRef.current))
    ) {
      return;
    }

    contentRef.current = content || "";
    blogsRef.current = [...blogs];

    const elements: TOCItem[] = [];
    const processedIds = new Set<string>();

    // Process main content
    if (content) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        // Process h2 headings
        Array.from(doc.querySelectorAll("h2")).forEach((element, index) => {
          const text = element.textContent || "";
          const id = generateSlug(text) || `heading-${index}`;

          // Set the ID on the heading element
          element.id = id;

          if (!processedIds.has(id)) {
            processedIds.add(id);
            elements.push({
              id,
              text,
              level: 2,
              isBlog: false,
            });
          }
        });

        // Update the content with the modified HTML
        const updatedContent = doc.body.innerHTML;
        if (updatedContent) {
          contentRef.current = updatedContent;
        }
      } catch (error) {
        console.error("Error parsing main content:", error);
      }
    }

    // Process blog content
    blogs.forEach((blog, blogIndex) => {
      if (!blog?.content) return;

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(blog.content, "text/html");
        let contentModified = false;

        Array.from(doc.querySelectorAll("h2")).forEach((element, index) => {
          const text = element.textContent || "";
          const id = generateSlug(text) || `blog-${blogIndex}-${index}`;

          // Set the ID on the heading element
          element.id = id;
          contentModified = true;

          if (!processedIds.has(id)) {
            processedIds.add(id);
            elements.push({
              id,
              text,
              level: 2,
              isBlog: true,
            });
          }
        });

        // Update the blog content with the modified HTML if needed
        if (contentModified) {
          blog.content = doc.body.innerHTML;
        }
      } catch (error) {
        console.error(
          `Error parsing blog content at index ${blogIndex}:`,
          error
        );
      }
    });

    setHeadings(elements);
  }, [content, blogs]);

  // Set up intersection observer
  useEffect(() => {
    if (headings.length === 0) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveId(id);
          if (window.location.hash !== `#${id}`) {
            window.history.replaceState({}, "", `#${id}`);
          }
        }
      });
    };

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: "-100px 0px -66%",
      threshold: 0.5,
    });

    // Observe all headings
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter((element): element is HTMLElement => element !== null);

    headingElements.forEach((element) => {
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    // Clean up
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);

  // Process content on mount and when content changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      processContent();
    } else {
      const timer = setTimeout(processContent, 0);
      return () => clearTimeout(timer);
    }
  }, [processContent]);

  if (headings.length === 0) return null;

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    heading: TOCItem
  ) => {
    e.preventDefault();

    if (onLinkClick) {
      onLinkClick(e, heading.id);
      return;
    }

    // Close the TOC
    closeToc();

    // Update URL
    window.history.pushState({}, "", `#${heading.id}`);

    const scrollToHeading = () => {
      // First try direct ID match
      let target = document.getElementById(heading.id);

      // If not found, try to find in blog content
      if (!target) {
        // Try all blog containers if it's a blog heading
        if (heading.isBlog) {
          const blogContainers = document.querySelectorAll(`[id^="blog-"]`);
          for (const container of Array.from(blogContainers)) {
            const blogTarget = container.querySelector(
              `#${CSS.escape(heading.id)}`
            );
            if (blogTarget) {
              target = blogTarget as HTMLElement;
              break;
            }
          }
        }
      }

      // If still not found, try to find by text content as last resort
      if (!target) {
        const allHeadings = Array.from(document.querySelectorAll("h2"));
        const matchingHeading = allHeadings.find(
          (h) => h.textContent?.trim() === heading.text.trim()
        );
        if (matchingHeading) {
          target = matchingHeading as HTMLElement;
          // Set the ID for future reference
          if (target && !target.id) {
            target.id = heading.id;
          }
        }
      }

      if (target) {
        // Calculate scroll position with navbar offset
        const navbar = document.querySelector("nav");
        const navbarHeight = navbar?.offsetHeight || 0;
        const offset = navbarHeight + 20;

        // Get the target's position relative to the viewport
        const targetRect = target.getBoundingClientRect();
        const targetPosition = targetRect.top + window.scrollY - offset;

        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Add a temporary highlight to the target
        target.classList.add("highlight-heading");
        setTimeout(() => {
          target?.classList.remove("highlight-heading");
        }, 2000);
      }
    };

    // Small delay to ensure any content updates are rendered
    setTimeout(scrollToHeading, 50);
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
          Table of Contents
        </h2>
        <nav className="space-y-1">
          {headings.map((heading) => {
            const paddingLeft = `${(heading.level - 1) * 16}px`; // Increased base indentation
            const bulletColor =
              activeId === heading.id
                ? "text-blue-500 dark:text-blue-400"
                : "text-gray-400 dark:text-gray-500";
            const textColor =
              activeId === heading.id
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300";
            const hoverBg =
              activeId === heading.id
                ? "bg-blue-50 dark:bg-blue-900/20"
                : "hover:bg-gray-50 dark:hover:bg-slate-700/50";

            return (
              <div
                key={heading.id}
                className={`group flex items-start transition-colors duration-200 rounded-md ${hoverBg} ${
                  heading.level === 1 ? "mt-1" : ""
                }`}
                style={{ paddingLeft: heading.level > 1 ? paddingLeft : "4px" }}
              >
                <span className={`mr-2 mt-1.5 text-xs ${bulletColor}`}>
                  {heading.level === 1 ? "•" : "◦"}
                </span>
                <a
                  href={`#${heading.id}`}
                  className={`block py-1.5 pr-3 text-sm transition-colors duration-200 w-full rounded-md ${textColor} ${
                    heading.level === 1 ? "font-medium" : "font-normal"
                  }`}
                  onClick={(e) => handleLinkClick(e, heading)}
                >
                  <div className="flex items-center">
                    {activeId === heading.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mr-2.5 flex-shrink-0"></span>
                    )}
                    <span className="line-clamp-1">{heading.text}</span>
                  </div>
                </a>
              </div>
            );
          })}
        </nav>
      </CardContent>
      <style jsx global>{`
        .highlight-heading {
          animation: highlight 2s ease-out;
          position: relative;
        }

        @keyframes highlight {
          0% {
            background-color: rgba(59, 130, 246, 0.2);
          }
          100% {
            background-color: transparent;
          }
        }

        @media (prefers-color-scheme: dark) {
          @keyframes highlight {
            0% {
              background-color: rgba(96, 165, 250, 0.3);
            }
            100% {
              background-color: transparent;
            }
          }
        }
      `}</style>
    </Card>
  );
};
