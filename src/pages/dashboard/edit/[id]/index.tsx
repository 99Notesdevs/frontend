import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ArticleEditor from "@/components/article-editor";
import PathSelector from "@/components/PathSelector";

interface Article {
  id: string;
  title: string;
  content: string;
  path: string[];
  updatedAt: string;
  tags: string[];
}

// Mock function to get article data - replace with actual API call
const getArticleById = async (id: string): Promise<Article> => {
  // Simulating API call
  return {
    id,
    title: "Introduction to Ancient India",
    content: "<p>This is a sample article about Ancient India...</p>",
    path: ["UPSC Notes", "General Studies 1", "History", "Ancient India"],
    updatedAt: "2025-03-21",
    tags: ["history", "india", "ancient"],
  };
};

export default function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      if (id) {
        try {
          const articleId = Array.isArray(id) ? id[0] : id;
          const data = await getArticleById(articleId);
          setArticle(data);
          setCurrentPath(data.path);
        } catch (error) {
          console.error("Failed to load article:", error);
          router.push("/dashboard/edit");
        }
      } else {
        console.error("Article ID is undefined");
        router.push("/dashboard/edit");
      }
    };

    loadArticle();
  }, [id, router]);

  const handleSave = async (articleData: any) => {
    setPublishing(true);
    try {
      // TODO: Implement actual update logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard/edit");
    } catch (error) {
      console.error("Failed to update article:", error);
    } finally {
      setPublishing(false);
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 pt-16">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 pt-16">
        <div className="flex gap-6">
          <div className="flex-1">
            {/* Top Navigation */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="space-y-4">
                {/* Back Button */}
                <button
                  onClick={() => router.push("/dashboard/edit")}
                  className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Articles
                </button>

                {/* Path Selector */}
                <PathSelector onPathChange={setCurrentPath} />
              </div>
            </div>

            {/* Editor Section */}
            <ArticleEditor
              initialContent={article.content}
              initialTags={article.tags}
              onSave={handleSave}
              isPublishing={publishing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
