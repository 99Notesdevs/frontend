"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
}

interface QuizQuestionsProps {
  defaultValue?: string;
  onChange: (questions: string) => void;
}

export function QuizQuestions({
  defaultValue = "",
  onChange,
}: QuizQuestionsProps) {
  console.log(
    "QuizQuestions component initialized with defaultValue:",
    defaultValue
  );

  try {
    // Parse the defaultValue safely
    let parsedValue: QuizQuestion[];
    try {
      parsedValue = defaultValue ? JSON.parse(defaultValue) : [];
      console.log("Parsed defaultValue:", parsedValue);
    } catch (parseError) {
      console.error("Error parsing quiz questions JSON:", parseError);
      parsedValue = [];
    }

    // Validate the parsed value
    if (!Array.isArray(parsedValue)) {
      console.error("Invalid questions format:", parsedValue);
      parsedValue = [];
    }

    // Validate each question in the array
    const validatedQuestions = parsedValue.filter(
      (question): question is QuizQuestion => {
        return (
          typeof question === "object" &&
          typeof question.id === "number" &&
          typeof question.question === "string" &&
          Array.isArray(question.options) &&
          typeof question.answer === "number"
        );
      }
    );

    console.log("Validated questions:", validatedQuestions);

    const [questions, setQuestions] =
      useState<QuizQuestion[]>(validatedQuestions);
    const [nextId, setNextId] = useState(
      questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1
    );

    console.log("Initial questions state:", questions);
    console.log("Initial nextId:", nextId);

    // Add validation for questions array
    if (!Array.isArray(questions)) {
      console.error("Invalid questions format:", questions);
      setQuestions([]);
    }

    const addQuestion = (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent any form submission
      setQuestions((prev) => [
        ...prev,
        {
          id: nextId,
          question: "",
          options: ["", "", "", ""], // 4 default options
          answer: 0,
        },
      ]);
      setNextId((prev) => prev + 1);
    };

    const removeQuestion = (index: number, e: React.MouseEvent) => {
      e.preventDefault(); // Prevent any form submission
      setQuestions((prev) => prev.filter((_, i) => i !== index));
    };

    const handleQuestionChange = (index: number, value: string) => {
      setQuestions((prev) => {
        const newQuestions = [...prev];
        newQuestions[index].question = value;
        return newQuestions;
      });
    };

    const handleOptionChange = (
      questionIndex: number,
      optionIndex: number,
      value: string
    ) => {
      setQuestions((prev) => {
        const newQuestions = [...prev];
        newQuestions[questionIndex].options[optionIndex] = value;
        return newQuestions;
      });
    };

    const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
      setQuestions((prev) => {
        const newQuestions = [...prev];
        newQuestions[questionIndex].answer = optionIndex;
        return newQuestions;
      });
    };

    useEffect(() => {
      console.log("Questions changed:", questions);
      const stringified = JSON.stringify(questions);
      console.log("Stringified questions:", stringified);
      onChange(stringified);
    }, []);

    useEffect(() => {
      console.log("Questions changed:", questions);
      const stringified = JSON.stringify(questions);
      console.log("Stringified questions:", stringified);
      onChange(stringified);
    }, [questions, onChange]);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Quiz Questions</h3>
          <Button className="bg-slate-700" onClick={addQuestion}>Add Question</Button>
        </div>

        {questions.map((question, questionIndex) => (
          <div key={question.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">
                Question {questionIndex + 1}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => removeQuestion(questionIndex, e)}
              >
                Remove
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Question Text
              </label>
              <Input
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(questionIndex, e.target.value)
                }
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
                    onChange={(e) =>
                      handleOptionChange(
                        questionIndex,
                        optionIndex,
                        e.target.value
                      )
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  <input
                    type="radio"
                    checked={question.answer === optionIndex}
                    onChange={() =>
                      handleAnswerChange(questionIndex, optionIndex)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setQuestions((prev) => {
                  const newQuestions = [...prev];
                  newQuestions[questionIndex].options.push("");
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
  } catch (error) {
    console.error("Error in QuizQuestions component:", error);
    return (
      <div className="text-red-500">
        Error loading quiz questions. Please try again.
      </div>
    );
  }
}
