"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { env } from "@/config/env";
import Cookies from "js-cookie";

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
}

import { useRef } from "react";

export default function AddQuestionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [creatorName, setCreatorName] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: "",
    question: "",
    answer: "",
    options: [] as string[],
    categoryId: 0,
    explaination: "",
    creatorName: ""
  });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get('token');
        const response = await fetch(`${env.API_TEST}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const { data } = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch questions for selected category
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchQuestions = async () => {
      try {
        const token = Cookies.get('token');
        const response = await fetch(`${env.API_TEST}/questions/practice?categoryIds=${selectedCategory}&limit=${pageSize}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
      const token = Cookies.get('token');
      const admin = await fetch(`${env.API}/admin/`, {
        method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      if (admin) {
        const adminData = await admin.json();
        setNewQuestion(prev => ({
          ...prev,
          creatorName: adminData.data.email || ''
        }));
        setCreatorName(adminData.data.email || '');
      }
    };
    fetchUserName();
  }, []);

  const handleCreateQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(newQuestion);
      const response = await fetch(`${env.API_TEST}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          ...newQuestion,
          categoryId: selectedCategory
        }),
      });
      
      if (!response.ok) throw new Error("Failed to create question");
      
      // Reset form and fetch updated questions
      setNewQuestion({ 
        id: "", 
        question: "", 
        answer: "", 
        options: [], 
        categoryId: selectedCategory || 0,
        explaination: "",
        creatorName: ""
      });
      setPage(1);
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const formRef = useRef<HTMLDivElement>(null);

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion({
      ...question,
      categoryId: question.categoryId
    });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const response = await fetch(`${env.API_TEST}/questions/${questionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to delete question");
      
      // Remove deleted question from the list
      setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
      setShowDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting question:", error);
      setShowDeleteConfirmation(null);
    }
  };

  const handleUpdateQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingQuestion) return;

    try {
      const token = Cookies.get('token');
      const response = await fetch(`${env.API_TEST}/questions/${editingQuestion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newQuestion,
          creatorName: creatorName || ''
        }),
      });
      console.log("creatorName", creatorName);
      if (!response.ok) throw new Error("Failed to update question");
      
      // Update the question in the list
      setQuestions(prevQuestions => 
        prevQuestions.map(q => q.id === editingQuestion.id ? newQuestion : q)
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
        creatorName: creatorName || ''
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
      creatorName: ""
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0e7ef] py-10 px-2 md:px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center [color:var(--admin-bg-dark)] mb-10 drop-shadow-sm tracking-tight">Add & Manage Questions</h1>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-14 space-y-10 scale-105 mx-auto mt-5">
          {/* Category Selection */}
          <div>
            <label className="block mb-2 text-lg font-bold [color:var(--admin-bg-dark)]">Select Category</label>
            <Select
              value={selectedCategory?.toString()}
              onValueChange={(value) => {
                setSelectedCategory(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full bg-white text-white border border-gray-300 font-medium shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition mb-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="z-50  border border-gray-700 shadow-2xl rounded-lg mt-1 min-w-[200px]">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()} className="text-white px-4 py-2 hover:bg-[#2d323c] cursor-pointer rounded">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question Form */}
          <div ref={formRef}>
            <h2 className="text-xl font-bold [color:var(--admin-bg-dark)] mb-4">{editingQuestion ? "Edit Question" : "Add New Question"}</h2>
            <form onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}>
              <div className="space-y-6">
                <div>
                  <label className="block mb-1 [color:var(--admin-bg-dark)] font-semibold">Question</label>
                  <Input
                    className="bg-white  text-[#1e293b]  border border-gray-200  placeholder:text-gray-400  shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    placeholder="Enter question"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block [color:var(--admin-bg-dark)] font-semibold">Options</label>
                  {newQuestion.options.map((option, index) => (
  <div key={index} className="flex gap-2 items-center">
    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-sm border border-gray-300">
      {index + 1}
    </span>
    <Input
      className="bg-white text-[#1e293b] border border-gray-200 placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
      value={option}
      onChange={(e) => {
        const newOptions = [...newQuestion.options];
        newOptions[index] = e.target.value;
        setNewQuestion({ ...newQuestion, options: newOptions });
      }}
    />
    <Button
      variant="destructive"
      size="sm"
      className="rounded"
      onClick={(e) => {
        e.preventDefault();
        setNewQuestion({
          ...newQuestion,
          options: newQuestion.options.filter((_, i) => i !== index)
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
                        options: [...newQuestion.options, ""]
                      })
                    }
                  >
                    Add Option
                  </Button>
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Answer</label>
                  <Select
                    value={newQuestion.answer}
                    onValueChange={(value) => setNewQuestion({ ...newQuestion, answer: value })}
                    required={newQuestion.options.length >= 4}
                  >
                    <SelectTrigger className="w-full bg-white text-white border border-gray-200 font-medium shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition mb-3">
                      <SelectValue placeholder="Select correct option" />
                    </SelectTrigger>
                    <SelectContent className="z-50 border border-gray-700 shadow-2xl bg-white  rounded-lg mt-1 min-w-[200px]">
  <div className="flex flex-row gap-2 px-2 py-2">
    {newQuestion.options.map((_, idx) => (
      <SelectItem
        key={idx}
        value={idx.toString()}
        className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-lg font-bold bg-white text-[var(--admin-bg-dark)] cursor-pointer transition-all data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
        style={{ minWidth: '2.5rem', minHeight: '2.5rem', padding: 0 }}
      >
        {idx+1}
      </SelectItem>
    ))}
  </div>
</SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <div className=" border border-slate-300 rounded-xl p-4 mb-2 shadow-sm">
  <label htmlFor="explanation" className="flex items-center gap-2 text-base font-semibold text-slate-700 mb-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1 4v-4m0 0V9a4 4 0 10-8 0v1a4 4 0 004 4h1m4 0h1a4 4 0 004-4v-1a4 4 0 00-8 0v1a4 4 0 004 4z" /></svg>
    Explanation
  </label>
  <textarea
    id="explanation"
    value={newQuestion.explaination}
    onChange={(e) => setNewQuestion({...newQuestion, explaination: e.target.value})}
    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition sm:text-sm"
    rows={3}
    maxLength={400}
    placeholder="Add detailed explanation for the answer"
    style={{ resize: 'vertical', minHeight: 60 }}
  />
  <div className="text-xs text-slate-700 mt-1 text-right">{newQuestion.explaination.length}/400 characters</div>
</div>
                  <div>
                    <label htmlFor="creatorName" className="block text-sm font-medium text-gray-700">
                      Created By
                    </label>
                    <input
                      type="text"
                      id="creatorName"
                      value={newQuestion.creatorName}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button type="submit" className="px-6 py-2 text-base font-semibold rounded bg-blue-500 hover:bg-blue-600 text-white transition">
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
                <p className="text-center text-gray-500 ">No questions found for this category.</p>
              ) : (
                questions.map((question) => (
                  <div key={question.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-xl bg-gray-50 ">
                    <div className="mb-2 md:mb-0 max-w-xl">
                      <p className="font-semibold text-[#0f172a] text-lg">{question.question}</p>
                      <p className="text-sm [color:var(--admin-bg-primary)] ">Category: {categories.find(c => c.id === question.categoryId)?.name}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {question.options.map((opt, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-gray-200  text-[#0f172a] text-xs font-medium">
                            {opt}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-green-700 ">Answer: <span className="font-semibold">{Number(question.answer)+1}</span></p>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
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
                        onClick={() => setShowDeleteConfirmation(question.id)}
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
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this question?</p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  if (typeof showDeleteConfirmation === 'string') {
                    handleDeleteQuestion(showDeleteConfirmation);
                  }
                }}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirmation(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
