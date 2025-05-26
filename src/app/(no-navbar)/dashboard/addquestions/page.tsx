"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/config/env";
import Cookies from "js-cookie";
import CategorySelect from "@/components/testUtils/CategorySelect";
import TiptapEditor from "@/components/ui/tiptapeditor";
import { uploadImageToS3 } from "@/config/imageUploadS3";
interface Category {
  id: number;
  name: string;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  options: string[];
  categoryId: number;
  explaination: string;
  creatorName: string;
  multipleCorrectType: boolean;
  pyq: boolean;
  year: number | null;
  acceptance: number | null;
}

import { useRef } from "react";

export default function AddQuestionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [creatorName, setCreatorName] = useState<string>("");
  // At the top of your component with other hooks
const formRef = useRef<HTMLDivElement>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    
    id: "",
    question: "",
    answer: "",
    options: [] as string[],
    categoryId: 0,
    explaination: "",
    creatorName: "",
    multipleCorrectType: false,
    pyq: false,
    year: null,
    acceptance: null
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    questionId: string | null;
  }>({ isOpen: false, questionId: null });

  // Fetch questions for selected category
  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchQuestions = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(
          `${env.API_TEST}/questions/?categoryId=${selectedCategory}&limit=${pageSize}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch questions");
        const { data } = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [selectedCategory, page]);

  // Fetch user name
  useEffect(() => {
    const fetchUserName = async () => {
      const token = Cookies.get("token");
      const admin = await fetch(`${env.API}/admin/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (admin) {
        const adminData = await admin.json();
        setNewQuestion((prev) => ({
          ...prev,
          creatorName: adminData.data.email || "",
        }));
        setCreatorName(adminData.data.email || "");
      }
    };
    fetchUserName();
  }, []);
  // Handle image uploads in content
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
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error uploading image:", error.message);
          }
          setToast({ message: "Failed to upload image. Please try again.", type: "error" });
        }
      }
    }

    return doc.body.innerHTML;
  };
  const handleCreateQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Process all rich text fields for images
      const processedQuestion = await handleImageUpload(newQuestion.question);
      const processedOptions = await Promise.all(
        newQuestion.options.map(option => handleImageUpload(option))
      );
      const processedExplanation = await handleImageUpload(newQuestion.explaination);
  
      const answer = newQuestion.multipleCorrectType 
        ? newQuestion.answer.split(',').map(num => parseInt(num) - 1).join(',')
        : (parseInt(newQuestion.answer) - 1).toString();
      
      const response = await fetch(`${env.API_TEST}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          ...newQuestion,
          question: processedQuestion,
          options: processedOptions,
          explaination: processedExplanation,
          answer,
          categoryId: selectedCategory,
          multipleCorrectType: newQuestion.multipleCorrectType
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create question");
      }
      
      const createdQuestion = await response.json();
      
      // Update the questions list with the new question
      setQuestions(prevQuestions => [createdQuestion.data, ...prevQuestions]);
      
      // Show success message
      setToast({ message: "Question added successfully!", type: "success" });
  
      // Reset form
      setNewQuestion({
        id: "",
        question: "",
        answer: "",
        options: [],
        categoryId: selectedCategory || 0,
        explaination: "",
        creatorName: creatorName || "",
        multipleCorrectType: false,
        pyq: false,
        year: null,
        acceptance: null
      });
      
      // Scroll to the top of the questions list
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      
    } catch (error) {
      console.error("Error creating question:", error);
      setToast({
        message: error instanceof Error ? error.message : "Failed to add question. Please try again.",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditQuestion = async (question: Question) => {
    try {
      // Process all rich text fields for images
      const processedQuestion = await handleImageUpload(question.question);
      const processedOptions = await Promise.all(
        question.options.map(option => handleImageUpload(option))
      );
      const processedExplanation = await handleImageUpload(question.explaination);
  
      setEditingQuestion(question);
      setNewQuestion({
        ...question,
        question: processedQuestion,
        options: processedOptions,
        explaination: processedExplanation,
        categoryId: question.categoryId,
        multipleCorrectType: question.multipleCorrectType
      });
      
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error processing question data:", error);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!deleteConfirmation.questionId) return;
    
    try {
      const response = await fetch(`${env.API_TEST}/questions/${deleteConfirmation.questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete question');

      // Remove the question from the local state
      setQuestions(prev => prev.filter(q => q.id !== deleteConfirmation.questionId));
      
      // Close the confirmation dialog
      setDeleteConfirmation({ isOpen: false, questionId: null });
      
      // Show success message
      alert('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
      setDeleteConfirmation({ isOpen: false, questionId: null });
    }
  };

  const handleUpdateQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingQuestion) return;

    try {
      const token = Cookies.get("token");
      const answer = newQuestion.multipleCorrectType 
        ? newQuestion.answer.split(',').map(num => parseInt(num) - 1).join(',')
        : (parseInt(newQuestion.answer) - 1).toString();
      
      const response = await fetch(
        `${env.API_TEST}/questions/${editingQuestion.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...newQuestion,
            answer,
            creatorName: creatorName || "",
            multipleCorrectType: newQuestion.multipleCorrectType
          }),
        }
      );
      console.log("creatorName", creatorName);
      if (!response.ok) throw new Error("Failed to update question");

      // Update the question in the list
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === editingQuestion.id ? newQuestion : q
        )
      );

      // Reset editing state
      setEditingQuestion(null);
      setNewQuestion({
        id: "",
        question: "",
        answer: "",
        options: [],
        categoryId: selectedCategory || 0,
        explaination: "",
        creatorName: creatorName || "",
        multipleCorrectType: false,
        pyq: false,
        year: null,
        acceptance: null
      });
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setNewQuestion({
      id: "",
      question: "",
      answer: "",
      options: [],
      categoryId: selectedCategory || 0,
      explaination: "",
      creatorName: "",
      multipleCorrectType: false,
      pyq: false,
      year: null,
      acceptance: null
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 px-2 md:px-6 flex flex-col items-center relative">
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
            toast.type === 'success' ? 'bg-slate-500' : 'bg-red-500'
          } transition-opacity duration-300`}
        >
          {toast.message}
        </div>
      )}
      <style jsx global>{`
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
      `}</style>
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center [color:var(--admin-bg-dark)] drop-shadow-sm tracking-tight">
          Add & Manage Questions
        </h1>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-14 space-y-10 scale-105 mx-auto mt-20">
          {/* Category Selection */}
          <CategorySelect
            selectedCategoryId={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Question Form */}
          <div ref={formRef}>
            <h2 className="text-xl font-bold [color:var(--admin-bg-dark)] mb-4">
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </h2>
            <form
              onSubmit={
                editingQuestion ? handleUpdateQuestion : handleCreateQuestion
              }
            >
              <div className="space-y-6">
                <div>
                  <label className="block mb-1 [color:var(--admin-bg-dark)] font-semibold">
                    Question
                  </label>
                  <div className="tiptap-editor-container custom-tiptap-editor">
                    <TiptapEditor
                      content={newQuestion.question}
                      onChange={(content) =>
                        setNewQuestion({ ...newQuestion, question: content })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block [color:var(--admin-bg-dark)] font-semibold">
                    Options
                  </label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-sm border border-gray-300">
                        {index + 1}
                      </span>
                      <div className="tiptap-editor-container flex-1">
                        <TiptapEditor
                          content={option}
                          onChange={(content) => 
                            setNewQuestion({ ...newQuestion, options: newQuestion.options.map((_, i) => i === index ? content : _) })
                          }
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded"
                        onClick={(e) => {
                          e.preventDefault();
                          setNewQuestion({
                            ...newQuestion,
                            options: newQuestion.options.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-1 rounded bg-slate-300 hover:bg-slate-400"
                    onClick={() =>
                      setNewQuestion({
                        ...newQuestion,
                        options: [...newQuestion.options, ""],
                      })
                    }
                  >
                    Add Option
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newQuestion.multipleCorrectType}
                      onChange={(e) => {
                        setNewQuestion({
                          ...newQuestion,
                          multipleCorrectType: e.target.checked
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Allow multiple correct answers
                    </label>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Answer</label>
                    <Input
                      className="bg-white text-[#1e293b] border border-gray-200 placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                      type="text"
                      placeholder={newQuestion.multipleCorrectType 
                        ? "Enter comma-separated answer numbers (e.g., 1,3,4)"
                        : "Enter answer number"}
                      value={newQuestion.answer}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewQuestion({
                          ...newQuestion,
                          answer: value
                        });
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {newQuestion.multipleCorrectType
                        ? "Enter comma-separated numbers for multiple correct answers (e.g., 1,3,4)"
                        : "Enter the number that corresponds to the correct answer"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className=" border border-slate-300 rounded-xl p-4 mb-2 shadow-sm">
                    <label
                      htmlFor="explanation"
                      className="flex items-center gap-2 text-base font-semibold text-slate-700 mb-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1 4v-4m0 0V9a4 4 0 10-8 0v1a4 4 0 004 4h1m4 0h1a4 4 0 004-4v-1a4 4 0 00-8 0v1a4 4 0 004 4z"
                        />
                      </svg>
                      Explanation
                    </label>
                    <div className="tiptap-editor-container">
                      <TiptapEditor
                        content={newQuestion.explaination}
                        onChange={(content) =>
                          setNewQuestion({
                            ...newQuestion,
                            explaination: content,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="creatorName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Created By
                    </label>
                    <input
                      type="text"
                      id="creatorName"
                      value={newQuestion.creatorName}
                      readOnly
                      className="mt-1 block w-full shadow-sm sm:text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="pyq"
                        checked={newQuestion.pyq}
                        onChange={(e) =>
                          setNewQuestion({ ...newQuestion, pyq: e.target.checked })
                        }
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
                      />
                    </div>
                    <label htmlFor="pyq" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                      Previous Year Question (PYQ)
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="year"
                        value={newQuestion.year || ''}
                        onChange={(e) =>
                          setNewQuestion({ ...newQuestion, year: e.target.value ? parseInt(e.target.value) : null })
                        }
                        className="block w-full rounded-md border-gray-300 pl-4 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                        placeholder="e.g., 2023"
                        min="1900"
                        max="2100"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Between 1900-2100</p>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="acceptance" className="block text-sm font-medium text-gray-700">
                      Acceptance Rate
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="acceptance"
                        value={newQuestion.acceptance || ''}
                        onChange={(e) =>
                          setNewQuestion({ ...newQuestion, acceptance: e.target.value ? parseInt(e.target.value) : null })
                        }
                        className="block w-full rounded-md border-gray-300 pl-4 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                        placeholder="e.g., 75"
                        min="0"
                        max="100"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">0-100%</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="submit"
                    className="px-6 py-2 text-base font-semibold rounded bg-slate-600 hover:bg-slate-700 text-white transition"
                  >
                    {editingQuestion ? "Update Question" : "Add Question"}
                  </Button>
                  {editingQuestion && (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Questions List */}
          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-4">Questions</h2>
            <div className="space-y-4">
              {questions.length === 0 ? (
                <p className="text-center text-gray-500 ">
                  No questions found for this category.
                </p>
              ) : (
                questions.map((question) => (
                  <div
                    key={question.id}
                    className="flex flex-col md:flex-row justify-between gap-4 p-6 border rounded-xl bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <div 
                          className="text-[#0f172a] text-base leading-relaxed [&_table]:border [&_table]:border-gray-200 [&_table]:rounded [&_table]:overflow-hidden [&_table]:w-full [&_td]:p-3 [&_th]:p-3 [&_th]:bg-gray-50 [&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-gray-100"
                          dangerouslySetInnerHTML={{ __html: question.question }}
                        />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="mt-3">
                          <div className="text-xs font-medium text-gray-500 mb-1">Options:</div>
                          <div className="flex flex-wrap gap-2">
                            {question.options.map((opt, idx) => (
                              <div 
                                key={idx}
                                className="px-3 py-1.5 rounded-md bg-gray-50 text-[#0f172a] text-sm border border-gray-200 max-w-full overflow-hidden"
                                title={opt.replace(/<[^>]*>?/gm, '')}
                                dangerouslySetInnerHTML={{ __html: opt }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100 mb-2">
                        <p className="text-sm text-green-700 font-medium">
                          Answer:{" "}
                          <span className="font-semibold">
                            {question.answer}
                          </span>
                        </p>
                      </div>
                      {question.pyq && question.year && (
                          <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                            <p className="text-sm text-blue-700 font-medium">
                              PYQ Year:{" "}
                              <span className="font-semibold">
                                {question.year}
                              </span>
                            </p>
                          </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleEditQuestion(question)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded bg-red-600 hover:bg-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmation({ isOpen: true, questionId: question.id });
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
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

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="flex items-center">
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
