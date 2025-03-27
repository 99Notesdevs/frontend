"use client";

import React, { useState, useEffect } from 'react';
import { Page } from '@prisma/client';
import { ArticleForm } from './forms/ArticleForm';
import { GeneralStudiesForm } from './forms/GeneralStudiesForm';
import { UpscNotesForm } from './forms/UPSCNotesForm';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { env } from '@/config/env';
import Cookie from 'js-cookie';

interface TemplateType {
  id: string;
  name: string;
  description: string;
  layout: any;
  createdAt: Date;
  updatedAt: Date;
}

interface PageWithRelations extends Page {
  parent: PageWithRelations | null;
  children: PageWithRelations[];
  data?: any;
}

interface PageFormProps {
  editPage?: PageWithRelations | null;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

interface AboutContent {
  hero: {
    title: string;
    subtitle: string;
  };
  mission: string;
  veterans: TeamMember[];
  coreMembers: TeamMember[];
}

interface GeneralStudiesContent {
  title: string;
  paper: string;
  topic: string;
  subtopic: string;
  content: string;
  importanceLevel: 'low' | 'medium' | 'high';
  previousYearQuestions?: string;
  keyPoints: string;
  sources?: string;
}

interface StudyMaterialContent {
  title: string;
  subject: string;
  content: string;
}

interface PageFormData extends Record<string, any> {
  title?: string;
  hero?: {
    title: string;
    subtitle: string;
  };
  mission?: string;
  veterans?: TeamMember[];
  coreMembers?: TeamMember[];
  paper?: string;
  topic?: string;
  subtopic?: string;
  content?: string;
  subject?: string;
  importanceLevel?: string;
  previousYearQuestions?: string;
  keyPoints?: string;
  sources?: string;
  metadata?: {
    teamSize?: number;
  };
}

export function PageForm({ editPage = null }: PageFormProps) {
  const [pages, setPages] = useState<PageWithRelations[]>([]);
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(Array(7).fill(''));
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Path Selection, 2: Template Selection, 3: Form
  const token = Cookie.get('token');

  useEffect(() => {
    fetchPages();
    fetchTemplates();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch(`${env.API}/page`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch pages');
      const { data } = await response.json();
      
      // Debug: Log the pages data to see level information
      console.log('Pages from API:', data);
      console.log('Pages with level > 1:', data.filter((page: PageWithRelations) => page.level > 1));
      
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError('Failed to load pages');
    }
  };

  const fetchTemplates = async () => {
    try {
      const response =  await fetch(`${env.API}/template`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch templates');
      const { data } = await response.json();
      
      if (!data || data.length === 0) {
        // Default templates if none exist in DB
        const defaultTemplates = [
          {
            id: 'current-affairs',
            name: 'Current Affairs',
            description: 'Template for current affairs articles',
            layout: {},
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'article',
            name: 'Article',
            description: 'Template for general articles',
            layout: {},
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'study-material',
            name: 'Study Material',
            description: 'Template for study materials',
            layout: {},
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'general-studies',
            name: 'General Studies',
            description: 'Template for general studies content',
            layout: {},
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'upsc-notes',
            name: 'UPSC Notes',
            description: 'Template for UPSC preparation notes',
            layout: {},
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'blog',
            name: 'Blog',
            description: 'Template for blog posts',
            layout: {},
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'about',
            name: 'About Page',
            description: 'Template for about pages',
            layout: {},
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        setTemplates(defaultTemplates);
      } else {
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load templates');
    }
  };

  const handleLevelChange = (level: number, value: string) => {
    console.log('Selected parent page:', value);
    const newLevels = [...selectedLevels];
    newLevels[level] = value === '_none' ? '' : value; // Convert _none to empty string
    // Clear all subsequent levels
    for (let i = level + 1; i < newLevels.length; i++) {
      newLevels[i] = '';
    }
    setSelectedLevels(newLevels);
  };

  const getPagesForLevel = (level: number): PageWithRelations[] => {
    // For level 0, return only root pages (no parent)
    if (level === 0) {
      return pages.filter(page => !page.parent);
    }
    
    const parentId = selectedLevels[level - 1];
    if (!parentId) return [];
    
    // Filter by both parent ID and level to prevent duplicate levels
    return pages.filter(page => 
      page.parent?.id === parentId && 
      page.level === level + 1
    );
  };

  const getCurrentLevel = (): number => {
    let level = 0;
    for (let i = 0; i < selectedLevels.length; i++) {
      if (selectedLevels[i]) level = i + 1;
    }
    return level;
  };

  const getSelectedParentId = (): string | null => {
    return selectedLevels.filter(Boolean).pop() || null;
  };

  const handleSubmit = async (formData: PageFormData) => {
    try {
      const parentId = getSelectedParentId();
      const currentTemplate = templates.find((t) => t.id === selectedTemplate);

      if (!currentTemplate) {
        throw new Error("No template selected");
      }

      console.log("Parent ID:", parentId);

      // Generate the full path for the slug
      const fullPath = selectedLevels
        .filter((level) => level)
        .map((level) => {
          // Get the page for this level
          const page = pages.find((p) => p.id === level);
          if (!page) return '';
          
          // Extract just the last segment of the slug, not the full path
          // This prevents duplication of parent paths
          const slugParts = page.slug.split('/');
          return slugParts[slugParts.length - 1];
        })
        .concat(
          (formData.title || formData.hero?.title || "")
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
        )
        .join("/");

      // Calculate the correct level based on the path depth
      // This ensures the level in the database matches the actual path depth
      const pathLevel = selectedLevels.filter(Boolean).length + 1;

      // Create the page data based on template type
      const pageData = {
        title: formData.title || formData.hero?.title,
        slug: fullPath,
        templateId: currentTemplate.id,
        parentId: parentId || null,
        content: processContentByTemplate(currentTemplate.id, formData),
        metadata: {
          lastUpdated: new Date().toISOString(),
          teamSize: 0,
        },
        level: pathLevel, // Use the path depth as the level
        showInNav: true,
        order: 0,
      };

      if (!pageData.title) {
        throw new Error("Title is required");
      }

      // Validate content based on template type
      validateContentByTemplate(currentTemplate.id, pageData.content);

      console.log("Sending page data:", pageData);

      // Prepare data for API submission
      const apiPageData = {
        ...pageData,
        content: JSON.stringify(pageData.content),
        metadata: JSON.stringify(pageData.metadata),
      };

      // Submit to API
      const response = await fetch(`${env.API}/page`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiPageData),
      });

      console.log("API Response Status:", response.status);
      
      const responseData = await response.json().catch(() => ({}));
      console.log("API Response Data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to create page');
      }

      // Reset form and refresh
      setSelectedTemplate("");
      setSelectedLevels(Array(7).fill(""));
      setStep(1);
      await fetchPages();

      // Show success message
      setError(null);
      alert("Page created successfully!");
    } catch (error) {
      console.error('Error creating page:', error);
      setError(error instanceof Error ? error.message : 'Failed to create page');
    }
  };

  // Process content based on template type
  const processContentByTemplate = (templateId: string, formData: PageFormData) => {
    switch (templateId) {
      case "article":
        return {
          title: formData.title || "",
          content: formData.content || "",
          image: formData.image || "",
        };
      
      case "general-studies":
        return {
          title: formData.title || "",
          content: formData.content || "",
          image: formData.image || "",
        };
      
      case "upsc-notes":
        return {
          title: formData.title || "",
          content: formData.content || "",
        };
      
      default:
        return formData;
    }
  };

  // Validate content based on template type
  const validateContentByTemplate = (templateId: string, content: any) => {
    switch (templateId) {
      case "article":
        if (!content.title) throw new Error("Title is required");
        if (!content.content || content.content.length < 10) {
          throw new Error("Content must be at least 10 characters");
        }
        break;
      
      case "general-studies":
        if (!content.title) throw new Error("Title is required");
        if (!content.content || content.content.length < 10) {
          throw new Error("Content must be at least 10 characters");
        }
        break;
      
      case "upsc-notes":
        if (!content.title) throw new Error("Title is required");
        if (!content.content || content.content.length < 10) {
          throw new Error("Content must be at least 10 characters");
        }
        break;
      
      default:
        break;
    }
  };

  const renderTemplateForm = () => {
    const currentTemplate = templates.find(t => t.id === selectedTemplate);
    if (!currentTemplate) {
      console.log('No template selected');
      return null;
    }

    const formProps = {
      onSubmit: handleSubmit,
      defaultValues: editPage?.data || undefined,
    };

    console.log('Rendering template:', currentTemplate.name, 'with ID:', currentTemplate.id);

    // Map template IDs to form components
    const templateForms: Record<string, React.ComponentType<any>> = {
      'article': ArticleForm,
      'general-studies': GeneralStudiesForm,
      'upsc-notes': UpscNotesForm,
    };

    const FormComponent = templateForms[currentTemplate.id];
    if (!FormComponent) {
      console.error('No form component found for template ID:', currentTemplate.id);
      return null;
    }

    return <FormComponent {...formProps} />;
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Page Location</h3>
              <div className="space-y-4">
                {Array.from({ length: getCurrentLevel() + 1 }).map((_, level) => (
                  <div key={level}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Level {level + 1} {level >= 4 && "(Not shown in navbar)"}
                    </label>
                    <Select
                      value={selectedLevels[level]}
                      onValueChange={(value) => handleLevelChange(level, value)}
                    >
                      <SelectTrigger className="w-full border-slate-200 focus:border-slate-400 focus:ring-slate-400">
                        <SelectValue placeholder={level === 0 ? "Select root page" : `Select level ${level + 1} page`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">
                          {level === 0 ? "No parent (Root level)" : `Create as level ${level + 1} page`}
                        </SelectItem>
                        {getPagesForLevel(level).map((page) => (
                          <SelectItem key={page.id} value={page.id}>
                            {page.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-slate-800 text-white px-8 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                >
                  Next: Select Template
                </Button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Template</h3>
              <Select
                value={selectedTemplate || '_none'}
                onValueChange={(value) => {
                  setSelectedTemplate(value === '_none' ? '' : value);
                }}
              >
                <SelectTrigger className="w-full border-slate-200 focus:border-slate-400 focus:ring-slate-400">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Choose a template...</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-6 flex justify-between">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Back to Path Selection
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedTemplate}
                  className="bg-slate-800 text-white px-8 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                >
                  Next: Fill Form
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Fill Page Details</h3>
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Back to Template Selection
                </Button>
              </div>
              {renderTemplateForm()}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        {[
          { number: 1, title: 'Select Path' },
          { number: 2, title: 'Choose Template' },
          { number: 3, title: 'Fill Details' },
        ].map((s) => (
          <div key={s.number} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= s.number
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {s.number}
            </div>
            <span
              className={`ml-2 ${
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {renderStepContent()}
    </div>
  );
}
