"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultiCategorySelect from "@/components/testUtils/MultiCategorySelect";
import { api } from "@/config/api/route";
import { env } from "@/config/env";
import TiptapEditor from "@/components/ui/tiptapeditor";
import { uploadImageToS3 } from "@/config/imageUploadS3";

interface Category {
  id: number;
  name: string;
  parentTagId?: number | null;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  options: string[];
  categoryIds: number[];
  categoryId?: number;
  categories?: Category[];
  explaination: string;
  creatorName: string;
  multipleCorrectType: boolean;
  pyq: boolean;
  year: number | null;
  rating: number | null;
}

export default function EditQuestionPage() {
  const editFormRef = useRef<HTMLDivElement>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [editingCategoryIds, setEditingCategoryIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    questionId: string | null;
  }>({ isOpen: false, questionId: null });

  const normalizeCategoryIds = (question: Pick<Question, "categoryIds" | "categoryId">) => {
    if (Array.isArray(question.categoryIds)) return question.categoryIds;
    return typeof question.categoryId === "number" ? [question.categoryId] : [];
  };

  const toStoredAnswer = (answer: string, isMultiple: boolean) => {
    if (isMultiple) {
      return answer
        .split(",")
        .map((num) => parseInt(num.trim(), 10) - 1)
        .filter((num) => !Number.isNaN(num))
        .join(",");
    }

    const parsedAnswer = parseInt(answer, 10);
    return Number.isNaN(parsedAnswer) ? "" : (parsedAnswer - 1).toString();
  };

  const toInputAnswer = (answer: string, isMultiple: boolean) => {
    if (isMultiple) {
      return answer
        .split(",")
        .map((num) => {
          const parsed = parseInt(num.trim(), 10);
          return Number.isNaN(parsed) ? "" : (parsed + 1).toString();
        })
        .filter(Boolean)
        .join(",");
    }

    const parsedAnswer = parseInt(answer, 10);
    return Number.isNaN(parsedAnswer) ? "" : (parsedAnswer + 1).toString();
  };

  // Auto-hide toast after 3 seconds.
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${env.API_TEST}/categories`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const result = await response.json();
        const { data } = result;
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch questions for selected category
  useEffect(() => {
    if (selectedCategoryIds.length === 0) {
      setQuestions([]);
      return;
    }

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${env.API_TEST}/questions/?categoryIds=${selectedCategoryIds.join(",")}&limit=${pageSize}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Type": "Admin"
          }
        });
        const typedResponse = await response.json();
        
        if (!typedResponse.success) throw new Error("Failed to fetch questions");
        const { data } = typedResponse;
        const normalizedQuestions = (data as Question[]).map((question) => ({
          ...question,
          categoryIds: normalizeCategoryIds(question),
        }));
        setQuestions(normalizedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCategoryIds, pageSize]);

  const handleImageUpload = async (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const imgTags = doc.querySelectorAll("img");

    for (const img of imgTags) {
      const src = img.getAttribute("src");
      if (!src) continue;

      const isBlob = src.startsWith("blob:");
      const isBase64 = src.startsWith("data:image");

      if (isBlob || isBase64) {
        try {
          const response = await fetch(src);
          const blob = await response.blob();

          const formData = new FormData();
          formData.append("imageUrl", blob, "image.png");

          const url = (await uploadImageToS3(formData, "ContentImages")) || "error";
          img.setAttribute("src", url);
        } catch (error) {
          console.error("Error uploading image:", error);
          setToast({ message: "Failed to upload an image.", type: "error" });
        }
      }
    }

    return doc.body.innerHTML;
  };

  const handleDeleteQuestion = async () => {
    if (!deleteConfirmation.questionId) return;
    
    try {
      const response = await fetch(`${env.API_TEST}/questions/${deleteConfirmation.questionId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Type": "Admin"
        }
      });
      const typedResponse = await response.json();
      if (!typedResponse.success) throw new Error('Failed to delete question');

      // Remove the question from the local state
      setQuestions(prev => prev.filter(q => q.id !== deleteConfirmation.questionId));
      
      // Close the confirmation dialog
      setDeleteConfirmation({ isOpen: false, questionId: null });

      setToast({ message: "Question deleted successfully", type: "success" });
    } catch (error) {
      console.error('Error deleting question:', error);
      setToast({ message: "Failed to delete question", type: "error" });
      setDeleteConfirmation({ isOpen: false, questionId: null });
    }
  };

  const handleEditQuestion = (question: Question) => {
    const categoryIds = normalizeCategoryIds(question);
    setEditingCategoryIds(categoryIds);
    setEditingQuestion({
      ...question,
      categoryIds,
      answer: toInputAnswer(question.answer, question.multipleCorrectType),
    });
    
    // Scroll to edit form using ref
    setTimeout(() => {
      if (editFormRef.current) {
        editFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback to window scroll
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }, 100);
  };

  const getQuestionCategories = (question: Question | null) => {
    if (!question) return [];
    
    // If the question has categories array with names, use that
    if (question.categories && Array.isArray(question.categories)) {
      return question.categories;
    }
    
    // Otherwise, map categoryIds to category names from the global categories list
    if (question.categoryIds && Array.isArray(question.categoryIds)) {
      return question.categoryIds.map(id => {
        const category = categories.find(cat => cat.id === id);
        return category || { id, name: `Category ${id}` };
      });
    }
    
    return [];
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditingCategoryIds([]);
  };

  const handleUpdateQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingQuestion || isSaving) return;

    if (editingCategoryIds.length === 0) {
      setToast({ message: "Please select at least one category.", type: "error" });
      return;
    }

    setIsSaving(true);
    try {
      const processedQuestion = await handleImageUpload(editingQuestion.question);
      const processedOptions = await Promise.all(
        editingQuestion.options.map((option) => handleImageUpload(option))
      );
      const processedExplanation = await handleImageUpload(editingQuestion.explaination);
      const storedAnswer = toStoredAnswer(editingQuestion.answer, editingQuestion.multipleCorrectType);

      const payload: Question = {
        ...editingQuestion,
        question: processedQuestion,
        options: processedOptions,
        explaination: processedExplanation,
        answer: storedAnswer,
        categoryIds: editingCategoryIds,
      };

      const response = await fetch(`${env.API_TEST}/questions/${editingQuestion.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Type": "Admin"
        },
        body: JSON.stringify(payload)
      });
      const typedResponse = await response.json();

      if (!typedResponse.success) throw new Error("Failed to update question");

      const updatedFromApi = (typedResponse.data ?? payload) as Question;
      const normalizedUpdated = {
        ...updatedFromApi,
        categoryIds: normalizeCategoryIds(updatedFromApi),
      };

      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === editingQuestion.id ? normalizedUpdated : question
        )
      );

      setEditingQuestion(null);
      setEditingCategoryIds([]);
      setToast({ message: "Question updated successfully", type: "success" });
    } catch (error) {
      console.error("Error updating question:", error);
      setToast({ message: "Failed to update question", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 py-12 px-4 md:px-8 flex flex-col items-center">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
            toast.type === "success" ? "bg-slate-500" : "bg-red-500"
          } transition-opacity duration-300`}
        >
          {toast.message}
        </div>
      )}
      <style>{`
        .question-content {
          max-height: 150px;
          overflow-y: auto;
        }
        .tiptap-editor-container {
          max-height: 250px;
          min-height: 100px;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          padding: 0.5rem;
          background: white;
        }
        .tiptap-editor-container .ProseMirror {
          outline: none;
          min-height: 100%;
        }
        .tiptap-editor-container .ProseMirror > * + * {
          margin-top: 0.75em;
        }
        .question-content table {
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          overflow: hidden;
          width: 100%;
        }
        .question-content td,
        .question-content th {
          padding: 0.5rem;
        }
        .question-content th {
          background-color: #f9fafb;
        }
        .question-content tr:not(:last-child) {
          border-bottom: 1px solid #f3f4f6;
        }
      `}</style>
      
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center text-gray-900 drop-shadow-sm tracking-tight mb-8">
          Edit & Delete Questions
        </h1>
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Category Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Select Categories</h2>
            <MultiCategorySelect
              selectedCategoryIds={selectedCategoryIds}
              onCategoryChange={setSelectedCategoryIds}
            />
          </div>

        {editingQuestion && (
          <div ref={editFormRef} className="mb-10 p-6 rounded-xl border border-indigo-200 bg-indigo-50/40">
            {/* Question Categories Display */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Question categories</h3>
              <div className="p-3 bg-gray-50 rounded border border-gray-300 min-h-[60px]">
                {(() => {
                  const questionCategories = getQuestionCategories(editingQuestion);
                  return questionCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {questionCategories.map((category) => (
                        <span
                          key={category.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No categories selected</p>
                  );
                })()}
              </div>
            </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Question</h2>
              <form onSubmit={handleUpdateQuestion}>
                <div className="space-y-6">
                  <div>
                    <label className="block mb-1 font-semibold text-gray-800">Question</label>
                    <div className="tiptap-editor-container">
                      <TiptapEditor
                        content={editingQuestion.question}
                        onChange={(content) =>
                          setEditingQuestion((prev) => (prev ? { ...prev, question: content } : prev))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block font-semibold text-gray-800">Options</label>
                    {editingQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-sm border border-gray-300">
                          {index + 1}
                        </span>
                        <div className="tiptap-editor-container flex-1">
                          <TiptapEditor
                            content={option}
                            onChange={(content) =>
                              setEditingQuestion((prev) => {
                                if (!prev) return prev;
                                return {
                                  ...prev,
                                  options: prev.options.map((opt, idx) => (idx === index ? content : opt)),
                                };
                              })
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setEditingQuestion((prev) => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                options: prev.options.filter((_, idx) => idx !== index),
                              };
                            })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setEditingQuestion((prev) =>
                          prev ? { ...prev, options: [...prev.options, ""] } : prev
                        )
                      }
                    >
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingQuestion.multipleCorrectType}
                        onChange={(event) =>
                          setEditingQuestion((prev) =>
                            prev
                              ? { ...prev, multipleCorrectType: event.target.checked }
                              : prev
                          )
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Allow multiple correct answers
                      </label>
                    </div>

                    <div>
                      <label className="block mb-1 font-semibold text-gray-800">Answer</label>
                      <Input
                        type="text"
                        value={editingQuestion.answer}
                        onChange={(event) =>
                          setEditingQuestion((prev) =>
                            prev ? { ...prev, answer: event.target.value } : prev
                          )
                        }
                        placeholder={
                          editingQuestion.multipleCorrectType
                            ? "Enter comma-separated answer numbers (e.g., 1,3,4)"
                            : "Enter answer number"
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-gray-800">Categories</label>
                    <MultiCategorySelect
                      selectedCategoryIds={editingCategoryIds}
                      onCategoryChange={setEditingCategoryIds}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-gray-800">Explanation</label>
                    <div className="tiptap-editor-container">
                      <TiptapEditor
                        content={editingQuestion.explaination}
                        onChange={(content) =>
                          setEditingQuestion((prev) =>
                            prev ? { ...prev, explaination: content } : prev
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={editingQuestion.pyq}
                        onChange={(event) =>
                          setEditingQuestion((prev) =>
                            prev ? { ...prev, pyq: event.target.checked } : prev
                          )
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Previous Year Question (PYQ)
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <Input
                        type="number"
                        value={editingQuestion.year ?? ""}
                        onChange={(event) =>
                          setEditingQuestion((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  year: event.target.value ? parseInt(event.target.value, 10) : null,
                                }
                              : prev
                          )
                        }
                        min="1900"
                        max="2100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <Input
                        type="number"
                        value={editingQuestion.rating ?? ""}
                        onChange={(event) =>
                          setEditingQuestion((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  rating: event.target.value ? parseInt(event.target.value, 10) : null,
                                }
                              : prev
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">Loading questions...</p>
            </div>
          )}

          {/* No Category Selected */}
          {selectedCategoryIds.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Please select at least one category to view questions</p>
            </div>
          )}

          {/* Questions List */}
          {selectedCategoryIds.length > 0 && !loading && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Questions {questions.length > 0 && `(${questions.length})`}
              </h2>
              
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No questions found for this category</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          {/* Question Content */}
                          <div className="flex-1 min-w-0 space-y-4">
                            {/* Question Text */}
                            <div>
                              <h3 className="text-sm font-semibold text-gray-700 mb-2">Question:</h3>
                              <div 
                                className="question-content text-sm text-gray-800 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: question.question }}
                              />
                            </div>

                            {/* Options */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Options:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {question.options.map((opt, idx) => (
                                  <div 
                                    key={idx}
                                    className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200"
                                  >
                                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-xs">
                                      {idx + 1}
                                    </span>
                                    <div 
                                      className="text-xs text-gray-700 leading-relaxed"
                                      dangerouslySetInnerHTML={{ __html: opt }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Answer and Metadata */}
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded border border-green-100">
                                Answer: {toInputAnswer(question.answer, question.multipleCorrectType)}
                              </div>
                              {question.pyq && question.year && (
                                <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded border border-blue-100">
                                  PYQ: {question.year}
                                </div>
                              )}
                              {question.rating && (
                                <div className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-medium rounded border border-yellow-100">
                                  Rating: {question.rating}
                                </div>
                              )}
                              {question.multipleCorrectType && (
                                <div className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded border border-purple-100">
                                  Multiple Correct
                                </div>
                              )}
                            </div>

                            {/* Explanation */}
                            {question.explaination && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Explanation:</h4>
                                <div 
                                  className="question-content text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border border-gray-200"
                                  dangerouslySetInnerHTML={{ __html: question.explaination }}
                                />
                              </div>
                            )}

                            {/* Creator Info */}
                            <div className="text-xs text-gray-500">
                              Created by: {question.creatorName}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
                              onClick={() => handleEditQuestion(question)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm"
                              onClick={() => setDeleteConfirmation({ isOpen: true, questionId: question.id })}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Question</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this question? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmation({ isOpen: false, questionId: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteQuestion}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}