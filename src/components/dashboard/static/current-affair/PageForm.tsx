"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import TiptapEditor  from '@/components/ui/tiptapeditor';
import { env } from '@/config/env';
import Cookie from 'js-cookie';
import Image from 'next/image';
import {uploadImageToS3} from '@/config/imageUploadS3';
// Types for CurrentAffair models
interface CurrentAffairType {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  type: string; // daily, monthly, yearly
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  dailyArticle?: CurrentAffairArticleType[];
}

interface CurrentAffairArticleType {
  id: number;
  title: string;
  content: string;
  slug: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  parentSlug: string;
}

interface PageFormProps {
  editPage?: CurrentAffairArticleType | null;
}

export function PageForm({ editPage = null }: PageFormProps) {
  // Step management
  const [step, setStep] = useState(1); // 1: Select Type, 2: Select/Create CurrentAffair, 3: Create Article
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState({
    fetchingAffairs: false,
    creatingAffair: false,
    creatingArticle: false,
    uploadingImage: false
  });

  // Step 1: Type selection
  const [selectedType, setSelectedType] = useState<string>('daily');
  
  // Step 2: CurrentAffair selection/creation
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairType[]>([]);
  const [selectedAffairId, setSelectedAffairId] = useState<string>('');
  const [createNewAffair, setCreateNewAffair] = useState(false);
  const [newAffairData, setNewAffairData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    type: 'daily'
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Step 3: Article creation
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    author: ''
  });
  
  const token = Cookie.get('token');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch current affairs based on selected type
  useEffect(() => {
    if (selectedType) {
      fetchCurrentAffairsByType(selectedType);
    }
  }, [selectedType]);

  const fetchCurrentAffairsByType = async (type: string) => {
    try {
      setIsLoading(prev => ({ ...prev, fetchingAffairs: true }));
      const token = Cookie.get('token');
      const response = await fetch(`${env.API}/currentAffair/type/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'No error details available' }));
        throw new Error(`Failed to fetch current affairs: ${errorData.message || response.statusText}`);
      }
      
      const { data } = await response.json();
      setCurrentAffairs(data || []);
    } catch (error) {
      console.error('Detailed error fetching current affairs:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      showToast('Failed to fetch current affairs. Please try again.', 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, fetchingAffairs: false }));
    }
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setSelectedAffairId('');
    setCreateNewAffair(false);
    setNewAffairData({
      ...newAffairData,
      type: value
    });
  };

  const handleAffairChange = (value: string) => {
    if (value === 'new') {
      setCreateNewAffair(true);
      setSelectedAffairId('');
    } else {
      setCreateNewAffair(false);
      setSelectedAffairId(value);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          setIsLoading(prev => ({ ...prev, uploadingImage: true }));
          const result = reader.result as string;
          setImagePreview(result);
          
          // Upload the image to S3
          const formData = new FormData();
          formData.append("image", file);

          const s3Url = await uploadImageToS3(formData);
          if (s3Url) {
            setNewAffairData(prev => ({ ...prev, imageUrl: s3Url }));
          } else {
            throw new Error("Failed to upload image to S3");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          setToast({ message: "Failed to upload image", type: "error" });
        } finally {
          setIsLoading(prev => ({ ...prev, uploadingImage: false }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAffair = async () => {
    try {
      setIsLoading(prev => ({ ...prev, creatingAffair: true }));
      if (!newAffairData.title) {
        throw new Error('Title is required');
      }

      // Create slug from title with current-affairs prefix
      const baseSlug = newAffairData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const slug = `current-affairs/${baseSlug}`;

      // Ensure content is a string (even if empty)
      const content = newAffairData.content || '';

      const affairData = {
        title: newAffairData.title,
        content,
        imageUrl: newAffairData.imageUrl,
        type: newAffairData.type,
        slug
      };

      const response = await fetch(`${env.API}/currentAffair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(affairData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'No error details available' }));
        throw new Error(`Failed to create current affair: ${errorData.message || response.statusText}`);
      }

      const { data } = await response.json();
      setCurrentAffairs([...currentAffairs, data]);
      setSelectedAffairId(data.id.toString());
      setCreateNewAffair(false);
      showToast('Current affair created successfully!', 'success');
    } catch (error) {
      console.error('Error creating current affair:', error);
      showToast('Failed to create current affair. Please try again.', 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, creatingAffair: false }));
    }
  };

  const handleCreateArticle = async () => {
    try {
      setIsLoading(prev => ({ ...prev, creatingArticle: true }));
      // Validate all required fields
      if (!articleData.title) {
        throw new Error('Title is required');
      }

      if (!articleData.content || articleData.content.length < 10) {
        throw new Error('Content must be at least 10 characters');
      }

      if (!articleData.author) {
        throw new Error('Author is required');
      }

      if (!selectedAffairId) {
        throw new Error('Please select a current affair');
      }

      const selectedAffair = currentAffairs.find(
        affair => affair.id.toString() === selectedAffairId
      );

      if (!selectedAffair) {
        throw new Error('Selected current affair not found');
      }

      // Create slug from title with current-affairs prefix
      const articleBaseSlug = articleData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const articleSlug = `${selectedAffair.slug}/${articleBaseSlug}`;

      const articlePayload = {
        title: articleData.title,
        content: articleData.content,
        author: articleData.author,
        slug: articleSlug,
        parentSlug: selectedAffair.slug
      };

      const response = await fetch(`${env.API}/currentArticle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(articlePayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'No error details available' }));
        throw new Error(`Failed to create article: ${errorData.message || response.statusText}`);
      }

      showToast('Article created successfully!', 'success');
      setStep(1);
      setSelectedType('daily');
      setSelectedAffairId('');
      setCreateNewAffair(false);
      setNewAffairData({
        title: '',
        content: '',
        imageUrl: '',
        type: 'daily'
      });
      setArticleData({
        title: '',
        content: '',
        author: ''
      });
    } catch (error) {
      console.error('Error creating article:', error);
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast('Failed to create article. Please try again.', 'error');
      }
    }
  };

  // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = async () => {
  //       try {
  //         const result = reader.result as string;
  //         setImagePreview(result);
          
  //         // Upload the image to S3
  //         const formData = new FormData();
  //         formData.append("image", file);

  //         const s3Url = await uploadImageToS3(formData);
  //         if (s3Url) {
  //           setNewAffairData(prev => ({ ...prev, imageUrl: s3Url }));
  //         } else {
  //           throw new Error("Failed to upload image to S3");
  //         }
  //       } catch (error) {
  //         console.error("Error uploading image:", error);
  //         setToast({ message: "Failed to upload image", type: "error" });
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Current Affair Type</h3>
              <div className="space-y-4">
                <Select
                  value={selectedType}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger className="w-full border-white text-white focus:border-white focus:ring-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-white">
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    className="bg-slate-800 text-white px-8 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                  >
                    Next: Select Current Affair
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Select or Create Current Affair</h3>
              <div className="space-y-4">
                <Select
                  value={createNewAffair ? 'new' : selectedAffairId}
                  onValueChange={handleAffairChange}
                >
                  <SelectTrigger className="w-full border-slate-200 text-white focus:border-slate-400 focus:ring-slate-400">
                    <SelectValue placeholder="Select a current affair or create new" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Create New Current Affair</SelectItem>
                    {currentAffairs.map((affair) => (
                      <SelectItem key={affair.id} value={affair.id.toString()}>
                        {affair.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {createNewAffair && (
                  <div className="mt-4 space-y-4 p-4 border border-slate-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Title
                      </label>
                      <Input
                        value={newAffairData.title}
                        onChange={(e) => setNewAffairData({ ...newAffairData, title: e.target.value })}
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Image
                      </label>
                      <div className="flex flex-col gap-2">
                        {isLoading.uploadingImage && (
                          <div className="flex items-center justify-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          </div>
                        )}
                        {imagePreview && (
                          <div className="relative w-32 h-32">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={isLoading.uploadingImage}
                          className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {newAffairData.imageUrl && (
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Image URL
                            </label>
                            <Input
                              value={newAffairData.imageUrl}
                              onChange={(e) => setNewAffairData({ ...newAffairData, imageUrl: e.target.value })}
                              placeholder="Enter image URL"
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Content (Optional)
                      </label>
                      <TiptapEditor
                        content={newAffairData.content}
                        onChange={(html) => setNewAffairData({ ...newAffairData, content: html })}
                      />
                    </div>
                    <Button
                      onClick={handleCreateAffair}
                      className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                      disabled={isLoading.creatingAffair}
                    >
                      {isLoading.creatingAffair ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        'Create Current Affair'
                      )}
                    </Button>
                  </div>
                )}

                {!createNewAffair && selectedAffairId && (
                  <div className="mt-6 flex justify-between">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      Back to Type Selection
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="bg-slate-800 text-white px-8 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                    >
                      Next: Create Article
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Create Article</h3>
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Back to Current Affair Selection
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <Input
                    value={articleData.title}
                    onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
                    placeholder="Enter article title"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Content
                  </label>
                  <TiptapEditor
                    content={articleData.content}
                    onChange={(html) => setArticleData({ ...articleData, content: html })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Author
                  </label>
                  <Input
                    value={articleData.author}
                    onChange={(e) => setArticleData({ ...articleData, author: e.target.value })}
                    placeholder="Enter author name"
                    className="w-full"                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleCreateArticle}
                    className="bg-slate-800 text-white px-8 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                    disabled={isLoading.creatingArticle}
                  >
                    {isLoading.creatingArticle ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      'Create Article'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-slate-900 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <p className="text-sm">{toast.message}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-8">
        {[
          { number: 1, title: 'Select Type' },
          { number: 2, title: 'Select Current Affair' },
          { number: 3, title: 'Create Article' },
        ].map((s) => (
          <div key={s.number} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= s.number
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-400 border-slate-200'
              }`}
            >
              {s.number}
            </div>
            <span
              className={`ml-3 text-sm font-medium ${
                step >= s.number ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              {s.title}
            </span>
            {s.number < 3 && (
              <div className="w-24 h-px mx-4 bg-slate-200" />
            )}
          </div>
        ))}
      </div>

      {renderStepContent()}
    </div>
  );
}