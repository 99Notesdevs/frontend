import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import ArticleEditor from "@/components/article-editor"
import PathSelector from "@/components/PathSelector"

export default function AddArticlePage() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  const handleSave = async (articleData: any) => {
    setPublishing(true);
    try {
      // TODO: Implement actual save logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard");
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

                {/* Current Path Display */}
                <div className="text-sm text-gray-500">
                  Current Path: {currentPath.length > 0 ? currentPath.join(" / ") : "Select a path"}
                </div>

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
