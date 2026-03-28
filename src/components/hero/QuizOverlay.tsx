'use client';

import React, { useState, useEffect } from 'react';
import QuizWrapper from '../quiz/QuizWrapperN';
import { env } from '@/config/env';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explaination: string;
  creatorName: string;
  categories?: { id: number; name: string }[];
  rating?: number;
  pyq?: boolean;
  year?: number;
  totalAttempts?: number;
}

const QuizOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${env.API_TEST}/questions/practice?categoryId=2604&limit=15`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const data = await response.json();
      setQuestions(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchQuestions();
  };

  const handleQuizComplete = () => {
    // Handle quiz completion if needed
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(10,14,8,0.6)] backdrop-blur-md md:items-center md:p-4">
      <div className="relative w-full max-h-[94svh] overflow-hidden rounded-t-[18px] bg-white shadow-[0_-8px_60px_rgba(0,0,0,0.22)] md:max-h-[90vh] md:max-w-[660px] md:rounded-2xl md:shadow-2xl">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-[#E8EDE2] md:hidden" />
        <div className="max-h-[94svh] overflow-y-auto md:max-h-[90vh]">
          <QuizWrapper
            questions={questions}
            onQuizComplete={handleQuizComplete}
            onRetry={handleRetry}
            isLoading={isLoading}
            error={error}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizOverlay;
