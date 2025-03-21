import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import PathSelector from "@/components/PathSelector";
import { useState } from "react";

// Mock articles data - replace with API call
const mockArticles = [
  {
    id: '1',
    title: 'Introduction to Ancient India',
    path: ['UPSC Notes', 'General Studies 1', 'History', 'Ancient India'],
    updatedAt: '2025-03-21',
  },
  {
    id: '2',
    title: 'Medieval Indian History',
    path: ['UPSC Notes', 'General Studies 1', 'History', 'Medieval India'],
    updatedAt: '2025-03-21',
  },
];

export default function EditArticlesPage() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // Filter articles based on selected path
  const filteredArticles = mockArticles.filter(article => {
    if (currentPath.length === 0) return true;
    return currentPath.every((pathItem, index) => article.path[index] === pathItem);
  });

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

              {/* Current Path Display */}
              <div className="text-sm text-gray-500">
                Current Path: {currentPath.length > 0 ? currentPath.join(" / ") : "All Articles"}
              </div>

              {/* Path Selector */}
              <PathSelector onPathChange={setCurrentPath} />
            </div>
          </div>

          {/* Articles List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Articles</h3>
              <div className="mt-4 divide-y divide-gray-200">
                {filteredArticles.length === 0 ? (
                  <p className="py-4 text-gray-500">No articles found in this path</p>
                ) : (
                  filteredArticles.map((article) => (
                    <div key={article.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{article.title}</h4>
                          <p className="text-sm text-gray-500">{article.path.join(' / ')}</p>
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
