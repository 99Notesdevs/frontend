"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Quiz from "@/components/quiz/quiz";
import { env } from "@/config/env";
import Cookies from "js-cookie";
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiRotateCw } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 rounded-md"></div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-3 mt-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-red-100 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <FiRotateCw className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const loadedAllQuestions = currentQuestions.length >= totalQuestions;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PYQ Practice</h1>
            <p className="text-gray-600">Practice previous year questions to ace your preparation</p>
          </div>

          {/* Year Selector */}
          <div className="p-6 border-b border-gray-100">
            <div className="max-w-xs">
              <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Year
              </label>
              <div className="relative">
                <select
                  id="year-select"
                  value={selectedYear || ''}
                  onChange={(e) => {
                    setSelectedYear(Number(e.target.value));
                    setCurrentBatch(0);
                    setQuizCompleted(false);
                  }}
                  className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none bg-white"
                >
                  <option value="">Select a year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year} - {year + 1}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {selectedYear && (
            <>
              <AnimatePresence mode="wait">
                {currentQuestions.length > 0 ? (
                  <motion.div
                    key={currentBatch}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Questions {currentBatch * questionsPerBatch + 1} - {Math.min((currentBatch + 1) * questionsPerBatch, totalQuestions)} of {totalQuestions}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {selectedYear} - {selectedYear + 1}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                          style={{
                            width: `${Math.min(100, ((currentBatch + 1) * questionsPerBatch / totalQuestions) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <Quiz
                      questions={currentQuestions}
                      onQuizComplete={handleQuizComplete}
                    />

                    <div className="flex justify-between items-center mt-8">
                      <AnimatePresence>
                        {currentBatch > 0 && !quizCompleted && (
                          <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onClick={() => setCurrentBatch(prev => prev - 1)}
                            className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <FiChevronLeft className="mr-2 h-5 w-5" />
                            Previous
                          </motion.button>
                        )}
                      </AnimatePresence>

                      <div className="flex-1" />

                      <AnimatePresence>
                        {!quizCompleted && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                          >
                            {(currentBatch + 1) * questionsPerBatch < totalQuestions ? (
                              <button
                                onClick={handleLoadMore}
                                className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                Next {Math.min(questionsPerBatch, totalQuestions - (currentBatch + 1) * questionsPerBatch)} Questions
                                <FiChevronRight className="ml-2 h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                onClick={handleQuizComplete}
                                className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                              >
                                Complete Quiz
                                <FiCheckCircle className="ml-2 h-5 w-5" />
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {quizCompleted && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl text-center border border-green-100"
                      >
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                          <FiCheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed! 🎉</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Great job! You've completed all {totalQuestions} questions for {selectedYear} - {selectedYear + 1}.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                          <button
                            onClick={resetQuiz}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <FiRotateCw className="mr-2 h-5 w-5" />
                            Restart Quiz
                          </button>
                          <button
                            onClick={() => setCurrentBatch(0)}
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            Review Answers
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Available</h3>
                    <p className="text-gray-600">There are no PYQ questions available for the selected year.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}