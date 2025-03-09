import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const SubcategoryPage: React.FC = () => {
  const router = useRouter();
  const { subcategory } = router.query;

  const subcategoryContent: { [key: string]: string } = {
    "prelims": "Content for UPSC Prelims Syllabus",
    "mains": "Content for UPSC Mains Syllabus",
    "optional": "Content for UPSC Optional Syllabus"
  };

  return (
    <>
      <Head>
        <title>{subcategory} - Free Study Material - 99Notes</title>
      </Head>
      <main className="w-full p-6 text-gray-800 bg-white">
        <h1 className="text-3xl font-bold mb-4">{subcategory}</h1>
        <p className="text-lg leading-relaxed">{subcategory ? subcategoryContent[subcategory as string] : "Loading..."}</p>
        <div className="mt-8 p-4 bg-gray-100 border border-gray-300">
          <p className="text-center text-gray-600">You are on the {subcategory} page</p>
        </div>
      </main>
    </>
  );
};

export default SubcategoryPage;
