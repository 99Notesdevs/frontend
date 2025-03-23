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
      const fetchType = getType(currentPath.length);
      const response = await axios.delete(`${env.API}/${fetchType}/${id}`, {
        headers: {
          "Authorization": `Bearer ${Cookies.get("token") || ''}`
        }
      });
      console.log(response.data);
      console.log('Deleting article:', id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="container mx-auto px-4 pt-16">
        <div className="space-y-6">
          {/* Top Navigation */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="space-y-4">
              {/* Back Button */}
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </button>

              {/* Path Selector */}
              <PathSelector onPathChange={setCurrentPath} />
            </div>
          </div>

          {/* Articles List */}
          <div className="bg-white shadow-sm rounded-xl border border-slate-200">
            <div className="px-6 py-5">
              <h3 className="text-lg font-semibold text-slate-900">Articles</h3>
              <div className="mt-4 divide-y divide-slate-200">
                {articles.length === 0 ? (
                  <p className="py-4 text-slate-500">No articles found in this path</p>
                ) : (
                  articles.map((article) => (
                    <div key={article.id} className="py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900">{article.title}</h4>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => router.push(`/dashboard/edit/${currentPath.length}/${article.id}`)}
                            className="inline-flex items-center px-4 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="inline-flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
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