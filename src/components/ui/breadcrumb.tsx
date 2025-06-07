"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BreadcrumbProps = {
  className?: string;
  homeElement?: React.ReactNode;
  separator?: React.ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

export default function Breadcrumb({
  className,
  homeElement = "Home",
  separator = <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />,
  containerClasses,
  listClasses,
  activeClasses = "text-foreground",
  capitalizeLinks = true,
}: BreadcrumbProps) {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <div className={cn("flex items-center text-sm", className)}>
      <nav aria-label="Breadcrumb">
        <ol className={cn("flex items-center space-x-2", containerClasses)}>
          <li className={listClasses}>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              {homeElement}
            </Link>
          </li>
          {pathNames.length > 0 && separator}
          {pathNames.map((link, index) => {
            const href = `/${pathNames.slice(0, index + 1).join("/")}`;
            const itemLink = capitalizeLinks
              ? link[0].toUpperCase() + link.slice(1, link.length).replace(/-/g, " ")
              : link.replace(/-/g, " ");
            const isActive = paths === href;

            return (
              <React.Fragment key={index}>
                <li className={cn(listClasses, isActive && activeClasses)}>
                  {isActive ? (
                    <span>{itemLink}</span>
                  ) : (
                    <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {itemLink}
                    </Link>
                  )}
                </li>
                {pathNames.length !== index + 1 && separator}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
