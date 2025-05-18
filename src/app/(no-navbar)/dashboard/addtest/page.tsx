"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function AddTest() {
  const router = useRouter()

  const handleSubmit = async (data: TestFormData) => {
    try {
      const token = Cookies.get("token")
      const response = await fetch(`${env.API_TEST}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to create test')
      router.push('/dashboard/testForms')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create test')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Test</h1>
      <SimpleTestForm
        onSubmit={handleSubmit}
        initialData={{
          name: '',
          correctAttempted: 0,
          wrongAttempted: 0,
          notAttempted: 0,
          partialAttempted: 0,
          partialNotAttempted: 0,
          partialWrongAttempted: 0,
          timeTaken: 0,
          questionsSingle: 0,
          questionsMultiple: 0
        }}
      />
    </div>
  )
}
