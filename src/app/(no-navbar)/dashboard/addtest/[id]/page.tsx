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

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  type: 'success' | 'error'
}

const Modal = ({ isOpen, onClose, message, type }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {type === 'success' ? (
              <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <h2 className={`text-lg font-semibold ${type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {type === 'success' ? 'Success' : 'Error'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 text-center mb-4">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-2 px-4 rounded-lg ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} hover:opacity-90 transition-opacity`}
        >
          {type === 'success' ? 'Continue' : 'Close'}
        </button>
      </div>
    </div>
  )
}

export default function EditTest() {
  const router = useRouter()
  const params = useParams()
  const [testData, setTestData] = useState<TestFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [modalType, setModalType] = useState<'success' | 'error'>('error')

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
        const data = await response.json()
        setTestData(data)
      } catch (error) {
        console.error('Error fetching test:', error)
        router.push('/dashboard/testForms')
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [params.id, router])

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
      
      setModalMessage('Test updated successfully!')
      setModalType('success')
      setShowModal(true)
      
      const timer = setTimeout(() => {
        router.push('/dashboard/testForms')
      }, 2000)
      
      return Promise.resolve()
    } catch (error) {
      console.error('Error:', error)
      setModalMessage('Failed to update test')
      setModalType('error')
      setShowModal(true)
      return Promise.reject(error)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    if (modalType === 'success') {
      router.push('/dashboard/testForms')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading test details...</p>
            </div>
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
