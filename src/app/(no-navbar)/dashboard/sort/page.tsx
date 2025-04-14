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
}

const fetchPages = async (): Promise<Page[]> => {
  const res = await fetch(`${env.API}/page/order`);
  if (!res.ok) {
    throw new Error("Failed to fetch pages");
  }
  const { data } = await res.json();
  return data;
};

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
  const [pagesByLevel, setPagesByLevel] = useState<Record<number, Page[]>>({});
  const [selectedLevel, setSelectedLevel] = useState<number>(1); // Default to Level 1
  const token = Cookies.get("token");

  useEffect(() => {
    const getPages = async () => {
      try {
        const pagesData = await fetchPages();

        const groupedPages = pagesData.reduce((acc, page) => {
          if (!acc[page.level]) {
            acc[page.level] = [];
          }
          acc[page.level].push(page);
          return acc;
        }, {} as Record<number, Page[]>);

        setPagesByLevel(groupedPages);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    getPages();
  }, []);

  const handleDragEnd = async ({ active, over }: any, level: number) => {
    if (!over) return;

    const pages = pagesByLevel[level];
    const oldIndex = pages.findIndex((page) => page.id === active.id);
    const newIndex = pages.findIndex((page) => page.id === over.id);

    if (oldIndex !== newIndex) {
      const newPages = arrayMove(pages, oldIndex, newIndex);

      setPagesByLevel((prev) => ({
        ...prev,
        [level]: newPages,
      }));

      try {
        await Promise.all(
          newPages.map((page, index) =>
            fetch(`${env.API}/page/order`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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
    <div className="article-list-container container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sort Articles by Level
      </h1>

      {/* Dropdown for selecting level */}
      <div className="mb-6">
        <label
          htmlFor="level-select"
          className="block text-lg font-medium text-gray-700"
        >
          Select Level
        </label>
        <select
          id="level-select"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(parseInt(e.target.value, 10))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {Object.keys(pagesByLevel).map((level) => (
            <option key={level} value={level}>
              Level {level}
            </option>
          ))}
        </select>
      </div>

      {/* Render articles for the selected level */}
      {Object.keys(pagesByLevel)
        .filter((level) => parseInt(level, 10) === selectedLevel)
        .map((level) => {
          const levelNumber = parseInt(level, 10);
          const pages = pagesByLevel[levelNumber];

          return (
            <div key={levelNumber}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Level {levelNumber} Articles
              </h2>
              {pages.length === 0 ? (
                <p className="text-gray-500">
                  No articles found for Level {levelNumber}.
                </p>
              ) : (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleDragEnd(event, levelNumber)}
                >
                  <SortableContext
                    items={pages.map((page) => page.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="article-list">
                      {pages.map((page) => (
                        <SortableItem key={page.id} page={page} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ArticleList;
