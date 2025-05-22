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
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test series data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0e7ef] py-10 px-2 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push('/dashboard/testSeries')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Edit Test Series</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Test Series Details</h2>
              <TestForm
                initialData={testSeriesData}
                onSubmit={handleSubmit}
                mode="edit"
              />
            </div>
          </div>

          {/* Right Column - Questions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Questions</h2>
              <p className="text-gray-600 mb-6">Choose a category to view and select questions for your test series.</p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <CategorySelect
                  selectedCategoryId={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>

              {availableQuestions.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Available Questions</h3>
                  <div className="space-y-4">
                    {availableQuestions.map((question) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="mb-3">
                          <h3 className="font-medium text-gray-800">{question.question}</h3>
                        </div>
                        <div className="space-y-2 mb-4">
                          {question.options?.map((opt: any, index: any) => (
                            <div key={index} className="flex items-start">
                              <span className="text-gray-600 mr-2">{String.fromCharCode(65 + index)}.</span>
                              <span className="text-gray-700">{opt}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => handleQuestionSelect(question.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedQuestionIds.includes(question.id)
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {selectedQuestionIds.includes(question.id) ? 'Remove from Test' : 'Add to Test'}
                          {selectedQuestionIds.includes(question.id) ? (
                            <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedCategory ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No questions available</h3>
                  <p className="mt-1 text-sm text-gray-500">There are no questions in this category yet.</p>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No category selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a category to view available questions</p>
                </div>
              )}
            </div>
            
            {/* Selected Questions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Selected Questions</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {selectedQuestionIds.length} selected
                </span>
              </div>
              
              {selectedQuestionIds.length > 0 ? (
                <SelectedQuestions
                  questions={testSeriesData.questions || []}
                  onQuestionRemove={handleQuestionRemove}
                />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No questions selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select questions from the list above to add them to your test series.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}