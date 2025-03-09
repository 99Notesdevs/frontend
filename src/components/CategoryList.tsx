import React from "react";
import Link from "next/link";

interface Category {
  title: string;
  path: string;
}

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.path} className="mb-2">
          <Link href={category.path} legacyBehavior>
            <a className="text-blue-500 hover:underline">{category.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
