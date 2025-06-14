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
  onLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  content = '',
  blogs = [],
  onLinkClick,
}) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const contentRef = useRef<string>('');
  const blogsRef = useRef<BlogContent[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isInitialMount = useRef(true);

  // Function to close the TOC
  const closeToc = useCallback((): void => {
    const tocCheckbox = document.getElementById('toc-toggle') as HTMLInputElement;
    if (tocCheckbox) {
      tocCheckbox.checked = false;
    }
  }, []);

  // Generate a slug from text
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Process content and extract headings
  const processContent = useCallback((): void => {
    if ((!content || content === contentRef.current) && 
        (!blogs.length || JSON.stringify(blogs) === JSON.stringify(blogsRef.current))) {
      return;
    }

    contentRef.current = content || '';
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
          const text = element.textContent || '';
          const id = generateSlug(text) || `heading-${index}`;
          
          // Set the ID on the heading element
          element.id = id;
          
          if (!processedIds.has(id)) {
            processedIds.add(id);
            elements.push({
              id,
              text,
              level: 2,
              isBlog: false
            });
          }
        });
        
        // Update the content with the modified HTML
        const updatedContent = doc.body.innerHTML;
        if (updatedContent) {
          contentRef.current = updatedContent;
        }
      } catch (error) {
        console.error('Error parsing main content:', error);
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
          const text = element.textContent || '';
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
              isBlog: true
            });
          }
        });
        
        // Update the blog content with the modified HTML if needed
        if (contentModified) {
          blog.content = doc.body.innerHTML;
        }
      } catch (error) {
        console.error(`Error parsing blog content at index ${blogIndex}:`, error);
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
            window.history.replaceState({}, '', `#${id}`);
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
      threshold: 0.5
    });

    // Observe all headings
    const headingElements = headings
      .map(h => document.getElementById(h.id))
      .filter((element): element is HTMLElement => element !== null);

    headingElements.forEach(element => {
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
    window.history.pushState({}, '', `#${heading.id}`);
    
    const scrollToHeading = () => {
      // First try direct ID match
      let target = document.getElementById(heading.id);
      
      // If not found, try to find in blog content
      if (!target) {
        // Try all blog containers if it's a blog heading
        if (heading.isBlog) {
          const blogContainers = document.querySelectorAll(`[id^="blog-"]`);
          for (const container of Array.from(blogContainers)) {
            const blogTarget = container.querySelector(`#${CSS.escape(heading.id)}`);
            if (blogTarget) {
              target = blogTarget as HTMLElement;
              break;
            }
          }
        }
      }
      
      // If still not found, try to find by text content as last resort
      if (!target) {
        const allHeadings = Array.from(document.querySelectorAll('h2'));
        const matchingHeading = allHeadings.find(
          h => h.textContent?.trim() === heading.text.trim()
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
        const navbar = document.querySelector('nav');
        const navbarHeight = navbar?.offsetHeight || 0;
        const offset = navbarHeight + 20;
        
        // Get the target's position relative to the viewport
        const targetRect = target.getBoundingClientRect();
        const targetPosition = targetRect.top + window.scrollY - offset;
        
        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Add a temporary highlight to the target
        target.classList.add('highlight-heading');
        setTimeout(() => {
          target?.classList.remove('highlight-heading');
        }, 2000);
      }
    };
    
    // Small delay to ensure any content updates are rendered
    setTimeout(scrollToHeading, 50);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <nav className="space-y-2">
          {headings.map((heading) => (
            <div key={heading.id} className="mb-2">
              <a
                href={`#${heading.id}`}
                className={`block text-sm hover:text-[var(--accent-link)] transition-colors
                  ${heading.level === 1 ? "font-medium" : ""}
                  ${heading.level > 1 ? `pl-${(heading.level - 1) * 4}` : ""}
                  ${
                    activeId === heading.id
                      ? "text-[var(--accent-link)]"
                      : "text-[var(--text-base)] dark:text-[var(--text-tertiary)]"
                  }`}
                onClick={(e) => handleLinkClick(e, heading)}
              >
                {heading.text}
              </a>
            </div>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};
