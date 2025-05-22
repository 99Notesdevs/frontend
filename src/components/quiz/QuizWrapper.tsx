// components/quiz/QuizWrapper.tsx
'use client'
import Quiz  from './quiz'

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explaination: string;
  creatorName: string;
}

interface QuizWrapperProps {
  questions: Question[];
}

export default function QuizWrapper({ questions }: QuizWrapperProps) {
  return <Quiz questions={questions} onQuizComplete={() => {}} />
}
