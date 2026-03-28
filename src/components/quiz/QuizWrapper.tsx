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
  onClose?: () => void;
}

export default function QuizWrapper({
  questions = [],
  onQuizComplete,
  onRetry,
  isLoading,
  error,
  onClose,
}: QuizWrapperProps) {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(questions);

  useEffect(() => {
    setCurrentQuestions(questions);
  }, [questions]);

  if (isLoading) {
    return (
      <div className="flex min-h-[340px] flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#1865F2] border-t-transparent" />
        <p className="text-sm font-black uppercase tracking-[0.08em] text-[#7A8873]">Preparing Quiz</p>
        <p className="mt-1 text-sm text-[#3D4A35]">Loading questions for your 15-question practice set.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 rounded-xl border border-[#F2C9C4] bg-[#FDEDEC] p-4">
        <div className="flex items-start">
          <div className="mt-0.5 shrink-0">
            <svg
              className="h-5 w-5 text-[#C0392B]"
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
            <p className="text-sm font-medium text-[#A93226]">{error}</p>
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-bold text-[#C0392B] underline transition-colors hover:text-[#A93226]"
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
      <div className="px-6 py-10 text-center text-[#3D4A35]">
        <div className="mb-3">
          <svg className="mx-auto h-12 w-12 text-[#8FA058]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-sm font-bold">No practice questions available</p>
        <p className="mt-1 text-xs">Please check back later</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Quiz
        questions={currentQuestions}
        onQuizComplete={onQuizComplete}
        onClose={onClose}
      />
    </div>
  );
}
