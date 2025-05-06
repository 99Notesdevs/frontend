"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface TagsProps {
  tags: Array<{ name: string }>;
}

export function Tags({ tags }: TagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/tag/${encodeURIComponent(tag.name)}`}
          className="group relative inline-flex items-center justify-center px-6 py-3 text-lg font-medium transition-all duration-200 ease-out hover:bg-[var(--accent-link)] hover:text-white"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent-link)] to-[var(--accent-link-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <span className="relative">#</span>
          <span className="relative ml-1">{tag.name}</span>
        </Link>
      ))}
    </div>
  );
}