import { env } from "@/config/env";
import React, { useState, useEffect } from "react";
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

interface QuizProps {
  questions: Question[];
  onQuizComplete: () => void;
}

// Helper function to calculate difficulty based on rating and attempts
const getDifficulty = (rating?: number, totalAttempts?: number): string => {
  if (!totalAttempts || totalAttempts === 0) return "Easy";
  if (!rating) return "Medium";
  const percentage = rating;
  if (percentage < 25) return "Hard";
  if (percentage < 50) return "Medium";
  return "Easy";
};

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Hard":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const Quiz: React.FC<QuizProps> = ({ questions = [], onQuizComplete }) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number>
  >({});
  const [showExplanations, setShowExplanations] = useState<
    Record<number, boolean>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setIsLoading(false);
    } else {
      setError("No questions available");
      setIsLoading(false);
    }
  }, [questions]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-600 dark:text-gray-400">
        <p>No practice questions available at the moment.</p>
      </div>
    );
  }
  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setShowExplanations((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePracticeMore = () => {
    window.location.href = env.TEST_PORTAL;
  };

  const checkResults = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedOptions({});
    setShowExplanations({});
    setShowResults(false);
    setCurrentQuestion(0);
    onQuizComplete();
    setCurrentQuestion(0);
  };

  const calculateScore = () => {
    return questions.reduce((score, question) => {
      return (
        score +
        (selectedOptions[question.id] === Number(question.answer) ? 1 : 0)
      );
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6" data-theme="light">
        {showResults ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl bg-white dark:bg-gray-800 p-8">
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6">
              <div className="text-center">
                <div className="mb-6">
                  <svg className="h-20 w-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Quiz Completed!
                </h2>
                <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-4">
                  {calculateScore()} / {questions.length}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                  {calculateScore() >= questions.length / 2
                    ? "Great job! "
                    : "Keep practicing! "}
                  You answered {calculateScore()} out of {questions.length} questions correctly.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={resetQuiz}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Try Again
                </button>
                <button
                  onClick={handlePracticeMore}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Practice More
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Show only the current question */}
            <div className="max-h-[500px] overflow-auto pr-2">
              {(() => {
                const question = questions[currentQuestion];

                if (!question) {
                  return (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                      <p className="text-sm">Error: Question data is not available.</p>
                    </div>
                  );
                }
                const isAnswered = selectedOptions[question.id] !== undefined;

                return (
                  <div key={question.id} className="mb-6">
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                      {/* Categories, Difficulty, and PYQ Year */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.categories && question.categories.length > 0 && (
                          question.categories.slice(0, 3).map((category, index) => (
                            <span
                              key={category.id || index}
                              className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full"
                            >
                              {category.name}
                            </span>
                          ))
                        )}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(getDifficulty(question.rating, question.totalAttempts))}`}
                        >
                          {getDifficulty(question.rating, question.totalAttempts)}
                        </span>
                        {question.pyq && question.year && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                            {question.year}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap break-words">
                        <span className="text-blue-600 dark:text-blue-400 font-bold mr-2">Q{currentQuestion + 1}.</span>
                        <div
                          className="prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{ __html: question.question }}
                        />
                      </h2>
                      <div className="space-y-3">
                        {question.options.map((option, index) => {
                          const isSelected =
                            selectedOptions[question.id] === index;
                          const isCorrect = (index === Number(question.answer)) || (String.fromCharCode(index + 65) == question.answer);
                          const isShown = showExplanations[question.id];
                          let className =
                            "flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 text-base hover:shadow-md";
                          if (isShown) {
                            if (isCorrect) {
                              className +=
                                " border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20";
                            } else if (isSelected) {
                              className +=
                                " border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20";
                            } else {
                              className +=
                                " border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50";
                            }
                          } else {
                            className +=
                              " border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";
                          }
                          return (
                            <label key={index} className={className}>
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={isSelected}
                                onChange={() =>
                                  handleOptionSelect(question.id, index)
                                }
                                className="mr-4 w-5 h-5 rounded border-gray-300 dark:border-gray-500 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                                disabled={isShown}
                              />
                              <span className="flex-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
                                <div
                                  className="prose prose-lg max-w-none"
                                  dangerouslySetInnerHTML={{ __html: option }}
                                />
                              </span>
                              {isShown && isCorrect && (
                                <svg className="h-6 w-6 text-green-500 ml-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {isShown && isSelected && !isCorrect && (
                                <svg className="h-6 w-6 text-red-500 ml-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </label>
                          );
                        })}

                        {showExplanations[question.id] && (
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                            {question.explaination && (
                              <div>
                                <p className="font-semibold text-blue-900 dark:text-blue-300 mb-3 text-base">
                                  Explanation:
                                </p>
                                <p className="text-blue-800 dark:text-blue-200 text-base leading-relaxed whitespace-pre-wrap break-words">
                                  <div
                                    className="prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ __html: question.explaination }}
                                  />
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="flex justify-between items-center mt-6 px-2">
              <div className="text-base font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                {currentQuestion + 1} / {questions.length}
              </div>
              <button
                onClick={
                  currentQuestion === questions.length - 1
                    ? checkResults
                    : handleNext
                }
                disabled={
                  selectedOptions[questions[currentQuestion].id] === undefined
                }
                className={`px-8 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg transform hover:-translate-y-0.5 ${selectedOptions[questions[currentQuestion].id] === undefined
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : currentQuestion === questions.length - 1
                      ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-xl"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl"
                  }`}
              >
                {currentQuestion === questions.length - 1
                  ? "Check Results"
                  : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
