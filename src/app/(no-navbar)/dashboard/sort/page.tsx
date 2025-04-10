"use client";
import React, { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { env } from "@/config/env";
import Cookies from "js-cookie";

// Define the type for a page
interface Page {
  id: number;
  title: string;
  level: number; // Add level property to the Page type
}

// Fetch pages from the API
const fetchPages = async (): Promise<Page[]> => {
  const res = await fetch(`${env.API}/page/order`);
  if (!res.ok) {
    throw new Error("Failed to fetch pages");
  }
  const { data } = await res.json();
  return data;
};

// Sortable Item Component
const SortableItem = ({ page }: { page: Page }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="article-item bg-white shadow-sm rounded-lg p-4 mb-2 border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-800">{page.title}</h3>
    </div>
  );
};

const ArticleList = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const token = Cookies.get('token');
  const [level0Pages, setLevel0Pages] = useState<Page[]>([]); // State for level 0 pages

  useEffect(() => {
    const getPages = async () => {
      try {
        const pagesData = await fetchPages();
        setPages(pagesData);

        // Filter pages with level 0
        const filteredPages = pagesData.filter((page) => page.level === 1);
        setLevel0Pages(filteredPages);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };
    getPages();
  }, []);

  const handleDragEnd = async ({ active, over }: any) => {
    if (!over) return;

    const oldIndex = level0Pages.findIndex((page) => page.id === active.id);
    const newIndex = level0Pages.findIndex((page) => page.id === over.id);

    if (oldIndex !== newIndex) {
      const newPages = arrayMove(level0Pages, oldIndex, newIndex);
      setLevel0Pages(newPages);

      // Update the order of the pages in the database
      try {
        await Promise.all(
          newPages.map((page, index) =>
            fetch(`${env.API}/page/order`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ pageId: page.id, newOrder: index }),
            })
          )
        );
      } catch (error) {
        console.error("Error updating page order:", error);
      }
    }
  };

  return (
    <div className="article-list-container container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sort Level 1 Articles
      </h1>
      {level0Pages.length === 0 ? (
        <p className="text-gray-500">No level 1 articles found.</p>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={level0Pages.map((page) => page.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="article-list">
              {level0Pages.map((page) => (
                <SortableItem key={page.id} page={page} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ArticleList;
