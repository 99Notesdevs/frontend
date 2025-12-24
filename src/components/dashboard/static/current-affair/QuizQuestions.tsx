"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TiptapEditor from "@/components/ui/tiptapeditor";
import { uploadImageToS3 } from "@/config/imageUploadS3";
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explaination: string;
}

interface QuizQuestionsProps {
  defaultValue?: string;
  onChange: (questions: string) => void;
}

export function QuizQuestions({
  defaultValue = "",
  onChange,
}: QuizQuestionsProps) {
  console.log("QuizQuestions component initialized with defaultValue:", defaultValue);

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
    const validatedQuestions = parsedValue.map(question => ({
      ...question,
      // Ensure options is an array with at least 2 empty strings if empty
      options: Array.isArray(question.options) && question.options.length >= 2 
        ? question.options 
        : ['', '']
    })).filter((question): question is QuizQuestion => {
      return (
        typeof question === "object" &&
        typeof question.id === "number" &&
        typeof question.question === "string" &&
        Array.isArray(question.options) &&
        typeof question.answer === "number" &&
        question.options.length >= 2 // Ensure at least 2 options
      );
    });

    const [questions, setQuestions] = useState<QuizQuestion[]>(validatedQuestions);
    const [nextId, setNextId] = useState(
      questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1
    );

    const addQuestion = (e: React.MouseEvent) => {
      e.preventDefault();
      setQuestions((prev) => [
        ...prev,
        {
          id: nextId,
          question: "",
          options: ["", ""], // Start with 2 empty options
          answer: 0,
          explaination: "",
        },
      ]);
      setNextId((prev) => prev + 1);
    };

    const removeQuestion = (index: number, e: React.MouseEvent) => {
      e.preventDefault();
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

    const addOption = (questionIndex: number, e: React.MouseEvent) => {
      e.preventDefault();
      setQuestions(prev => {
        const newQuestions = [...prev];
        newQuestions[questionIndex].options.push("");
        return newQuestions;
      });
    };

    const removeOption = (questionIndex: number, optionIndex: number, e: React.MouseEvent) => {
      e.preventDefault();
      setQuestions(prev => {
        const newQuestions = [...prev];
        const options = newQuestions[questionIndex].options;
        
        // If removing the selected answer, reset to first option
        if (newQuestions[questionIndex].answer === optionIndex) {
          newQuestions[questionIndex].answer = 0;
        } 
        // If removing an option before the selected answer, adjust the answer index
        else if (newQuestions[questionIndex].answer > optionIndex) {
          newQuestions[questionIndex].answer -= 1;
        }

        // Remove the option
        options.splice(optionIndex, 1);
        
        // Ensure at least 1 options remain
        if (options.length < 1) {
          options.push("");
        }

        return newQuestions;
      });
    };

    const handleExplainationChange = (questionIndex: number, content: string) => {
      setQuestions(prev => {
        const newQuestions = [...prev];
        newQuestions[questionIndex].explaination = content;
        return newQuestions;
      });
    };

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
              <TiptapEditor
                content={question.question}
                onChange={(content) => handleQuestionChange(questionIndex, content)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">Options</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => addOption(questionIndex, e)}
                >
                  Add Option
                </Button>
              </div>
              
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                  <span className="w-6 text-center">{String.fromCharCode(65 + optionIndex)}.</span>
                  <div className="flex-1 flex items-center gap-2">
                    <TiptapEditor
                      content={option}
                      onChange={(content) => 
                        handleOptionChange(questionIndex, optionIndex, content)
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        checked={question.answer === optionIndex}
                        onChange={() => 
                          handleAnswerChange(questionIndex, optionIndex)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      {question.options.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => removeOption(questionIndex, optionIndex, e)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium mb-1">
                  Explanation
                </label>
                <span className="text-xs text-muted-foreground">
                  Optional
                </span>
              </div>
              <div className="mt-2">
                <TiptapEditor
                  content={question.explaination}
                  onChange={(content) => handleExplainationChange(questionIndex, content)}                />
              </div>
            </div>
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