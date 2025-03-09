import React from "react";
import Head from "next/head";
import Link from "next/link";

interface CurrentAffairsTemplateProps {
  title: string;
  description: string;
  navItems: { title: string; path: string }[];
  children: React.ReactNode;
}

const CurrentAffairsTemplate: React.FC<CurrentAffairsTemplateProps> = ({ title, description, navItems, children }) => {
  return (
    <>
      <Head>
        <title>{title} - 99Notes</title>
        <meta name="description" content={description} />
      </Head>
      <main className="w-full p-6 text-gray-800 bg-white flex">
        <nav className="w-1/4 pr-4">
          <ul>
            {navItems && navItems.length > 0 && navItems.map((item, index) => (
              <li key={index} className="mb-2">
                <Link href={item.path} className="text-blue-600 hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="w-3/4">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          {children}
          <div className="mt-8 p-4 bg-gray-100 border border-gray-300">
            <p className="text-center text-gray-600">You are on the {title} page</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default CurrentAffairsTemplate;
