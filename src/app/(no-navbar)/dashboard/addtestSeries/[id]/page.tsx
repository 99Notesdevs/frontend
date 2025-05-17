"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import TestForm from '@/components/testUtils/testForm'
import SelectedQuestions from '@/components/testUtils/selectedQuestions'
import CategorySelect from '@/components/testUtils/CategorySelect'
import { env } from "@/config/env"
import Cookies from "js-cookie"
import { TestSeriesData } from '@/types/testSeries'

export default function EditTestSeries() {
  const router = useRouter()
  const params = useParams()
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
    id: 0,
    questions: []
  })
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([])
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTestSeries()
  }, [])

  const fetchTestSeries = async () => {
    try {
      setIsLoading(true)
      const token = Cookies.get("token")
      const response = await fetch(`${env.API_TEST}/testSeries/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch test series")
      const { data } = await response.json()
      
      // Update test series data
      setTestSeriesData(data)
      
      // Set initial question IDs from existing questions
      if (data.questions && data.questions.length > 0) {
        const existingQuestionIds = data.questions.map((q: any) => q.id)
        setSelectedQuestionIds(existingQuestionIds)
      }
      
      // Set initial category
      if (data.questions && data.questions.length > 0) {
        const categoryIds = data.questions.map((q: any) => q.categoryId)
        const uniqueCategoryIds = [...new Set(categoryIds)]
        const categoryId = uniqueCategoryIds[0]
        setSelectedCategory(categoryId ? Number(categoryId) : null)
        
        // Fetch available questions for the category
        if (categoryId) {
          fetchAvailableQuestions(Number(categoryId))
        }
      }
    } catch (error) {
      console.error("Error fetching test series:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableQuestions = async (categoryId: number) => {
    try {
      const token = Cookies.get("token")
      const pageSize = 10
      const response = await fetch(`${env.API_TEST}/questions?categoryId=${categoryId}&limit=${pageSize}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) throw new Error("Failed to fetch questions")
      const { data } = await response.json()
      setAvailableQuestions(data)
    } catch (error) {
      console.error("Error fetching available questions:", error)
    }
  }

  const handleCategoryChange = async (categoryId: number) => {
    setSelectedCategory(categoryId)
    await fetchAvailableQuestions(categoryId)
  }

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestionIds(prev => {
      const currentIds = prev || []
      const newIds = Array.isArray(currentIds) ? [...currentIds] : []
      const index = newIds.indexOf(questionId)
      
      if (index === -1) {
        newIds.push(questionId)
      } else {
        newIds.splice(index, 1)
      }
      
      // Update testSeriesData with new question IDs
      setTestSeriesData(prev => {
        if (!prev) return {
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
          questionIds: newIds,
          id: 0,
          questions: []
        }
        
        return {
          ...prev,
          questionIds: newIds
        }
      })
      
      return newIds
    })
  }

  const handleQuestionRemove = (questionId: number) => {
    setSelectedQuestionIds(prev => {
      const currentIds = prev || []
      const newIds = Array.isArray(currentIds) ? currentIds.filter(id => id !== questionId) : []
      
      // Update testSeriesData with new question IDs
      setTestSeriesData(prev => {
        if (!prev) return {
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
          questionIds: newIds,
          id: 0,
          questions: []
        }
        
        return {
          ...prev,
          questionIds: newIds
        }
      })
      
      return newIds
    })
  }

  const handleSubmit = async (data: TestSeriesData) => {
    try {
      const token = Cookies.get("token")
      const response = await fetch(`${env.API_TEST}/testSeries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          correctAttempted: data.correctAttempted,
          wrongAttempted: data.wrongAttempted,
          notAttempted: data.notAttempted,
          partialAttempted: data.partialAttempted,
          partialNotAttempted: data.partialNotAttempted,
          partialWrongAttempted: data.partialWrongAttempted,
          timeTaken: data.timeTaken,
          questionIds: selectedQuestionIds
        })
      })

      if (response.ok) {
        router.push('/dashboard/testSeries')
      } else {
        console.error('Failed to update test series')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Edit Test Series</h1>

      {/* Category Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Select Category</h2>
        <CategorySelect
          selectedCategoryId={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Available Questions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Available Questions</h2>
        <div className="space-y-4">
          {availableQuestions.map((question) => (
            <div key={question.id} className="border rounded-lg p-4 mb-4">
              <div className="mb-2">
                <h3 className="font-semibold">{question.question}</h3>
              </div>
              <div className="space-y-2">
                {question.options?.map((opt: any, index: any) => (
                  <span key={index} className="block">
                    {opt}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleQuestionSelect(question.id)}
                className={`px-4 py-2 rounded ${
                  selectedQuestionIds.includes(question.id)
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {selectedQuestionIds.includes(question.id) ? 'Remove' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Questions */}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-4">Selected Questions</h2>
        <SelectedQuestions
          questions={testSeriesData.questions || []}
          onQuestionRemove={handleQuestionRemove}
        />
      </div>

      {/* Test Series Form */}
      <TestForm
        initialData={testSeriesData}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/dashboard/testSeries')}
      />
    </div>
  )
}