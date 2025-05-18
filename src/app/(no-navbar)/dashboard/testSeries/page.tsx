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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0e7ef] py-10 px-2 md:px-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center [color:var(--admin-bg-dark)] drop-shadow-sm tracking-tight">
            Test Series Management
          </h1>
          <button
            onClick={() => router.push('/dashboard/addtestSeries')}
            className="px-6 py-2 text-base font-semibold rounded bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            Create New Test Series
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-14">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Questions</th>
                    <th className="py-3 px-6">Created At</th>
                    <th className="py-3 px-6">Updated At</th>
                    <th className="py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testSeriesList.map((testSeries) => (
                    <tr key={testSeries.id} className="border-b border-gray-200">
                      <td className="py-4 px-6">{testSeries.name}</td>
                      <td className="py-4 px-6">
                        {testSeries.questionsSingle} Single + {testSeries.questionsMultiple} Multiple
                      </td>
                      <td className="py-4 px-6">{new Date(testSeries.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6">{new Date(testSeries.updatedAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/addtestSeries/${testSeries.id}`)}
                            className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(testSeries.id)}
                            className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}