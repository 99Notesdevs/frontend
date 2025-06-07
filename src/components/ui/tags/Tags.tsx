"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface TagsProps {
  tags: Array<{ name: string }>;
}

export function Tags({ tags }: TagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--info-surface)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-md font-semibold text-[var(--surface-dark)]">
            🏷 Tags
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className="group"
          >
            <Badge
              variant="secondary"
              className="bg-yellow-50 text-[var(--primary)] hover:bg-[var(--info-surface)] transition-colors duration-200 cursor-pointer px-4 py-2 text-base"
            >
              {tag.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}