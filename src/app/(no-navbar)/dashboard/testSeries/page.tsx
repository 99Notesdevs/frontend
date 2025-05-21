"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { env } from "@/config/env";
import Cookies from "js-cookie";

interface TestSeries {
  id: number
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
  createdAt: string
  updatedAt: string
  questionIds: number[]
}

export default function TestSeriesPage() {
  const router = useRouter()
  const [testSeriesList, setTestSeriesList] = useState<TestSeries[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestSeries = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${env.API_TEST}/testSeries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch test series");
      }
      
      const { data } = await response.json();
      setTestSeriesList(data)
    } catch (error) {
      console.error("Error fetching test series:", error);
      setError("Failed to load test series")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this test series?')) {
      return
    }

    try {
      const token = Cookies.get("token");
      const response = await fetch(`${env.API_TEST}/testSeries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        setTestSeriesList(prev => prev.filter(ts => ts.id !== id))
      } else {
        console.error('Failed to delete test series')
      }
    } catch (error) {
      console.error('Error deleting test series:', error)
    }
  }

  useEffect(() => {
    fetchTestSeries()
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Test Series</h1>
            <p className="text-gray-600">Manage and create your test series</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/addtestSeries')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Test Series
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : testSeriesList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No test series yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new test series.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.push('/dashboard/addtestSeries')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Test Series
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testSeriesList.map((testSeries) => (
              <div key={testSeries.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">{testSeries.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/addtestSeries/${testSeries.id}`)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(testSeries.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {testSeries.questionsSingle + testSeries.questionsMultiple} total questions
                  </p>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Single Choice</p>
                      <p className="text-lg font-semibold text-gray-900">{testSeries.questionsSingle}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Multiple Choice</p>
                      <p className="text-lg font-semibold text-gray-900">{testSeries.questionsMultiple}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Created</span>
                      <span className="font-medium text-gray-900">
                        {new Date(testSeries.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Last Updated</span>
                      <span className="font-medium text-gray-900">
                        {new Date(testSeries.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}