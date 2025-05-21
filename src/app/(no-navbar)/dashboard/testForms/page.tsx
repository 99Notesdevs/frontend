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

export default function TestForms() {
  const router = useRouter()
  const [tests, setTests] = useState<TestFormData[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [modalType, setModalType] = useState<'success' | 'error'>('error')

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
        const testsData = await response.json()
        const data = testsData.data
        // Ensure data is an array
        if (Array.isArray(data)) {
          setTests(data)
        } else {
          console.error('Invalid response format:', data)
          throw new Error('Invalid response format from server')
        }
      } catch (error) {
        console.error('Error:', error)
        setModalMessage('Failed to fetch tests')
        setModalType('error')
        setShowModal(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this test?')) return

    try {
      const token = Cookies.get("token")
      const response = await fetch(`${env.API_TEST}/test/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete test')
      
      setTests(tests.filter(test => test.id !== id))
      setModalMessage('Test deleted successfully')
      setModalType('success')
      setShowModal(true)
    } catch (error) {
      console.error('Error:', error)
      setModalMessage('Failed to delete test')
      setModalType('error')
      setShowModal(true)
    }
  }

  const closeModal = () => {
    setShowModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading test forms...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Test Forms</h1>
            <Link
              href="/dashboard/addtest"
              className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Add New Test
            </Link>
          </div>

          {tests.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              No tests found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Correct
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wrong
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Not Attempted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tests.map((test) => (
                    <tr key={test.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {test.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {test.correctAttempted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {test.wrongAttempted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {test.notAttempted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {test.timeTaken} seconds
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/addtest/${test.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(test.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={showModal} onClose={closeModal} message={modalMessage} type={modalType} />
    </div>
  )
}
