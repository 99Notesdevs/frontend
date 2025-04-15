"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GeneralStudiesForm } from '@/components/dashboard/forms';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { env } from '@/config/env';
import Cookie from 'js-cookie';
import {uploadImageToS3} from '@/config/imageUploadS3';
import { CurrentArticleForm, CurrentArticleFormValues } from '@/components/dashboard/forms/CurrentArticleForm';
// Types for CurrentAffair models
interface CurrentAffairType {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  metadata?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonicalUrl?: string;
    schemaData?: string;
  };
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
  quizQuestions?: string;
  metadata?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonicalUrl?: string;
    schemaData?: string;
  };
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
    uploadingImage: false,
    formSubmitting: false
  });
  const [error, setError] = useState<string | null>(null);

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
    type: 'daily',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    robots: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: '',
    twitterCard: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    schemaData: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Step 3: Article creation
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    quizQuestions: '',
    author: 'here',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      robots: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogType: '',
      twitterCard: '',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      canonicalUrl: '',
      schemaData: ''
    
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
          formData.append("imageUrl", file);

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

  const handleImageUpload = async (content: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const imgTags = doc.querySelectorAll("img");
  
      for (const img of imgTags) {
        const src = img.getAttribute("src");
        if (!src) continue;
        console.log("I was here");
        const isBlob = src.startsWith("blob:");
        const isBase64 = src.startsWith("data:image");
  
        if (isBlob || isBase64) {
          try {
            const response = await fetch(src);
            const blob = await response.blob();
  
            const formData = new FormData();
            formData.append("imageUrl", blob, "image.png");
  
            const url = (await uploadImageToS3(formData)) || "error";
            img.setAttribute("src", url);
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error("Error uploading image:", error.message);
            }
            showToast("Failed to upload image. Please try again.", "error");
          }
        }
      }
  
      return doc.body.innerHTML; // ⬅️ Only return after finishing all images
    };

  const handleCreateAffair = async (data: any) => {
    try {
      setError(null);
      setIsLoading(prev => ({ ...prev, creatingAffair: true, formSubmitting: true }));
      
      if (!data.title) {
        throw new Error('Title is required');
      }

      // Create slug from title with current-affairs prefix
      const baseSlug = data.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const slug = `current-affairs/${baseSlug}`;

      // Ensure content is a string (even if empty)
      const content = data.content || '';
      const updatedContent = await handleImageUpload(content);

      const affairData = {
        title: data.title,
        content: updatedContent,
        imageUrl: data.imageUrl,
        type: selectedType, // Use the type selected in step 1
        slug,
        metadata: JSON.stringify({
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          metaKeywords: data.metaKeywords,
          robots: data.robots,
          ogTitle: data.ogTitle,
          ogDescription: data.ogDescription,
          ogImage: data.ogImage,
          ogType: data.ogType,
          twitterCard: data.twitterCard,
          twitterTitle: data.twitterTitle,
          twitterDescription: data.twitterDescription,
          twitterImage: data.twitterImage,
          canonicalUrl: data.canonicalUrl,
          schemaData: data.schemaData
        })
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

      const { data: newAffair } = await response.json();
      setCurrentAffairs([...currentAffairs, newAffair]);
      setSelectedAffairId(newAffair.id.toString());
      setCreateNewAffair(false);
      showToast('Current affair created successfully!', 'success');
    } catch (error) {
      console.error('Error creating current affair:', error);
      setError(error instanceof Error ? error.message : 'Failed to create current affair. Please try again.');
      showToast(error instanceof Error ? error.message : 'Failed to create current affair. Please try again.', 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, creatingAffair: false, formSubmitting: false }));
      setStep(1);
    }
  };

  const handleCreateArticle = async (data: any) => {
    try {
      setError(null);
      setIsLoading(prev => ({ ...prev, creatingArticle: true, formSubmitting: true }));
      
      // Validate all required fields
      if (!data.title) {
        throw new Error('Title is required');
      }

      if (!data.content || data.content.length < 10) {
        throw new Error('Content must be at least 10 characters');
      }

      if (!data.author) {
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
      const articleBaseSlug = data.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const articleSlug = `${selectedAffair.slug}/${articleBaseSlug}`;
      const content = await handleImageUpload(data.content);

      const articlePayload = {
        title: data.title,
        content,
        author: data.author,
        slug: articleSlug,
        parentSlug: selectedAffair.slug,
        quizQuestions: data.quizQuestions,
        type: selectedType, // Use the type selected in step 1
        metadata: JSON.stringify({
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          metaKeywords: data.metaKeywords,
          robots: data.robots,
          ogTitle: data.ogTitle,
          ogDescription: data.ogDescription,
          ogImage: data.ogImage,
          ogType: data.ogType,
          twitterCard: data.twitterCard,
          twitterTitle: data.twitterTitle,
          twitterDescription: data.twitterDescription,
          twitterImage: data.twitterImage,
          canonicalUrl: data.canonicalUrl,
          schemaData: data.schemaData
        })
      };

      const response = await fetch(`${env.API}/currentArticle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articlePayload)
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

     
    } catch (error) {
      console.error('Error creating article:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setToast({ message: 'Failed to create article', type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, creatingArticle: false, formSubmitting: false }));
      setStep(1);
    }
  };

  const renderStepContent = () => {
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          <p>{error}</p>
        </div>
      );
    }

    if (isLoading.formSubmitting) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

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
                    <GeneralStudiesForm
                      defaultValues={newAffairData}
                      onSubmit={handleCreateAffair}
                    />
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
                <CurrentArticleForm
                  defaultValues={articleData}
                  onSubmit={handleCreateArticle}
                />
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