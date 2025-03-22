import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Save, Tag, Calendar, Clock } from 'lucide-react';

const TipTapEditor = dynamic(() => import('./tiptapeditor'), { ssr: false });

export interface ArticleEditorProps {
  initialContent?: string;
  initialTags?: string[];
  onSave: (data: { title: string; content: string; tags: string[]; publishDate?: string }) => void;
  isPublishing?: boolean;
}

export default function ArticleEditor({ 
  initialContent, 
  initialTags = [], 
  onSave, 
  isPublishing = false 
}: ArticleEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(initialContent || '');
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [publishDate, setPublishDate] = useState<string>('');

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave({
      title,
      content,
      tags,
      publishDate: publishDate || undefined
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-3 sm:p-6 bg-gray-50/30">
      {/* Main Editor Section */}
      <div className="w-full lg:flex-1 space-y-4">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title..."
            className="w-full px-4 py-2 text-xl font-semibold border-b border-gray-200 focus:outline-none focus:border-gray-600 bg-transparent text-gray-800 placeholder-gray-500"
          />
        </div>

        {/* Editor */}
        <div className="prose max-w-none bg-white/70 rounded-lg shadow-sm p-6">
          <TipTapEditor content={content} setContent={setContent} />
        </div>
      </div>

      {/* Right/Bottom Sidebar */}
      <div className="w-full lg:w-72 xl:w-80 space-y-4 sm:space-y-6 text-gray-700 my-15">
        {/* Tags Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-5 space-y-3 sm:space-y-4 border border-gray-100/20">
          <h3 className="font-medium text-gray-800 flex items-center gap-2 text-sm sm:text-base">
            <Tag className="w-4 h-4 text-gray-700" />
            Tags
          </h3>
          
          {/* Add Tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add a tag..."
              className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white/20 text-gray-800 placeholder-gray-500"
            />
            <button
              onClick={handleAddTag}
              className="p-1.5 sm:p-2 text-gray-700 hover:text-gray-900 bg-white/20 rounded-lg transition-colors"
            >
              <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Tags List */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 text-xs sm:text-sm text-gray-800 rounded-lg"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isPublishing}
          className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-black/90 text-white rounded-lg hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
