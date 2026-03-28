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
  categories?: {id: number; name: string}[];
  rating?: number;
  pyq?: boolean;
  year?: number;
  totalAttempts?: number;
}

interface QuizWrapperProps {
  questions: Question[];
  onQuizComplete: () => void;
  onRetry: () => void;
  isLoading: boolean;
  error: string | null;
  onProgressChange?: (progress: {
    score: number;
    total: number;
    answered: number;
    currentQuestion: number;
    isCompleted: boolean;
  }) => void;
}

export default function QuizWrapper({
  questions = [],
  onQuizComplete,
  onRetry,
  isLoading,
  error,
  onProgressChange,
}: QuizWrapperProps) {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(questions);

  useEffect(() => {
    setCurrentQuestions(questions);
  }, [questions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium text-sm">Loading Questions...</p>
        <p className="text-xs text-gray-500 mt-1">Preparing your practice session</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
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
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 underline transition-colors"
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
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        <div className="mb-3">
          <svg className="h-12 w-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-sm font-medium">No practice questions available</p>
        <p className="text-xs mt-1">Please check back later</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Quiz
        questions={currentQuestions}
        onQuizComplete={onQuizComplete}
        onProgressChange={onProgressChange}
      />
    </div>
  );
}
