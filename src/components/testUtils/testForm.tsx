"use client"

import { useState } from 'react'
import { env } from "@/config/env";
import Cookies from "js-cookie";
import CategorySelect from './CategorySelect';
import ShowQuestions from './showquestions';

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
  id?: number
}

interface TestFormProps {
  initialData?: TestSeriesData
  onSubmit: (data: TestSeriesData) => Promise<void>
  onCancel?: () => void
  questionIds?: number[]
  mode?: 'add' | 'edit'
}

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
}

interface SimpleTestFormProps {
  initialData?: TestFormData
  onSubmit: (data: TestFormData) => Promise<void>
  onCancel?: () => void
}

export default function TestForm({ initialData, onSubmit, onCancel, questionIds, mode = 'add' }: TestFormProps) {
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
    questionIds: questionIds || [],
    ...(initialData || {})
  })

  const handleInputChange = (field: keyof TestSeriesData, value: any) => {
    setTestSeriesData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(testSeriesData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold [color:var(--admin-bg-dark)] mb-4">Test Series Information</h2>
        <div className="space-y-6">
          <div>
            <label className="block mb-1 [color:var(--admin-bg-dark)] font-semibold">
              Test Series Name
            </label>
            <input
              type="text"
              value={testSeriesData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              placeholder="Enter test series name"
            />
          </div>

          <div>
            <label className="block mb-1 [color:var(--admin-bg-dark)] font-semibold">
              Total Time (minutes)
            </label>
            <input
              type="number"
              value={testSeriesData.timeTaken}
              onChange={(e) => handleInputChange('timeTaken', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              placeholder="Enter total time"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 [color:var(--admin-bg-dark)] font-semibold">
                Single Choice Questions
              </label>
              <input
                type="number"
                value={testSeriesData.questionsSingle}
                onChange={(e) => handleInputChange('questionsSingle', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="Enter number of single choice questions"
              />
            </div>
            <div>
              <label className="block mb-1 [color:var(--admin-bg-dark)] font-semibold">
                Multiple Choice Questions
              </label>
              <input
                type="number"
                value={testSeriesData.questionsMultiple}
                onChange={(e) => handleInputChange('questionsMultiple', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="Enter number of multiple choice questions"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold [color:var(--admin-bg-dark)] mb-4">Marking Scheme</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 [color:var(--admin-bg-dark)] font-semibold">
              Marks for Correct Answer
            </label>
            <input
              type="number"
              value={testSeriesData.correctAttempted}
              onChange={(e) => handleInputChange('correctAttempted', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              placeholder="Enter marks for correct answer"
            />
          </div>
          <div>
            <label className="block mb-1 [color:var(--admin-bg-dark)] font-semibold">
              Marks for Wrong Answer
            </label>
            <input
              type="number"
              value={testSeriesData.wrongAttempted}
              onChange={(e) => handleInputChange('wrongAttempted', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              placeholder="Enter marks for wrong answer"
            />
          </div>
          <div>
            <label className="block mb-1 [color:var(--admin-bg-dark)] font-semibold">
              Marks for Not Attempted
            </label>
            <input
              type="number"
              value={testSeriesData.notAttempted}
              onChange={(e) => handleInputChange('notAttempted', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              placeholder="Enter marks for not attempted"
            />
          </div>
          <div>
            <label className="block mb-1 [color:var(--admin-bg-dark)] font-semibold">
              Marks for Partial Attempt
            </label>
            <input
              type="number"
              value={testSeriesData.partialAttempted}
              onChange={(e) => handleInputChange('partialAttempted', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              placeholder="Enter marks for partial attempt"
            />
          </div>
          <div>
            <label className="block mb-1 [color:var(--admin-bg-dark)] font-semibold">
              Marks for Partial Not Attempted
            </label>
            <input
              type="number"
              value={testSeriesData.partialNotAttempted}
              onChange={(e) => handleInputChange('partialNotAttempted', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              placeholder="Enter marks for partial not attempted"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-base font-semibold rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 text-base font-semibold rounded bg-slate-600 hover:bg-slate-700 text-white transition"
        >
          {mode === 'edit' ? 'Update Test Series' : 'Create Test Series'}
        </button>
      </div>
    </form>
  )
}

export function SimpleTestForm({ initialData, onSubmit, onCancel }: SimpleTestFormProps) {
  const [formData, setFormData] = useState<TestFormData>({
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
    ...(initialData || {})
  })

  const handleInputChange = (field: keyof TestFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Correct Attempted</label>
          <input
            type="number"
            name="correctAttempted"
            value={formData.correctAttempted}
            onChange={(e) => handleInputChange('correctAttempted', parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Wrong Attempted</label>
          <input
            type="number"
            name="wrongAttempted"
            value={formData.wrongAttempted}
            onChange={(e) => handleInputChange('wrongAttempted', parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Not Attempted</label>
          <input
            type="number"
            name="notAttempted"
            value={formData.notAttempted}
            onChange={(e) => handleInputChange('notAttempted', parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Partial Attempted</label>
          <input
            type="number"
            name="partialAttempted"
            value={formData.partialAttempted}
            onChange={(e) => handleInputChange('partialAttempted', parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Partial Not Attempted</label>
          <input
            type="number"
            name="partialNotAttempted"
            value={formData.partialNotAttempted}
            onChange={(e) => handleInputChange('partialNotAttempted', parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Partial Wrong Attempted</label>
          <input
            type="number"
            name="partialWrongAttempted"
            value={formData.partialWrongAttempted}
            onChange={(e) => handleInputChange('partialWrongAttempted', parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time Taken (seconds)</label>
          <input
            type="number"
            name="timeTaken"
            value={formData.timeTaken}
            onChange={(e) => handleInputChange('timeTaken', parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Single Questions</label>
          <input
            type="number"
            name="questionsSingle"
            value={formData.questionsSingle}
            onChange={(e) => handleInputChange('questionsSingle', parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Multiple Questions</label>
          <input
            type="number"
            name="questionsMultiple"
            value={formData.questionsMultiple}
            onChange={(e) => handleInputChange('questionsMultiple', parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  )
}