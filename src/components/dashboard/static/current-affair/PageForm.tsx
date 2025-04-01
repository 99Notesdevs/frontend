"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import TiptapEditor  from '@/components/ui/tiptapeditor';
import { env } from '@/config/env';
import Cookie from 'js-cookie';

// Types for CurrentAffair models
interface CurrentAffairType {
  id: number;
  title: string;
  content: string;
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
    type: 'daily'
  });
  
  // Step 3: Article creation
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    author: ''
  });
  
  const token = Cookie.get('token');

  // Fetch current affairs based on selected type
  useEffect(() => {
    if (selectedType) {
      fetchCurrentAffairsByType(selectedType);
    }
  }, [selectedType]);

  const fetchCurrentAffairsByType = async (type: string) => {
    try {
      const token = Cookie.get('token');
      console.log('Fetching current affairs for type:', type);
      console.log('API URL:', `${env.API}/currentAffair/type/${type}`);
      console.log('Token:', token ? 'Present' : 'Not present');

      const response = await fetch(`${env.API}/currentAffair/type/${type}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'No error details available' }));
        throw new Error(`Failed to fetch current affairs: ${errorData.message || response.statusText}`);
      }
      
      const { data } = await response.json();
      console.log(`Current Affairs (${type}) from API:`, data);
      setCurrentAffairs(data || []);
    } catch (error) {
      console.error('Detailed error fetching current affairs:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
        type: error instanceof Error ? error.constructor.name : typeof error
      });

      if (error instanceof Error) {
        if (error.name === 'TypeError') {
          setError('Network error: Could not connect to the server. Please check your internet connection.');
        } else {
          setError('Failed to load current affairs. Please check your network connection and try again.');
        }
      } else {
        setError('Failed to load current affairs. Please check your network connection and try again.');
      }
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

  const handleCreateAffair = async () => {
    try {
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
        type: newAffairData.type,
        slug
      };

      console.log('Creating current affair with data:', affairData);

      const response = await fetch(`${env.API}/currentAffair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(affairData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create current affair');
      }

      const { data } = await response.json();
      setCurrentAffairs([...currentAffairs, data]);
      setSelectedAffairId(data.id.toString());
      setCreateNewAffair(false);
      setStep(3);
    } catch (error) {
      console.error('Error creating current affair:', error);
      setError(error instanceof Error ? error.message : 'Failed to create current affair');
    }
  };

  const handleCreateArticle = async () => {
    try {
      if (!articleData.title) {
        throw new Error('Title is required');
      }

      if (!articleData.content || articleData.content.length < 10) {
        throw new Error('Content must be at least 10 characters');
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
      const articleSlug = `current-affairs/${selectedAffair.slug}/${articleBaseSlug}`;

      const articlePayload = {
        title: articleData.title,
        content: articleData.content,
        author: articleData.author || 'Anonymous',
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create article');
      }

      // Reset form
      setArticleData({
        title: '',
        content: '',
        author: ''
      });
      setSelectedAffairId('');
      setSelectedType('daily');
      setStep(1);

      // Show success message
      setError(null);
      alert('Article created successfully!');
    } catch (error) {
      console.error('Error creating article:', error);
      setError(error instanceof Error ? error.message : 'Failed to create article');
    }
  };

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
                  <SelectTrigger className="w-full border-slate-200 focus:border-slate-400 focus:ring-slate-400">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
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
                  <SelectTrigger className="w-full border-slate-200 focus:border-slate-400 focus:ring-slate-400">
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
                        placeholder="Enter current affair title"
                        className="w-full"
                      />
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
                    >
                      Create Current Affair
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
                    className="w-full"
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleCreateArticle}
                    className="bg-slate-800 text-white px-8 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                  >
                    Create Article
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {renderStepContent()}
    </div>
  );
}
