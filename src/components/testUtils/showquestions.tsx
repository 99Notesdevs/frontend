"use client";

import { useState } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  categoryId: number;
}

interface ShowQuestionsProps {
  questions: Question[];
  pageSize?: number;
  onQuestionSelect?: (questionId: number) => void;
  selectedQuestionIds?: number[];
}

export default function ShowQuestions({
  questions,
  pageSize = 10,
  onQuestionSelect,
  selectedQuestionIds = [],
}: ShowQuestionsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(questions.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentQuestions = questions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {currentQuestions.map((question) => (
          <div
            key={question.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
          >
            <div>
              <p className="font-semibold text-[#0f172a]">
                {question.question}
              </p>
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
              <input
                type="checkbox"
                checked={selectedQuestionIds.includes(question.id)}
                onChange={() => onQuestionSelect(question.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
