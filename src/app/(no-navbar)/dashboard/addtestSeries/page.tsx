"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TestForm from "@/components/testUtils/testForm";
import CategorySelect from "@/components/testUtils/CategorySelect";
import GetQuestions from "@/components/testUtils/getquestions";
import { api } from "@/config/api/route";

interface TestSeriesData {
  name: string;
  correctAttempted: number;
  wrongAttempted: number;
  notAttempted: number;
  partialAttempted: number;
  partialNotAttempted: number;
  partialWrongAttempted: number;
  timeTaken: number;
  questionsSingle: number;
  questionsMultiple: number;
  questionIds: number[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  categoryId: number;
}

export default function AddTestSeries() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [testSeriesData, setTestSeriesData] = useState<TestSeriesData>({
    name: "",
    correctAttempted: 0,
    wrongAttempted: 0,
    notAttempted: 0,
    partialAttempted: 0,
    partialNotAttempted: 0,
    partialWrongAttempted: 0,
    timeTaken: 0,
    questionsSingle: 0,
    questionsMultiple: 0,
    questionIds: [],
  });
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchQuestions = async (categoryId: number, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const url = `/questions?categoryId=${categoryId}&limit=${pageSize}&page=${page}`;

      const response = (await api.get(url)) as {
        data: { data: Question[]; total: number };
      };

      const { data, total } = response.data;

      // If this is the first page or switching categories, reset questions
      if (page === 1) {
        setQuestions(data);
      } else {
        setQuestions((prev) => [...prev, ...data]);
      }

      setHasMore(total > page * pageSize);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // Only update testSeriesData.categoryId, keep the selected question IDs
    setTestSeriesData((prev) => ({
      ...prev,
      categoryId,
    }));
    setCurrentPage(1);
    setHasMore(true);
    fetchQuestions(categoryId, 1);
  };

  useEffect(() => {
    if (testSeriesData.questionIds.length > 0) {
      setSelectedQuestionIds(testSeriesData.questionIds);
    }
  }, [testSeriesData.questionIds]);

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      await fetchQuestions(selectedCategory || 0, nextPage);
    } catch (error) {
      console.error("Error loading more questions:", error);
      setError("Failed to load more questions");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestionIds((prev) => {
      const newIds = [...prev];
      const index = newIds.indexOf(questionId);
      if (index === -1) {
        newIds.push(questionId);
      } else {
        newIds.splice(index, 1);
      }

      // Update testSeriesData with new question IDs
      setTestSeriesData((prev) => ({
        ...prev,
        questionIds: newIds,
        questionsSingle: newIds.length,
        questionsMultiple: 0,
      }));

      return newIds;
    });
  };

  const handleSubmit = async (data: TestSeriesData) => {
    try {
      const response = (await api.post(`/testSeries`, {
        name: data.name,
        timeTaken: data.timeTaken,
        correctAttempted: data.correctAttempted,
        wrongAttempted: data.wrongAttempted,
        notAttempted: data.notAttempted,
        partialAttempted: data.partialAttempted,
        partialNotAttempted: data.partialNotAttempted,
        partialWrongAttempted: data.partialWrongAttempted,
        questionsSingle: data.questionsSingle,
        questionsMultiple: data.questionsMultiple,
        questionIds: selectedQuestionIds,
      })) as { success: boolean; data: any };

      if (response.success === true) {
        // Reset form and selected questions after successful submission
        setTestSeriesData({
          name: "",
          correctAttempted: 0,
          wrongAttempted: 0,
          notAttempted: 0,
          partialAttempted: 0,
          partialNotAttempted: 0,
          partialWrongAttempted: 0,
          timeTaken: 0,
          questionsSingle: 0,
          questionsMultiple: 0,
          questionIds: [],
        });
        setSelectedQuestionIds([]);
        router.push("/dashboard/testSeries");
      } else {
        const errorData = response.data;
        console.error("Failed to create test series:", errorData);
        alert(errorData.message || "Failed to create test series");
      }
    } catch (error) {
      console.error("Error creating test series:", error);
      alert("An error occurred while creating the test series");
    }
  };

  const handleBack = () => {
    // Reset form and selected questions when going back
    setTestSeriesData({
      name: "",
      correctAttempted: 0,
      wrongAttempted: 0,
      notAttempted: 0,
      partialAttempted: 0,
      partialNotAttempted: 0,
      partialWrongAttempted: 0,
      timeTaken: 0,
      questionsSingle: 0,
      questionsMultiple: 0,
      questionIds: [],
    });
    setSelectedQuestionIds([]);
    router.push("/dashboard/testSeries");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0e7ef] py-10 px-2 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Create New Test Series
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Test Series Details
              </h2>
              <TestForm
                initialData={testSeriesData}
                onSubmit={handleSubmit}
                mode="add"
              />
            </div>
          </div>

          {/* Right Column - Questions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Select Questions
              </h2>
              <p className="text-gray-600 mb-6">
                Choose a category to view and select questions for your test
                series.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <CategorySelect
                  selectedCategoryId={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>

              {error && (
                <div
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r"
                  role="alert"
                >
                  <p className="font-medium">Error loading questions</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {selectedCategory ? (
                <>
                  <div className="space-y-4">
                    <GetQuestions
                      questions={questions}
                      selectedQuestionIds={selectedQuestionIds}
                      onQuestionSelect={handleQuestionSelect}
                      loading={loading}
                      hasMore={hasMore}
                      onLoadMore={handleLoadMore}
                      categoryId={selectedCategory}
                    />
                  </div>

                  {loading && (
                    <div className="flex justify-center my-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}

                  {hasMore && !loading && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handleLoadMore}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <span>Load More Questions</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No category selected
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a category to view available questions
                  </p>
                </div>
              )}
            </div>

            {/* Selected Questions Summary */}
            {selectedQuestionIds.length > 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">
                        {selectedQuestionIds.length} questions
                      </span>{" "}
                      selected for this test series.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
