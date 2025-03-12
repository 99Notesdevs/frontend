import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArticleEditor } from "@/components/article-editor"; // Updated import

const EditorPage = () => {
  const router = useRouter();
  const { slug } = router.query; // Get slug from URL

  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        // Fetch article data (replace with actual API call)
        const response = await fetch(`/api/articles/${slug}`);
        if (!response.ok) throw new Error("Article not found");
        const data = await response.json();
        setArticleData(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!articleData) return <p>Article not found.</p>;

  return <ArticleEditor initialData={articleData} />;
};

export default EditorPage;
