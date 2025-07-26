"use client";
import { useState, useEffect } from "react";
import Quiz from "./quiz";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explaination: string;
  creatorName: string;
}

interface QuizWrapperProps {
  questions: Question[];
  onQuizComplete: () => void;
  onRetry: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function QuizWrapper({
  questions = [],
  onQuizComplete,
  onRetry,
  isLoading,
  error,
}: QuizWrapperProps) {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(questions);

  useEffect(() => {
    setCurrentQuestions(questions);
  }, [questions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading Questions...</p>
        <p className="text-sm text-gray-500 mt-1">Preparing your practice session</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestions || currentQuestions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-600 dark:text-gray-400">
        <p>No practice questions available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Quiz
        questions={currentQuestions}
        onQuizComplete={onQuizComplete}
      />
    </div>
  );
}
