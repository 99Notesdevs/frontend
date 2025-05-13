"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { env } from "@/config/env";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}

export default function AddQuestionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: "",
    question: "",
    answer: "",
    options: [] as string[],
    categoryId: 0
  });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${env.API_TEST}/categories`, {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
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
        const response = await fetch(`${env.API_TEST}/questions/practice?categoryIds=${selectedCategory}&limit=${pageSize}`, {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
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
        categoryId: selectedCategory || 0 
      });
      setPage(1);
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion({
      ...question,
      categoryId: question.categoryId
    });
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
      const response = await fetch(`${env.API_TEST}/questions/${editingQuestion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify(newQuestion),
      });
      
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
        categoryId: selectedCategory || 0 
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
      categoryId: selectedCategory || 0 
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <Select
            value={selectedCategory?.toString()}
            onValueChange={(value) => {
              setSelectedCategory(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Question Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}>
              <div className="space-y-4">
                <Input
                  placeholder="Enter question"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                />
                <Input
                  placeholder="Enter answer"
                  value={newQuestion.answer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                />
                <div className="space-y-2">
                  <label>Options</label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
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
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingQuestion ? "Update Question" : "Add Question"}
                  </Button>
                  {editingQuestion && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="flex justify-between items-center p-4 border rounded">
                  <div>
                    <p className="font-medium">{question.question}</p>
                    <p className="text-sm text-gray-500">Category: {categories.find(c => c.id === question.categoryId)?.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuestion(question)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowDeleteConfirmation(question.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
              <p className="mb-4">Are you sure you want to delete this question?</p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteQuestion(showDeleteConfirmation)}
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
    </div>
  );
};
