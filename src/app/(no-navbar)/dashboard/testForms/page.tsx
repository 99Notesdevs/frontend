"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { env } from "@/config/env"
import Cookies from "js-cookie"
import Link from 'next/link'

interface TestFormData {
  id: number
  name: string
  correctAttempted: number
  wrongAttempted: number
  notAttempted: number
  partialAttempted?: number
  partialNotAttempted?: number
  partialWrongAttempted?: number
  timeTaken: number
  questionsSingle: number
  questionsMultiple?: number
  createdAt: string
  updatedAt: string
}

export default function TestForms() {
  const router = useRouter()
  const [tests, setTests] = useState<TestFormData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = Cookies.get("token")
        const response = await fetch(`${env.API_TEST}/test`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Failed to fetch tests')
        const data = await response.json()
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setTests(data)
        } else {
          console.error('Invalid response format:', data)
          throw new Error('Invalid response format from server')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Failed to fetch tests')
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="bg-gray-200 rounded p-6">
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Forms</h1>
        <Link href="/dashboard/addtest" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add New Test
        </Link>
      </div>

      {tests.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">
          No tests found
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wrong</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Not Attempted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Taken</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tests.map((test) => (
                <tr key={test.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{test.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{test.correctAttempted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{test.wrongAttempted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{test.notAttempted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{test.timeTaken} seconds</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/addtest/${test.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
