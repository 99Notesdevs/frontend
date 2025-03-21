import { useState } from 'react';
import Link from 'next/link';
import { Edit, ArrowRight } from 'lucide-react';
import PathSelector from './PathSelector';

interface Article {
  id: string;
  title: string;
  path: string[];
  updatedAt: string;
}

// This will be replaced with actual API call
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Introduction to Ancient India',
    path: ['UPSC Notes', 'General Studies 1', 'History', 'Ancient India'],
    updatedAt: '2025-03-21'
  },
  {
    id: '2',
    title: 'Harappan Civilization',
    path: ['UPSC Notes', 'General Studies 1', 'History', 'Ancient India'],
    updatedAt: '2025-03-20'
  }
];

export default function ArticleBrowser() {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>(mockArticles);

  // Filter articles based on selected path
  const filteredArticles = articles.filter(article => {
    if (selectedPath.length === 0) return true;
    return selectedPath.every((pathItem, index) => article.path[index] === pathItem);
  });

  return (
    <div className="space-y-6">
      {/* Path Selector */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">Browse Articles by Path</h2>
        <PathSelector onPathChange={setSelectedPath} />
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {selectedPath.length > 0 ? `Articles in ${selectedPath.join(' / ')}` : 'All Articles'}
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div key={article.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Path: {article.path.join(' / ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last updated: {article.updatedAt}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/editor/${article.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No articles found in this path
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
