"use client";

import { env } from "@/config/env";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  categoryId: number;
}

interface GetQuestionsProps {
  categoryId: number | null;
  testSeriesId?: number;
  onQuestionSelect?: (questionId: number) => void;
  selectedQuestionIds?: number[];
  questions?: Question[];
  hasMore?: boolean;
  loading?: boolean;
  error?: string | null;
  onLoadMore?: () => void;
}

export default function GetQuestions({
  categoryId,
  testSeriesId,
  onQuestionSelect,
  selectedQuestionIds,
  questions = [],
  hasMore = true,
  loading = false,
  error = null,
  onLoadMore,
}: GetQuestionsProps) {
  const fetchQuestions = async () => {
    try {
      const limit = 10;
      const offset = 0;

      let url = `${env.API_TEST}/questions/practice?categoryId=${categoryId}&limit=${limit}&offset=${offset}`;

      if (testSeriesId) {
        url += `&testSeriesId=${testSeriesId}`;
      }

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch questions");

      const { data, total } = await response.json();
      return { data, total };
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      {loading && <div className="text-center py-8">Loading questions...</div>}

      {error && <div className="text-center text-red-500 py-8">{error}</div>}

      {questions.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500">
          {categoryId
            ? "No questions found"
            : "Select a category to view questions"}
        </p>
      )}

      {questions.map((question) => (
        <div
          key={question.id}
          className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
        >
          <div>
            <p className="font-semibold text-[#0f172a]">{question.question}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {question.options.map((opt, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-gray-200 text-[#0f172a] text-xs font-medium"
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
          {onQuestionSelect && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedQuestionIds?.includes(question.id) ?? false}
                onChange={() => onQuestionSelect(question.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600">
                {selectedQuestionIds?.includes(question.id)
                  ? "Selected"
                  : "Not selected"}
              </span>
            </div>
          )}
        </div>
      ))}

      {hasMore && onLoadMore && !loading && (
        <button
          onClick={onLoadMore}
          className="w-full px-4 py-2 text-center text-blue-500 hover:text-blue-600"
        >
          Load More Questions
        </button>
      )}
    </div>
  );
}
