interface Question {
  id: number;
  question: string;
  answer: string;
  options: string[];
  explaination: string;
  creatorName: string;
  pyq: boolean;
  multipleCorrectType: boolean;
  year: number | null;
  acceptance: number | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
}

interface SelectedQuestionsProps {
  questions: Question[];
  onQuestionRemove: (questionId: number) => void;
}

export default function SelectedQuestions({
  questions,
  onQuestionRemove,
}: SelectedQuestionsProps) {
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No questions selected
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div
          key={question.id}
          className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
        >
          <div>
            <p className="font-semibold text-[#0f172a]">{question.question}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {question.options.map((opt, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-gray-200 text-[#0f172a] text-xs font-medium"
                >
                  {opt}
                </span>
              ))}
            </div>
            {question.explaination && (
              <div className="mt-2 text-sm text-gray-600">
                {question.explaination}
              </div>
            )}
          </div>
          <button
            onClick={() => onQuestionRemove(question.id)}
            className="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
