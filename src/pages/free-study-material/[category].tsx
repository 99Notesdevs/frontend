import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const FreeStudyMaterialCategory: React.FC = () => {
  const router = useRouter();
  const { category } = router.query;

  return (
    <>
      <Head>
        <title>{category} - Free Study Material - 99Notes</title>
        <meta name="description" content={`Access free study materials for ${category} to aid your UPSC preparation.`} />
      </Head>
      <main className="w-full p-6 text-gray-800 bg-white">
        <h1 className="text-3xl font-bold mb-4">{category}</h1>
        <p className="text-lg leading-relaxed">Content for {category} will be displayed here.</p>
        {/* Add more content and components as needed */}
      </main>
    </>
  );
};

export default FreeStudyMaterialCategory;
