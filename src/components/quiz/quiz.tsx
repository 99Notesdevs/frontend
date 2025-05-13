import React, { useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
}

interface QuizProps {
  questions: Question[];
  onQuizComplete: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onQuizComplete }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      onQuizComplete();
    }
  };

  const checkResults = () => {
    setShowResults(true);
    onQuizComplete();
  };

  const resetQuiz = () => {
    setSelectedOptions({});
    setShowExplanations({});
    setShowResults(false);
    setCurrentQuestion(0);
  };

  const calculateScore = () => {
    return questions.reduce((score, question) => {
      return score + (selectedOptions[question.id] === question.answer ? 1 : 0);
    }, 0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-yellow-700 tracking-tight">Quiz</h1>
      <div className="space-y-8">
        {showResults ? (
          <div className="border-2 border-yellow-400 rounded-2xl shadow-lg bg-white p-8">
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <h2 className="text-2xl font-bold mb-4 text-green-700">Quiz Results</h2>
              <div className="text-4xl font-extrabold text-green-600 mb-8">
                Score: {calculateScore()} / {questions.length}
              </div>
              <button
                onClick={resetQuiz}
                className="px-8 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors shadow-md"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Show only the current question */}
            <div className="max-h-[600px]">
              {(() => {
                const question = questions[currentQuestion];
                const isAnswered = selectedOptions[question.id] !== undefined;
                return (
                  <div key={question.id} className="mb-8">
                    <div className="bg-white border-2 border-yellow-400 rounded-2xl shadow p-8">
                      <h2 className="text-xl font-bold text-center mb-6 text-yellow-800">Q{currentQuestion + 1}. {question.question}</h2>
                      <div className="space-y-3">
                        {question.options.map((option, index) => {
                          const isSelected = selectedOptions[question.id] === index;
                          const isCorrect = index === question.answer;
                          const isShown = showExplanations[question.id];
                          let className = "flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors text-lg font-medium";
                          if (isShown) {
                            if (isCorrect) {
                              className += " border-yellow-500 bg-green-50 text-green-800";
                            } else if (isSelected) {
                              className += " border-red-600 bg-red-50 text-red-800";
                            } else {
                              className += " border-gray-300 bg-gray-50";
                            }
                          } else {
                            className += " border-gray-300 hover:bg-yellow-50";
                          }
                          return (
                            <label
                              key={index}
                              className={className}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={isSelected}
                                onChange={() => handleOptionSelect(question.id, index)}
                                className="mr-3 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-yellow-500"
                                disabled={isShown}
                              />
                              <span>{index + 1}. {option}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="flex justify-between mt-6">
              <div />
              <button
                onClick={handleNext}
                disabled={selectedOptions[questions[currentQuestion].id] === undefined}
                className={`px-8 py-3 rounded-lg transition-colors font-bold shadow-md ${
                  selectedOptions[questions[currentQuestion].id] === undefined
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : currentQuestion === questions.length - 1
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Check Results' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
