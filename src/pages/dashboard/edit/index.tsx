import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import PathSelector from "@/components/PathSelector";
import axios from "axios";
import Cookies from "js-cookie";
import { env } from "@/config/env";

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
};

export default function EditArticlesPage() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    if (currentPath.length > 0) {
      getData();
    }
  }, [currentPath]);

  const getData = async () => {
    const length = currentPath.length;
    const fetchType = getType(length);
    const response = await axios.get(`${env.API}/${fetchType}/parent/${currentPath[length - 1]}`, {
      headers: {
        "Authorization": `Bearer ${Cookies.get("token") || ''}`
      }
    });
    console.log('Response data:', response.data.data); // Log the response data
    setArticles(response.data.data);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      // TODO: Implement actual delete logic
      console.log('Deleting article:', id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 pt-16">
        <div className="space-y-6">
          {/* Top Navigation */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
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

          {/* Articles List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Articles</h3>
              <div className="mt-4 divide-y divide-gray-200">
                {articles.length === 0 ? (
                  <p className="py-4 text-gray-500">No articles found in this path</p>
                ) : (
                  articles.map((article) => (
                    <div key={article.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{article.title}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/edit/${article.id}`)}
                            className="inline-flex items-center px-3 py-1 text-sm text-gray-700 hover:text-indigo-600"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}