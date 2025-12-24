"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { env } from "@/config/env";

interface Tag {
  id: number;
  name: string;
}

interface TagInputProps {
  value: string[] | Array<{ id: string; name: string; [key: string]: any }>;
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add tags...",
  className,
}: TagInputProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const selected = Array.isArray(value) ? value.map(tag => typeof tag === 'string' ? tag : tag.name) : [];

  // Close on outside click
  useEffect(() => {
    const close = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(false);

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Fetch tags (only when needed)
  const fetchTags = async (reset = false) => {
    if (!hasMore && !reset) return;

    const skip = reset ? 0 : page * 10;
    const res = await fetch(`${env.API}/tag?skip=${skip}&take=10`);
    const json = await res.json();
    const incoming = json.data ?? [];

    setTags(prev => (reset ? incoming : [...prev, ...incoming]));
    setHasMore(incoming.length === 10);
    setPage(p => (reset ? 1 : p + 1));
  };

  const addTag = (tag: string) => {
    if (tag && !selected.includes(tag)) {
      onChange([...selected, tag]);
    }
    setInput("");
  };

  const removeTag = (i: number) =>
    onChange(selected.filter((_, idx) => idx !== i));

  const available = tags.filter(t => !selected.includes(t.name));

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        className="flex flex-wrap gap-2 min-h-10 border rounded-md px-3 py-2 cursor-text"
        onClick={() => {
          if (!open) {
            setOpen(true);
            if (!tags.length) fetchTags(true);
          }
        }}
      >
        {selected.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-sm"
          >
            {tag}
            <button type="button" onClick={(e) => {
              e.preventDefault();
              removeTag(i);
            }}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTag(input.trim())}
          placeholder={!selected.length ? placeholder : "Add more..."}
          className="flex-1 outline-none bg-transparent text-sm min-w-[80px]"
        />

        <ChevronDown
          className={cn("h-4 w-4 transition", open && "rotate-180")}
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full border rounded-md bg-popover shadow">
          {available.map(t => (
            <button
              type="button"
              key={t.id}
              onClick={(e) => {
                e.preventDefault();
                addTag(t.name);
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-accent"
            >
              {t.name}
            </button>
          ))}

          {hasMore && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                fetchTags();
              }}
              className="w-full px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
            >
              Load more
            </button>
          )}

          {!available.length && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No tags available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
