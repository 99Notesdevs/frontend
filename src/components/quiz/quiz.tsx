import React, { useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  questions: Question[];
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);

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

  const checkResults = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedOptions({});
    setShowExplanations({});
    setShowResults(false);
  };

  const calculateScore = () => {
    return questions.reduce((score, question) => {
      return score + (selectedOptions[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 text-center">Quiz</h1>
      
      <div className="space-y-8">
        {showResults ? (
          <div className="border-2 border-gray-400 rounded-lg p-6">
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <h2 className="text-xl font-bold mb-4">Quiz Results</h2>
              <div className="text-3xl font-bold text-green-600 mb-8">
                Score: {calculateScore()} / {questions.length}
              </div>
              <button
                onClick={resetQuiz}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="max-h-[600px] overflow-y-auto">
              {questions.map((question) => (
                <div key={question.id} className="mb-8">
                  <div className="bg-white border-2 border-gray-400 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-center mb-4">{question.question}</h2>

                    <div className="space-y-3">
                      {question.options.map((option, index) => {
                        const isSelected = selectedOptions[question.id] === index;
                        const isCorrect = index === question.correctAnswer;
                        const isShown = showExplanations[question.id];
                        let className = "flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors";

                        if (isShown) {
                          if (isCorrect) {
                            className += " border-green-600 bg-green-100";
                          } else if (isSelected) {
                            className += " border-red-600 bg-red-100";
                          } else {
                            className += " border-gray-300 bg-gray-50";
                          }
                        } else {
                          className += " border-gray-300 hover:bg-gray-50";
                        }

                        return (
                          <label
                            key={index}
                            className={className}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleOptionSelect(question.id, index)}
                              className="mr-3 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                              disabled={isShown}
                            />
                            <span className="text-base font-medium">{option}</span>
                          </label>
                        );
                      })}
                    </div>

                    {showExplanations[question.id] && selectedOptions[question.id] !== undefined && (
                      <div className="mt-4 p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
                        <p className="text-lg font-medium mb-2">Explanation:</p>
                        <p className="text-base text-gray-700">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={checkResults}
                disabled={Object.values(selectedOptions).some(option => option === undefined)}
                className={`px-8 py-3 rounded-lg transition-colors ${
                  Object.values(selectedOptions).some(option => option === undefined)
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 text-white font-bold hover:bg-green-700'
                }`}
              >
                Check Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
