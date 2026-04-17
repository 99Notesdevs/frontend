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
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  
  // Quiz state that needs to persist
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNudgeOpen, setIsNudgeOpen] = useState(false);
  const [nudgeQuestionIndex, setNudgeQuestionIndex] = useState<number | null>(null);
  const [resultStep, setResultStep] = useState<0 | 1 | 2>(0);
  const [ctaLiveCount, setCtaLiveCount] = useState(12843);

  useEffect(() => {
    if (isOpen && !hasFetched) {
      fetchQuestions();
      setHasFetched(true);
    }
  }, [isOpen, hasFetched]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${env.API_TEST}/questions/random?limit=15`, {
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
    setShowResults(true);
    setResultStep(0);
  };

  const resetQuiz = () => {
    setSelectedOptions({});
    setShowExplanations({});
    setShowResults(false);
    setCurrentQuestion(0);
    setIsNudgeOpen(false);
    setNudgeQuestionIndex(null);
    setResultStep(0);
    setCtaLiveCount(12843);
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
            // Quiz state props
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            showExplanations={showExplanations}
            setShowExplanations={setShowExplanations}
            showResults={showResults}
            setShowResults={setShowResults}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            isNudgeOpen={isNudgeOpen}
            setIsNudgeOpen={setIsNudgeOpen}
            nudgeQuestionIndex={nudgeQuestionIndex}
            setNudgeQuestionIndex={setNudgeQuestionIndex}
            resultStep={resultStep}
            setResultStep={setResultStep}
            ctaLiveCount={ctaLiveCount}
            setCtaLiveCount={setCtaLiveCount}
            resetQuiz={resetQuiz}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizOverlay;
