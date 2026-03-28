'use client';

import React, { useState, useEffect } from 'react';
import QuizWrapper from '../quiz/QuizWrapper';
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

interface NudgeMessage {
  emoji: string;
  message: string;
}

const NUDGES: Record<number, NudgeMessage> = {
  3: {
    emoji: "😤",
    message: "3 down. 12 to go.<br><em>The person who clears this exam</em> didn't stop at question 3.<br><strong>Don't be the one who quits here.</strong>"
  },
  7: {
    emoji: "🔥",
    message: "Halfway done.<br>Right now, <em>lakhs of aspirants</em> are also preparing.<br><strong>Most of them won't finish this test.</strong><br>You still can."
  },
  10: {
    emoji: "⚡",
    message: "10 questions in.<br><strong>Only 5 left.</strong><br>Your GE Rating is almost ready — and it's going to tell you something <em>nobody else will say to your face.</em>"
  }
};

interface QuizOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuizOverlay: React.FC<QuizOverlayProps> = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showNudge, setShowNudge] = useState<boolean>(false);
  const [currentNudge, setCurrentNudge] = useState<NudgeMessage | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
      setCurrentQuestionIndex(0);
      setShowNudge(false);
      setCurrentNudge(null);
    }
  }, [isOpen]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${env.API_TEST}/questions/practice?categoryId=1&limit=15`, {
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
    setCurrentQuestionIndex(0);
    setShowNudge(false);
    setCurrentNudge(null);
  };

  const handleQuizComplete = () => {
    // Handle quiz completion if needed
  };

  const handleQuestionAnswered = (questionIndex: number) => {
    const nextQuestionIndex = questionIndex + 1;
    
    // Check if we should show a nudge message
    if (NUDGES[nextQuestionIndex]) {
      setCurrentNudge(NUDGES[nextQuestionIndex]);
      setShowNudge(true);
    } else {
      setCurrentQuestionIndex(nextQuestionIndex);
    }
  };

  const handleNudgeContinue = () => {
    setShowNudge(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[90vw] sm:w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Quiz Content */}
        <div className="p-3 sm:p-6 overflow-y-auto max-h-[90vh] sm:max-h-[85vh]">
          <QuizWrapper
            questions={questions}
            onQuizComplete={handleQuizComplete}
            onRetry={handleRetry}
            isLoading={isLoading}
            error={error}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionAnswered={handleQuestionAnswered}
            showNudge={showNudge}
          />
        </div>

        {/* Nudge Modal */}
        {showNudge && currentNudge && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-97 rounded-xl sm:rounded-2xl z-20 flex items-center justify-center flex-col text-center p-6 sm:p-10 animate-fadeIn">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-bounceIn">
              {currentNudge.emoji}
            </div>
            <div 
              className="text-base sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-relaxed max-w-xs sm:max-w-md mb-6 sm:mb-8"
              dangerouslySetInnerHTML={{ __html: currentNudge.message }}
            />
            <button
              onClick={handleNudgeContinue}
              className="bg-blue-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-nudgePulse text-sm sm:text-base"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizOverlay;
