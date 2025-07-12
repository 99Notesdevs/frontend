"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        variant="outline"
        className={`
          rounded-full h-12 w-12 shadow-lg 
          bg-background/80 dark:bg-background/90 
          backdrop-blur-sm 
          border border-border dark:border-gray-700
          hover:bg-accent dark:hover:bg-accent/80
          transition-all duration-200
          group
          relative overflow-hidden
        `}
        aria-label="Back to top"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <ArrowUp className="h-5 w-5 text-foreground group-hover:scale-110 transition-transform" />
        <span className="sr-only">Back to top</span>
      </Button>
    </div>
  );
}
