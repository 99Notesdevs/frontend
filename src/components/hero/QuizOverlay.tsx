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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(10,14,8,0.6)] backdrop-blur-md md:items-center md:p-4">
      <div className="relative w-full max-h-[94svh] overflow-hidden rounded-t-[18px] bg-white shadow-[0_-8px_60px_rgba(0,0,0,0.22)] md:max-h-[90vh] md:max-w-[660px] md:rounded-2xl md:shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8EDE2]">
          <div className="mx-auto h-1 w-10 rounded-full bg-[#E8EDE2] md:hidden" />
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[#7A8873] transition-colors hover:bg-[#F5F7F4] hover:text-[#C0392B] md:absolute md:right-4 md:top-4 md:bg-white md:shadow-md md:border md:border-[#E8EDE2]"
          >
            × Close
          </button>
        </div>
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
