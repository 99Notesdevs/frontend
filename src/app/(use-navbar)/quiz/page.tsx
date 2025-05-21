"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Quiz from "@/components/quiz/quiz";
import { env } from "@/config/env";
import Cookies from "js-cookie";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explaination: string;
  creatorName: string;
  year?: number;
}

export default function QuizPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBatch, setCurrentBatch] = useState(0);
  const questionsPerBatch = 5;
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const fetchQuestions = useCallback(async () => {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }
      
      const response = await fetch(`${env.API_TEST}/questions/practice?categoryId=${categoryId}&limit=500`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to fetch questions');
      }
      
      const { data } = await response.json();
      // Filter only PYQ questions and sort by year
      const pyqQuestions = data
        .filter((q: any) => q.pyq && q.year)
        .sort((a: any, b: any) => b.year - a.year);
      
      // Extract unique years
      const uniqueYears = Array.from(new Set(pyqQuestions.map((q: any) => q.year)))
        .sort((a: any, b: any) => b - a) as number[];
      
      setAllQuestions(pyqQuestions);
      setYears(uniqueYears);
      
      // If there are years, select the most recent one by default
      if (uniqueYears.length > 0 && !selectedYear) {
        setSelectedYear(uniqueYears[0]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, selectedYear]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const currentQuestions = React.useMemo(() => {
    if (!selectedYear) return [];
    const filtered = allQuestions.filter(q => q.year === selectedYear);
    const start = currentBatch * questionsPerBatch;
    return filtered.slice(start, start + questionsPerBatch);
  }, [selectedYear, allQuestions, currentBatch]);

  const totalQuestions = React.useMemo(() => {
    if (!selectedYear) return 0;
    return allQuestions.filter(q => q.year === selectedYear).length;
  }, [selectedYear, allQuestions]);

  const handleLoadMore = () => {
    setCurrentBatch(prev => prev + 1);
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setCurrentBatch(0);
    setQuizCompleted(false);
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const loadedAllQuestions = currentQuestions.length >= totalQuestions;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PYQ Practice</h1>
      
      {/* Year Selector */}
      <div className="mb-6">
        <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear || ''}
          onChange={(e) => {
            setSelectedYear(Number(e.target.value));
            setCurrentBatch(0);
            setQuizCompleted(false);
          }}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        >
          <option value="">Select a year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {selectedYear && (
        <>
          {currentQuestions.length > 0 ? (
            <div className="space-y-8">
              <div className="text-sm text-gray-600 mb-2">
                Showing questions {currentBatch * questionsPerBatch + 1}-
                {Math.min((currentBatch + 1) * questionsPerBatch, totalQuestions)} of {totalQuestions}
              </div>
              
              <Quiz 
                questions={currentQuestions} 
                onQuizComplete={handleQuizComplete} 
              />
              
              {!quizCompleted && (
                <div className="flex justify-between items-center mt-6">
                  {currentBatch > 0 && (
                    <button
                      onClick={() => setCurrentBatch(prev => prev - 1)}
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Previous
                    </button>
                  )}
                  
                  <div className="flex-1" /> {/* Spacer */}
                  
                  {(currentBatch + 1) * questionsPerBatch < totalQuestions ? (
                    <button
                      onClick={handleLoadMore}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Next {Math.min(questionsPerBatch, totalQuestions - (currentBatch + 1) * questionsPerBatch)} Questions
                    </button>
                  ) : (
                    <button
                      onClick={handleQuizComplete}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Complete Quiz
                    </button>
                  )}
                </div>
              )}

              {quizCompleted && (
                <div className="text-center mt-6">
                  <p className="mb-4">You've completed all questions for this year!</p>
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    Restart Quiz
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No PYQ questions found for the selected year.
            </div>
          )}
        </>
      )}
    </div>
  );
}