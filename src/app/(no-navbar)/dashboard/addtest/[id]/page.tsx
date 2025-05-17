"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { SimpleTestForm } from '@/components/testUtils/testForm'
import { env } from "@/config/env"
import Cookies from "js-cookie"

interface TestFormData {
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
  id?: number
}

export default function EditTest() {
  const router = useRouter()
  const params = useParams()
  const [testData, setTestData] = useState<TestFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = Cookies.get("token")
        const response = await fetch(`${env.API_TEST}/test/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Failed to fetch test')
        const { data } = await response.json()
        setTestData(data)
      } catch (error) {
        console.error('Error:', error)
        alert('Failed to fetch test')
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [params.id])

  const handleSubmit = async (data: TestFormData) => {
    try {
      const token = Cookies.get("token")
      const response = await fetch(`${env.API_TEST}/test/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to update test')
      router.push('/dashboard/testSeries')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update test')
    }
  }

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

  if (!testData) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Test</h1>
      <SimpleTestForm
        onSubmit={handleSubmit}
        initialData={testData}
      />
    </div>
  )
}
