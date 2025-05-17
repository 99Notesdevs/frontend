"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TestForm from '@/components/testUtils/testForm'
import CategorySelect from '@/components/testUtils/CategorySelect'
import GetQuestions from '@/components/testUtils/getquestions'
import { env } from "@/config/env";
import Cookies from "js-cookie";

interface TestSeriesData {
  name: string
  correctAttempted: number
  wrongAttempted: number
  notAttempted: number
  partialAttempted: number
  partialNotAttempted: number
  partialWrongAttempted: number
  timeTaken: number
  questionsSingle: number
  questionsMultiple: number
  questionIds: number[]
}

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  categoryId: number;
}

export default function AddTestSeries() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [testSeriesData, setTestSeriesData] = useState<TestSeriesData>({
    name: '',
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
  })
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const fetchQuestions = async (categoryId: number, page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const token = Cookies.get("token")
      
      const url = `${env.API_TEST}/questions?categoryId=${categoryId}&limit=${pageSize}&page=${page}`
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch questions");
      
      const { data, total } = await response.json();
      
      // If this is the first page or switching categories, reset questions
      if (page === 1) {
        setQuestions(data)
      } else {
        setQuestions(prev => [...prev, ...data])
      }
      
      setHasMore(total > (page * pageSize))
      setCurrentPage(page)
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions")
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId)
    // Only update testSeriesData.categoryId, keep the selected question IDs
    setTestSeriesData(prev => ({
      ...prev,
      categoryId
    }))
    setCurrentPage(1)
    setHasMore(true)
    fetchQuestions(categoryId, 1)
  }

  useEffect(() => {
    if (testSeriesData.questionIds.length > 0) {
      setSelectedQuestionIds(testSeriesData.questionIds)
    }
  }, [testSeriesData.questionIds])

  const handleLoadMore = async () => {
    if (loading || !hasMore) return

    try {
      setLoading(true)
      const nextPage = currentPage + 1
      await fetchQuestions(selectedCategory || 0, nextPage)
    } catch (error) {
      console.error("Error loading more questions:", error)
      setError("Failed to load more questions")
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestionIds(prev => {
      const newIds = [...prev]
      const index = newIds.indexOf(questionId)
      if (index === -1) {
        newIds.push(questionId)
      } else {
        newIds.splice(index, 1)
      }
      
      // Update testSeriesData with new question IDs
      setTestSeriesData(prev => ({
        ...prev,
        questionIds: newIds,
        questionsSingle: newIds.length,
        questionsMultiple: 0
      }))
      
      return newIds
    })
  }

  const handleSubmit = async (data: TestSeriesData) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${env.API_TEST}/testSeries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
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
        })
      })

      if (response.ok) {
        // Reset form and selected questions after successful submission
        setTestSeriesData({
          name: '',
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
        })
        setSelectedQuestionIds([])
        router.push('/dashboard/testSeries')
      } else {
        const errorData = await response.json()
        console.error('Failed to create test series:', errorData)
        alert(errorData.message || 'Failed to create test series')
      }
    } catch (error) {
      console.error('Error creating test series:', error)
      alert('An error occurred while creating the test series')
    }
  }

  const handleBack = () => {
    // Reset form and selected questions when going back
    setTestSeriesData({
      name: '',
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
    })
    setSelectedQuestionIds([])
    router.push('/dashboard/testSeries')
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0e7ef] py-10 px-2 md:px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center [color:var(--admin-bg-dark)] drop-shadow-sm tracking-tight">
            Create Test Series
          </h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Back to List
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-14 space-y-10 scale-105 mx-auto mt-5">
          {/* Category Selection */}
          <CategorySelect
            selectedCategoryId={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Questions Selection */}
          <div>
            <h2 className="text-xl font-bold [color:var(--admin-bg-dark)] mb-4">Available Questions</h2>
            <GetQuestions
              categoryId={selectedCategory}
              questions={questions}
              hasMore={hasMore}
              loading={loading}
              error={error}
              onLoadMore={handleLoadMore}
              onQuestionSelect={handleQuestionSelect}
              selectedQuestionIds={selectedQuestionIds} // Pass the selectedQuestionIds state
            />
          </div>

          {/* Test Series Form */}
          <TestForm
            initialData={testSeriesData}
            onSubmit={handleSubmit}
            onCancel={handleBack}
          />
        </div>
      </div>
    </div>
  )
}