"use client";
import { useRouter } from "next/router";
import ArticleEditor from "@/components/article-editor";
import axios from "axios";
import { env } from "@/config/env";
import Cookies from "js-cookie";

export default function NewArticlePage() {
  const router = useRouter();

  const handleSave = async (article: any, showToast: (title: string, message: string) => void) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        showToast("Error", "No token found. Please log in.");
        return;
      }

      const response = await axios.post(
        `${env.API}/article`,
        { ...article },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      } else {
        showToast("Article saved", "Your article has been saved successfully");
        console.log("Article saved:", response.data);
      }

      // After saving, redirect to the articles list
      router.push("/dashboard/articles");
    } catch (error: any) {
      console.error("Failed to save article:", error);
      showToast("Error", `Failed to save article: ${error.message}`);
    }
  };

  return (
    <div className="w-full bg-gray-100 py-10">
      <ArticleEditor onSave={handleSave} />
    </div>
  );
}

