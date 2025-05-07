"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[] | Array<{ name: string }>;
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

const isArray = (value: any[]): value is string[] => {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
};

export function TagInput({
  value,
  onChange,
  placeholder = "Add tags...",
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const currentValues = isArray(value) ? value : value.map(v => v.name);
      onChange([...currentValues, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleDelete = (index: number) => {
    const currentValues = isArray(value) ? value : value.map(v => v.name);
    onChange(currentValues.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("relative flex flex-col gap-2", className)}>
      <div className="flex flex-wrap gap-2 ">
        {(isArray(value) ? value : value.map(v => v.name)).map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-full bg-[var(--admin-border)] border rounded px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:bg-primary/10"
          >
            <span className="text-primary">{tag}</span>
            <button
              type="button"
              onClick={() => handleDelete(index)}
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
}