"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Quiz from "@/components/quiz/quiz";
import { env } from "@/config/env";
import Cookies from "js-cookie";
import Link from "next/link";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
}

export default function QuizPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDoMore, setShowDoMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!categoryId) {
          throw new Error('Category ID is required');
        }

        const response = await fetch(`${env.API_TEST}/questions/practice?limit=5&categoryIds=${categoryId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to fetch questions');
        }

        const { data } = await response.json();
        const parsedData = data.map((item: any) => ({
          ...item,
          answer: Number(item.answer),
        }));
        setQuestions(parsedData);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryId]);

  const handleQuizComplete = () => {
    setShowDoMore(true);
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

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          {questions.length > 0 ? (
            <>
              <Quiz
                questions={questions}
                onQuizComplete={handleQuizComplete}
              />
              {showDoMore && (
                <div className="mt-8 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-green-700">Great job!</h3>
                  <p className="mb-6 text-lg text-gray-700">Want to try more questions in this category?</p>
                  <Link
                    href={`${env.TEST_PORTAL}/login`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-semibold rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-lg transition-colors"
                  >
                    Try More Questions
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No questions available for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}