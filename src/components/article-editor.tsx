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
    <div className="flex gap-6">
      {/* Main Editor Section */}
      <div className="flex-1 space-y-4">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title..."
            className="w-full px-4 py-2 text-xl font-semibold border-b border-gray-200 focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* Editor */}
        <div className="prose max-w-none">
          <TipTapEditor content={content} setContent={setContent} />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-6">
        {/* Publish Settings Card */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Publish Settings</h3>
          
          {/* Schedule Publication */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Publication
              </div>
            </label>
            <input
              type="datetime-local"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Reading Time Estimate */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {Math.ceil(content.split(' ').length / 200)} min read
            </div>
          </div>
        </div>

        {/* Tags Card */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Tags</h3>
          
          {/* Add Tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleAddTag}
              className="p-2 text-gray-600 hover:text-indigo-600"
            >
              <Tag className="w-4 h-4" />
            </button>
          </div>

          {/* Tags List */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm text-gray-700 rounded-md"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-400 hover:text-red-500"
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
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 mr-2" />
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
