"use client";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { api } from "@/config/api/route";

// Define the type for a page
interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  metadata: string | null;
  status: string;
  imageUrl: string | null;
  templateId: string;
  parentId: number | null;
  children: Page[];
  level: number;
  showInNav: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Fetch pages from the API with parent-child relationships
const fetchPages = async (): Promise<Page[]> => {
  const res = (await api.get(`/page/order`)) as {
    data: { success: boolean; data: Page[] };
  };
  if (!res.data.success) {
    throw new Error("Failed to fetch pages");
  }
  return buildHierarchy(res.data.data);
};

// Helper function to build hierarchical structure from flat array
const buildHierarchy = (pages: Page[]): Page[] => {
  const map = new Map<number, Page>();
  const result: Page[] = [];

  // First pass: create map and set children array
  pages.forEach((page) => {
    map.set(page.id, { ...page, children: [] });
  });

  // Second pass: build hierarchy
  pages.forEach((page) => {
    if (page.parentId !== null) {
      const parent = map.get(page.parentId);
      if (parent) {
        parent.children.push(map.get(page.id)!);
      }
    } else {
      result.push(map.get(page.id)!);
    }
  });

  // Third pass: calculate levels
  const calculateLevels = (pages: Page[], currentLevel = 1) => {
    pages.forEach((page) => {
      page.level = currentLevel;
      calculateLevels(page.children, currentLevel + 1);
    });
  };

  calculateLevels(result);
  return result;
};

// Sortable Item Component
const SortableItem = ({ page }: { page: Page }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: page.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${(page.level - 1) * 2}rem`, // Indent each level by 2rem
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="article-item bg-white shadow-sm rounded-lg p-4 mb-2 border border-[var(--admin-border)] cursor-move"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--admin-bg-secondary)]">
          {page.title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-[var(--admin-primary)]">
            Level: {page.level}
          </span>
          <span className="text-sm text-[var(--admin-primary)]">
            Order: {page.order}
          </span>
          <span className="text-sm text-[var(--admin-primary)]">
            Parent: {page.parentId || "None"}
          </span>
        </div>
      </div>
    </div>
  );
};

const ArticleList = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [flattenedPages, setFlattenedPages] = useState<Page[]>([]);

  // Flatten the hierarchy while maintaining level information
  const flattenHierarchy = (pages: Page[]): Page[] => {
    const result: Page[] = [];

    const flatten = (items: Page[]) => {
      items.forEach((item) => {
        result.push(item);
        if (item.children && item.children.length > 0) {
          flatten(item.children);
        }
      });
    };

    flatten(pages);
    return result;
  };

  useEffect(() => {
    const getPages = async () => {
      try {
        const pagesData = await fetchPages();
        setPages(pagesData);
        setFlattenedPages(flattenHierarchy(pagesData));
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };
    getPages();
  }, []);

  useEffect(() => {
    setFlattenedPages(flattenHierarchy(pages));
  }, [pages]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Find the pages being dragged and dropped
    const activePage = flattenedPages.find((page) => page.id === active.id);
    const overPage = flattenedPages.find((page) => page.id === over.id);

    if (!activePage || !overPage) return;

    // Only allow reordering within the same level and same parent
    if (
      activePage.level !== overPage.level ||
      activePage.parentId !== overPage.parentId
    ) {
      console.log("Cannot reorder pages across different levels or parents");
      return;
    }

    // Get all siblings (pages at the same level with the same parent)
    const siblings = flattenedPages.filter(
      (page) =>
        page.level === activePage.level && page.parentId === activePage.parentId
    );

    // Find indices within the siblings array
    const oldIndex = siblings.findIndex((page) => page.id === activePage.id);
    const newIndex = siblings.findIndex((page) => page.id === overPage.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Reorder the siblings
    const newSiblings = arrayMove(siblings, oldIndex, newIndex);

    // Update the order property for each sibling
    const updatedSiblings = newSiblings.map((page, index) => ({
      ...page,
      order: index,
    }));

    // Create a new flattened pages array with the updated siblings
    const newFlattenedPages = flattenedPages.map((page) => {
      const updatedSibling = updatedSiblings.find((s) => s.id === page.id);
      return updatedSibling || page;
    });

    setFlattenedPages(newFlattenedPages);

    // Rebuild the hierarchy with the updated orders
    const rebuildHierarchy = (flatPages: Page[]): Page[] => {
      // Create a deep copy to avoid mutation issues
      const pagesCopy = JSON.parse(JSON.stringify(flatPages)) as Page[];

      // Reset children arrays
      pagesCopy.forEach((page) => {
        page.children = [];
      });

      // Create a map for quick lookups
      const pageMap = new Map<number, Page>();
      pagesCopy.forEach((page) => {
        pageMap.set(page.id, page);
      });

      // Build the hierarchy
      const result: Page[] = [];
      pagesCopy.forEach((page) => {
        if (page.parentId === null) {
          result.push(page);
        } else {
          const parent = pageMap.get(page.parentId);
          if (parent) {
            parent.children.push(page);
          }
        }
      });

      // Sort children by order
      const sortChildren = (pages: Page[]) => {
        pages.forEach((page) => {
          page.children.sort((a, b) => a.order - b.order);
          sortChildren(page.children);
        });
      };

      sortChildren(result);
      result.sort((a, b) => a.order - b.order);

      return result;
    };

    const newHierarchy = rebuildHierarchy(newFlattenedPages);
    setPages(newHierarchy);

    // Update the order of the pages in the database
    try {
      // Only update the pages that were reordered (the siblings)
      const updatePromises = updatedSiblings.map((page) => {
        return api.put(`/page/order`, {
          pageId: page.id,
          newOrder: page.order,
        });
      });
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error updating page order:", error);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 max-w-2xl">
      <div className="bg-white/90 shadow-xl rounded-2xl border border-[var(--admin-border)] p-6">
        <h1 className="text-2xl font-bold text-[var(--admin-bg-secondary)] mb-6 text-center">
          Sort Pages
        </h1>
        {flattenedPages.length === 0 ? (
          <p className="text-[var(--admin-primary)] text-center">
            No pages found.
          </p>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={flattenedPages.map((page) => page.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {flattenedPages.map((page) => (
                  <div
                    key={page.id}
                    className="bg-[var(--admin-bg-lightest)] rounded-lg shadow flex items-center px-4 py-3 border border-[var(--admin-border)] hover:bg-[var(--admin-bg-light)] transition-all"
                  >
                    <SortableItem page={page} />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
