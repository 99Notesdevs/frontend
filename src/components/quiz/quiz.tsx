import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explaination: string;
  creatorName: string;
}

interface QuizProps {
  questions: Question[];
  onQuizComplete: () => void;
}

// Helper function to strip HTML tags from text
const stripHtml = (html: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
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
    window.location.href = "http://localhost:5173/tests";
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
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6" data-theme="light">
        {showResults ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800 p-8">
            <div className="flex flex-col items-center justify-center min-h-[280px] space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="h-16 w-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Quiz Completed!
                </h2>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-3">
                  {calculateScore()} / {questions.length}
                </div>
                <p className="text-base text-gray-600 dark:text-gray-400 max-w-sm">
                  {calculateScore() >= questions.length / 2
                    ? "Great job! "
                    : "Keep practicing! "}
                  You answered {calculateScore()} out of {questions.length} questions correctly.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <button
                  onClick={resetQuiz}
                  className="flex-1 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Try Again
                </button>
                <button
                  onClick={handlePracticeMore}
                  className="flex-1 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
                >
                  Practice More
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {Object.keys(selectedOptions).length} answered
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Show only the current question */}
            <div className="max-h-[500px] overflow-auto">
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
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
                      <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap break-words">
                        <span className="text-blue-600 dark:text-blue-400 font-medium mr-2">Q{currentQuestion + 1}.</span>
                        {stripHtml(question.question)}
                      </h2>
                      <div className="space-y-3">
                        {question.options.map((option, index) => {
                          const isSelected =
                            selectedOptions[question.id] === index;
                          const isCorrect = index === Number(question.answer);
                          const isShown = showExplanations[question.id];
                          let className =
                            "flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 text-base";
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
                                className="mr-3 w-4 h-4 rounded border-gray-300 dark:border-gray-500 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                                disabled={isShown}
                              />
                              <span className="flex-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                                {stripHtml(option)}
                              </span>
                              {isShown && isCorrect && (
                                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {isShown && isSelected && !isCorrect && (
                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </label>
                          );
                        })}

                        {showExplanations[question.id] && (
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            {question.explaination && (
                              <div>
                                <p className="font-medium text-blue-900 dark:text-blue-300 mb-2 text-sm">
                                  Explanation:
                                </p>
                                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                  {stripHtml(question.explaination)}
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
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500 dark:text-gray-500">
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
                className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm ${
                  selectedOptions[questions[currentQuestion].id] === undefined
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : currentQuestion === questions.length - 1
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
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
