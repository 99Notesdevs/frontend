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
      <div className="space-y-8" data-theme="light">
        {showResults ? (
          <div className="border-2 border-yellow-400 dark:border-yellow-600 rounded-2xl shadow-lg bg-white dark:bg-gray-800 p-8">
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6">
              <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">
                Quiz Completed!
              </h2>
              <div className="text-5xl font-extrabold text-green-600 dark:text-green-400">
                {calculateScore()} / {questions.length}
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {calculateScore() >= questions.length / 2
                  ? "🎉 Great job! "
                  : "Keep practicing! "}
                You answered {calculateScore()} out of {questions.length}{" "}
                questions correctly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors shadow-md"
                >
                  Try Again
                </button>
                <button
                  onClick={handlePracticeMore}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Practice More
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Show only the current question */}
            <div className="max-h-[600px]">
              {(() => {
                const question = questions[currentQuestion];

                if (!question) {
                  return (
                    <div className="text-center py-6 text-gray-600 dark:text-gray-400">
                      <p>Error: Question data is not available.</p>
                    </div>
                  );
                }
                const isAnswered = selectedOptions[question.id] !== undefined;
                return (
                  <div key={question.id} className="mb-8">
                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow p-8">
                      <h2 className="text-xl font-bold text-center mb-6 text-yellow-800 dark:text-yellow-400">
                        Q{currentQuestion + 1}. {stripHtml(question.question)}
                      </h2>
                      <div className="space-y-3">
                        {question.options.map((option, index) => {
                          const isSelected =
                            selectedOptions[question.id] === index;
                          const isCorrect = index === Number(question.answer);
                          const isShown = showExplanations[question.id];
                          let className =
                            "flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors text-lg font-medium";
                          if (isShown) {
                            if (isCorrect) {
                              className +=
                                " border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200";
                            } else if (isSelected) {
                              className +=
                                " border-red-600 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200";
                            } else {
                              className +=
                                " border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700";
                            }
                          } else {
                            className +=
                              " border-gray-300 dark:border-gray-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30";
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
                                className="mr-3 w-5 h-5 rounded border-gray-300 dark:border-gray-500 text-green-600 dark:text-green-400 focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:bg-gray-700"
                                disabled={isShown}
                              />
                              <span>
                                {index + 1}. {stripHtml(option)}
                              </span>
                            </label>
                          );
                        })}

                        {showExplanations[question.id] && (
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-600 rounded-r">
                            {question.explaination && (
                              <div className="mb-2">
                                <p className="font-semibold text-blue-800 dark:text-blue-300">
                                  Explanation:
                                </p>
                                <p className="text-blue-700 dark:text-blue-200">
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
            <div className="flex justify-between mt-6">
              <div />
              <button
                onClick={
                  currentQuestion === questions.length - 1
                    ? checkResults
                    : handleNext
                }
                disabled={
                  selectedOptions[questions[currentQuestion].id] === undefined
                }
                className={`px-8 py-3 rounded-lg transition-colors font-bold shadow-md ${
                  selectedOptions[questions[currentQuestion].id] === undefined
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : currentQuestion === questions.length - 1
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
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
