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
import { env } from "@/config/env";
import Cookies from "js-cookie";

// Define the type for a Current Affair
interface CurrentAffair {
  id: number;
  title: string;
  type: "daily" | "monthly" | "yearly"; // Types of current affairs
  order: number;
}

// Fetch current affairs by type from the API
const fetchCurrentAffairsByType = async (
  type: "daily" | "monthly" | "yearly"
): Promise<CurrentAffair[]> => {
  const res = await fetch(`${env.API}/currentAffair/type/${type}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${type} current affairs`);
  }
  const { data } = await res.json();
  return data;
};

// Sortable Item Component
const SortableItem = ({ affair }: { affair: CurrentAffair }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: affair.id });

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
      className="bg-white shadow-sm rounded-lg p-4 mb-2 border border-gray-200 cursor-move"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{affair.title}</h3>
        <span className="text-sm text-gray-500">Order: {affair.order}</span>
      </div>
    </div>
  );
};

const CurrentAffairsList = () => {
  const [dailyAffairs, setDailyAffairs] = useState<CurrentAffair[]>([]);
  const [monthlyAffairs, setMonthlyAffairs] = useState<CurrentAffair[]>([]);
  const [yearlyAffairs, setYearlyAffairs] = useState<CurrentAffair[]>([]);
  const token = Cookies.get("token");

  useEffect(() => {
    const getCurrentAffairs = async () => {
      try {
        // Fetch current affairs by type
        const [daily, monthly, yearly] = await Promise.all([
          fetchCurrentAffairsByType("daily"),
          fetchCurrentAffairsByType("monthly"),
          fetchCurrentAffairsByType("yearly"),
        ]);

        // Set state for each type
        setDailyAffairs(daily.sort((a, b) => a.order - b.order));
        setMonthlyAffairs(monthly.sort((a, b) => a.order - b.order));
        setYearlyAffairs(yearly.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Error fetching current affairs:", error);
      }
    };
    getCurrentAffairs();
  }, []);

  const handleDragEnd = async (
    event: DragEndEvent,
    type: "daily" | "monthly" | "yearly"
  ) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Get the list of current affairs for the specific type
    const affairs =
      type === "daily"
        ? dailyAffairs
        : type === "monthly"
        ? monthlyAffairs
        : yearlyAffairs;

    // Find indices within the list
    const oldIndex = affairs.findIndex((affair) => affair.id === active.id);
    const newIndex = affairs.findIndex((affair) => affair.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Reorder the list
    const newAffairs = arrayMove(affairs, oldIndex, newIndex);

    // Update the order property for each item
    const updatedAffairs = newAffairs.map((affair, index) => ({
      ...affair,
      order: index,
    }));

    // Update the state for the specific type
    if (type === "daily") {
      setDailyAffairs(updatedAffairs);
    } else if (type === "monthly") {
      setMonthlyAffairs(updatedAffairs);
    } else {
      setYearlyAffairs(updatedAffairs);
    }

    // Update the order of the current affairs in the database
    try {
      const updatePromises = updatedAffairs.map((affair) => {
        console.log("order", affair.order);
        return fetch(`${env.API}/currentAffair/update/order`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: affair.id, newOrder: affair.order }),
        });
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error updating current affairs order:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sort Current Affairs
      </h1>

      {/* Daily Affairs */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Daily Affairs
        </h2>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event, "daily")}
        >
          <SortableContext
            items={dailyAffairs.map((affair) => affair.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {dailyAffairs.map((affair) => (
                <SortableItem key={affair.id} affair={affair} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Monthly Affairs */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Monthly Affairs
        </h2>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event, "monthly")}
        >
          <SortableContext
            items={monthlyAffairs.map((affair) => affair.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {monthlyAffairs.map((affair) => (
                <SortableItem key={affair.id} affair={affair} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Yearly Affairs */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Yearly Affairs
        </h2>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event, "yearly")}
        >
          <SortableContext
            items={yearlyAffairs.map((affair) => affair.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {yearlyAffairs.map((affair) => (
                <SortableItem key={affair.id} affair={affair} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default CurrentAffairsList;
