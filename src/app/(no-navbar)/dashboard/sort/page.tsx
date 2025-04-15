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

interface Page {
  id: number;
  title: string;
  level: number;
  parentId?: number;
  children: Page[];
}

const fetchPages = async (): Promise<Page[]> => {
  const res = await fetch(`${env.API}/page/order`);
  if (!res.ok) {
    throw new Error("Failed to fetch pages");
  }
  const { data } = await res.json();
  // @ts-ignore
  const pagesById = data.reduce((acc, page) => {
    acc[page.id] = { ...page, children: [] };
    return acc;
  }, {} as Record<number, Page>);

  data.forEach((page: { id: number; parentId?: number }) => {
    if (page.parentId) {
      pagesById[page.parentId].children.push(pagesById[page.id]);
    }
  });
  // @ts-ignore
  return Object.values(pagesById).filter((page) => !page.parentId);
};

const SortableItem = ({
  page,
  level,
  setPagesByLevel,
}: {
  page: Page;
  level: number;
  setPagesByLevel: React.Dispatch<React.SetStateAction<Page[]>>;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="article-item bg-white shadow-sm rounded-lg p-4 mb-2 border border-gray-200"
      >
        <h3
          className="text-lg font-semibold text-gray-800 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {page.title} {page.children.length > 0 && (isExpanded ? "▼" : "▶")}
        </h3>
      </div>

      {isExpanded && page.children.length > 0 && (
        <div className="ml-6">
          <SortableList
            pages={page.children}
            level={level + 1}
            setPagesByLevel={setPagesByLevel}
          />
        </div>
      )}
    </div>
  );
};

const SortableList = ({
  pages,
  level,
  setPagesByLevel,
}: {
  pages: Page[];
  level: number;
  setPagesByLevel: React.Dispatch<React.SetStateAction<Page[]>>;
}) => {
  const handleDragEnd = async ({ active, over }: any) => {
    if (!over) return;

    const oldIndex = pages.findIndex((page) => page.id === active.id);
    const newIndex = pages.findIndex((page) => page.id === over.id);

    if (oldIndex !== newIndex) {
      const newPages = arrayMove(pages, oldIndex, newIndex);

      // Update the order locally
      setPagesByLevel((prev) => {
        const updatePages = (pages: Page[]): Page[] =>
          pages.map((p) =>
            p.id === pages[0].id ? { ...p, children: newPages } : p
          );
        return updatePages(prev);
      });

      // Update the order in the database
      try {
        await Promise.all(
          newPages.map((page, index) =>
            fetch(`${env.API}/page/order`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
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
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={pages.map((page) => page.id)}
        strategy={verticalListSortingStrategy}
      >
        {pages.map((page) => (
          <SortableItem
            key={page.id}
            page={page}
            level={level}
            setPagesByLevel={setPagesByLevel}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

const ArticleList = () => {
  const [pagesByLevel, setPagesByLevel] = useState<Page[]>([]);

  useEffect(() => {
    const getPages = async () => {
      try {
        const pagesData = await fetchPages();
        setPagesByLevel(pagesData);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    getPages();
  }, []);

  return (
    <div className="article-list-container container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sort Articles by Level
      </h1>

      <SortableList
        pages={pagesByLevel}
        level={1}
        setPagesByLevel={setPagesByLevel}
      />
    </div>
  );
};

export default ArticleList;
