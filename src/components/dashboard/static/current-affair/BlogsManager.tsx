"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tags/tag-input";
import TiptapEditor from "@/components/ui/tiptapeditor";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import { env } from "@/config/env";
import Cookie from "js-cookie";

export interface Blog {
  id?: string;  
  title: string;
  content: string;
  tags: string[];
  slug: string;
  parentSlug?: string;
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BlogsManagerProps {
  initialBlogs?: Blog[];
  onChange: (blogs: Blog[]) => void;
  currentAffairSlug: string;
  currentAffairAuthor?: string;
}

export function BlogsManager({ 
  initialBlogs = [], 
  onChange,
  currentAffairSlug,
  currentAffairAuthor 
}: BlogsManagerProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({
    title: "",
    content: "",
    tags: [],
    slug: "",
  });
  const [showForm, setShowForm] = useState(false);

  const handleAddBlog = async () => {
    if (!currentBlog.title || !currentBlog.slug) return;

    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Prepare the blog data
      const blogData = {
        title: currentBlog.title,
        content: currentBlog.content || '',
        slug: currentBlog.slug,
        tags: currentBlog.tags || [],
        parentSlug: currentAffairSlug,
        author: currentAffairAuthor || ""
      };

      // If we're editing an existing blog, update it
      if (isEditing) {
        const response = await fetch(`${env.API}/currentBlog`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(blogData)
        });

        if (!response.ok) {
          throw new Error('Failed to add blog');
        }

        const updatedBlogs = blogs.map(blog => 
          blog.id === isEditing ? { ...blog, ...blogData } : blog
        );
        
        setBlogs(updatedBlogs);
        onChange(updatedBlogs);
      } 
      // Otherwise, create a new blog
      else {
        const updatedBlogs = [...blogs, { ...currentBlog, ...blogData }];
        
        setBlogs(updatedBlogs);
        onChange(updatedBlogs);
      }

      resetForm();
      
    } catch (error) {
      console.error('Error saving blog:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleUpdateBlog = async () => {
    if (!isEditing || !currentBlog.title || !currentBlog.slug) return;

    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const updatedBlog = {
        ...currentBlog,
        title: currentBlog.title || '',
        content: currentBlog.content || '',
        slug: currentBlog.slug || '',
        tags: currentBlog.tags || [],
      };

      // Update the blog via API
      const response = await fetch(`${env.API}/currentBlog/${currentBlog.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBlog)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update blog');
      }

      // Update local state with the updated blog
      const updatedBlogs = blogs.map((blog) =>
        blog.id === isEditing ? updatedBlog : blog
      );

      setBlogs(updatedBlogs);
      onChange(updatedBlogs);
      resetForm();
      
    } catch (error) {
      console.error('Error updating blog:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDeleteBlog = async (id?: string) => {
    if (!id) return;
    const updatedBlogs = blogs.filter((blog) => blog.id !== id);
    const token = Cookie.get('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    const response = await fetch(`${env.API}/currentBlog/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete blog');
    }
    setBlogs(updatedBlogs);
    onChange(updatedBlogs);
  };

  const handleEditBlog = (blog: Blog) => {
    setCurrentBlog({
      ...blog,
      // Ensure tags are in the correct format for the input
      tags: blog.tags ? blog.tags.map(tag => 
        typeof tag === 'string' ? tag : tag || ''
      ) : []
    });
    setIsEditing(blog.id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setCurrentBlog({
      title: "",
      content: "",
      tags: [],
      slug: "",
    });
    setIsEditing(null);
    setShowForm(false);
  };

  // Convert tag objects to strings if needed
  const normalizeTags = (tags: any[] | undefined) => {
    if (!tags) return [];
    return tags.map(tag => typeof tag === 'string' ? tag : tag.name || '').filter(Boolean);
  };

  const handleTagChange = (id: string, tags: any[]) => {
    const normalizedTags = tags.map(tag => 
      typeof tag === 'string' ? tag : tag.name || ''
    );
    
    setCurrentBlog({
      ...currentBlog,
      tags: normalizedTags
    });
  };

  const handleBlogChange = (id: string, field: keyof Blog, value: any) => {
    const updatedBlogs = blogs.map((blog) =>
      blog.id === id ? { ...blog, [field]: value } : blog
    );
    onChange(updatedBlogs);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Blogs</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? "Cancel" : "Add Blog"}
        </Button>
      </div>

      {showForm && (
        <div className="space-y-4 p-4 border rounded-lg">
          <div>
            <Label className="block text-sm font-medium mb-1">Title</Label>
            <Input
              value={currentBlog.title || ""}
              onChange={(e) =>
                setCurrentBlog({ ...currentBlog, title: e.target.value })
              }
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1">Slug</Label>
            <Input
              value={currentBlog.slug || ""}
              onChange={(e) =>
                setCurrentBlog({ 
                  ...currentBlog, 
                  slug: e.target.value
                })
              }
              placeholder="Enter URL slug"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1">Content</Label>
            <div className="border rounded-md overflow-hidden">
              <TiptapEditor
                content={currentBlog.content || ""}
                onChange={(html) => 
                  setCurrentBlog({ ...currentBlog, content: html })
                }
              />
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1">Tags</Label>
            <TagInput
              placeholder="Add tags..."
              value={normalizeTags(currentBlog.tags)}
              className="w-full"
              onChange={(tags) => handleTagChange(currentBlog.id || "", tags)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={isEditing ? handleUpdateBlog : handleAddBlog}
            >
              {isEditing ? "Update Blog" : "Add Blog"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {blogs.map((blog, index) => (
          <div
            key={blog.id || `blog-${index}`}
            className="flex justify-between items-center p-3 border rounded-lg"
          >
            <div>
              <h4 className="font-medium">{blog.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-1">
                {blog.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {blog.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleEditBlog(blog)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => blog.id && handleDeleteBlog(blog.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
