import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import ArticleEditor from "@/components/article-editor"
import PathSelector from "@/components/PathSelector"
import { env } from "@/config/env"
import axios from "axios"
import Cookies from "js-cookie"
import { title } from "process"

export default function AddArticlePage() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  const getType = (len: Number) => {
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
  }

  const handleSave = async (articleData: any) => {
    setPublishing(true);
    try {
      // TODO: Implement actual save logic
      const pathLength = currentPath.length;
      const fetchType = getType(pathLength);
      const response = await axios.post(`${env.API}/${fetchType}`, {
        title: articleData.title,
        content: articleData.content,
        slug: 'something',
        parentID: currentPath[pathLength - 1],
      } , {
        headers: {
          "Authorization": `Bearer ${Cookies.get("token") || ''}`
        }
      });
      if(response.status !== 400) {
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
                  onClick={() => router.push("/dashboard")}
                  className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </button>

                {/* Path Selector */}
                <PathSelector onPathChange={setCurrentPath} />
              </div>
            </div>

            {/* Editor Section */}
            <ArticleEditor
              onSave={handleSave}
              isPublishing={publishing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
