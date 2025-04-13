// components/quiz/QuizWrapper.tsx
'use client'
import Quiz  from './quiz'

interface Question {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

interface QuizWrapperProps {
  questions: Question[];
}

export default function QuizWrapper({ questions }: QuizWrapperProps) {
  return <Quiz questions={questions} />
}