import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import ArticleEditor from "@/components/article-editor";
import PathSelector from "@/components/PathSelector";
import axios from "axios";
import Cookies from "js-cookie";
import { env } from "@/config/env";

interface Article {
  id: string;
  title: string;
  content: string;
  path: string[];
  updatedAt: string;
  tags: string[];
}

const getType = (len: number) => {
  switch (len) {
    case 0:
      return "exam";
    case 1:
      return "domain";
    case 2:
      return "subject";
    case 3:
      return "chapter";
    case 4:
      return "topic";
    case 5:
      return "article";
    case 6:
      return "subarticle";
    default:
      return "exam";
  }
};

export default function EditArticlePage() {
  const router = useRouter();
  const { len, id } = router.query;
  const length = Array.isArray(len) ? Number(len[0]) : Number(len);
  const articleId = Array.isArray(id) ? id[0] : id;
  const [article, setArticle] = useState<Article | null>(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      if (id && len) {
        try {
          const length = Array.isArray(len) ? Number(len[0]) : Number(len);
          console.log("Length:", length);
          console.log("Article ID:", articleId);
          const fetchType = getType(length);
          const res = await axios.get(`${env.API}/${fetchType}/${articleId}`);
          setArticle(res.data.data);
        } catch (error) {
          console.error("Failed to load article:", error);
          router.push("/dashboard/edit");
        }
      } else {
        console.error("Article ID or length is undefined");
        router.push("/dashboard/edit");
      }
    };

    loadArticle();
  }, [id, len, router]);

  const handleSave = async (articleData: any) => {
    setPublishing(true);
    try {
      // TODO: Implement actual save logic
      const fetchType = getType(length);
      const response = await axios.put(`${env.API}/${fetchType}/${articleId}`, {
        title: articleData.title,
        content: articleData.content,
      }, {
        headers: {
          "Authorization": `Bearer ${Cookies.get("token") || ''}`
        }
      });
      if (response.status !== 400) {
        alert("DONE");
        router.push("/dashboard");
      } else {
        alert("failed");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to save article:", error);
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
              </div>
            </div>

            {/* Editor Section */}
            <ArticleEditor
              initialTitle={article.title}
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
