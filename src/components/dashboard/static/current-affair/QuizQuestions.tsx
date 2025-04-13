'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizQuestionsProps {
  defaultValue?: string;
  onChange: (questions: string) => void;
}

export function QuizQuestions({ defaultValue = '', onChange }: QuizQuestionsProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    defaultValue ? JSON.parse(defaultValue) : []
  );

  const addQuestion = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    setQuestions(prev => [
      ...prev,
      { 
        question: '', 
        options: ['', '', '', ''], // 4 default options
        correctAnswer: 0,
        explanation: ''
      }
    ]);
  };

  const removeQuestion = (index: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[index].question = value;
      return newQuestions;
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[questionIndex].options[optionIndex] = value;
      return newQuestions;
    });
  };

  const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[questionIndex].correctAnswer = optionIndex;
      return newQuestions;
    });
  };

  const handleExplanationChange = (questionIndex: number, value: string) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[questionIndex].explanation = value;
      return newQuestions;
    });
  };

  // Convert questions to JSON string when they change
  React.useEffect(() => {
    onChange(JSON.stringify(questions));
  }, [questions, onChange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quiz Questions</h3>
        <Button onClick={addQuestion}>Add Question</Button>
      </div>

      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Question {questionIndex + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => removeQuestion(questionIndex, e)}
            >
              Remove
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Question Text</label>
            <Input
              value={question.question}
              onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
              placeholder="Enter your question"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Options</label>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <span className="w-6 text-center">{optionIndex + 1}.</span>
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                />
                <input
                  type="radio"
                  checked={question.correctAnswer === optionIndex}
                  onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Explanation</label>
            <Input
              value={question.explanation}
              onChange={(e) => handleExplanationChange(questionIndex, e.target.value)}
              placeholder="Enter explanation for the correct answer"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setQuestions(prev => {
                const newQuestions = [...prev];
                newQuestions[questionIndex].options.push('');
                return newQuestions;
              });
            }}
          >
            Add Option
          </Button>
        </div>
      ))}
    </div>
  );
}