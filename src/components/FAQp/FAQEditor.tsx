"use client"

import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import TiptapEditor from "../ui/tiptapeditor"

interface SubQuestion {
  id: string
  question: string
  answer: string
}

interface FAQItem {
  id: string
  question: string
  answer: string
  subQuestions: SubQuestion[]
}

export interface FAQEditorProps {
  value?: string
  onChange: (value: string) => void
}

export interface FAQEditorRef {
  reset: () => void
}

export const FAQEditor = forwardRef<FAQEditorRef, FAQEditorProps>(({ value, onChange }, ref) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [isAdding, setIsAdding] = useState<{ [key: string]: boolean }>({})

  // Expose reset method to parent
  useImperativeHandle(ref, () => ({
    reset: () => {
      setFaqs([])
      setIsAdding({})
    },
  }))

  // Parse the initial value
  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value)
        if (parsed && parsed.general && Array.isArray(parsed.general)) {
          // Add IDs to items if they don't exist
          const faqData = parsed.general.map((item: any) => ({
            ...item,
            id: item.id || `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            subQuestions: (item.subQuestions || []).map((sub: any) => ({
              ...sub,
              id: sub.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            })),
          }))
          setFaqs(faqData)
        } else {
          setFaqs([])
        }
      } catch (error) {
        console.error("Failed to parse FAQ data", error)
        setFaqs([])
      }
    } else {
      setFaqs([])
    }
  }, [value])

  // Update the parent form when FAQs change
  useEffect(() => {
    const faqData = { general: faqs }
    const jsonString = JSON.stringify(faqData)
    onChange(jsonString)
  }, [faqs, onChange])

  const addFAQ = useCallback(() => {
    const newFAQ = {
      id: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: "",
      answer: "",
      subQuestions: [],
    }
    setFaqs((prev) => [...prev, newFAQ])
  }, [])

  const addSubQuestion = useCallback(
    (parentId: string) => {
      if (isAdding[parentId]) return

      setIsAdding((prev) => ({ ...prev, [parentId]: true }))

      setFaqs((prev) =>
        prev.map((item) =>
          item.id === parentId
            ? {
                ...item,
                subQuestions: [
                  ...item.subQuestions,
                  {
                    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    question: "",
                    answer: "",
                  },
                ],
              }
            : item,
        ),
      )

      setTimeout(() => {
        setIsAdding((prev) => ({ ...prev, [parentId]: false }))
      }, 300)
    },
    [isAdding],
  )

  // const updateFAQ = useCallback(
  //   (id: string, field: "question" | "answer", value: string, isSubQuestion = false, subId?: string) => {
  //     setFaqs((prev) =>
  //       isSubQuestion && subId
  //         ? prev.map((item) => ({
  //             ...item,
  //             subQuestions: item.subQuestions.map((sub) => (sub.id === subId ? { ...sub, [field]: value } : sub)),
  //           }))
  //         : prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
  //     )
  //   },
  //   [],
  // )

  const deleteFAQ = useCallback((id: string, isSubQuestion = false, parentId?: string) => {
    setFaqs((prev) =>
      isSubQuestion && parentId
        ? prev.map((item) => ({
            ...item,
            subQuestions: item.subQuestions.filter((sub) => sub.id !== id),
          }))
        : prev.filter((item) => item.id !== id),
    )
  }, [])

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {faqs.length > 0 ? (
          faqs.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 bg-white">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className ="font-medium text-gray-700">{index + 1}.</span>
                  <TiptapEditor 
                    content={item.question} 
                    onChange={(value) => {
                      setFaqs(prev => 
                        prev.map(faq => 
                          faq.id === item.id 
                            ? { ...faq, question: value } 
                            : faq
                        )
                      );
                    }} 
                  />                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFAQ(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <TiptapEditor 
                    content={item.answer} 
                    onChange={(value) => {
                      setFaqs(prev => 
                        prev.map(faq => 
                          faq.id === item.id 
                            ? { ...faq, answer: value } 
                            : faq
                        )
                      );
                    }} 
                  />
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSubQuestion(item.id)}
                    className="text-sm"
                    disabled={isAdding[item.id]}
                  >
                    <Plus size={14} className="mr-1" />
                    {isAdding[item.id] ? "Adding..." : "Add Sub-question"}
                  </Button>
                </div>

                {item.subQuestions.length > 0 && (
                  <div className="mt-3 ml-6 space-y-3 border-l-2 border-gray-100 pl-4">
                    {item.subQuestions.map((subItem, subIndex) => (
                      <div key={subItem.id} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{subIndex + 1}.</span>
                          <TiptapEditor 
                            content={subItem.question} 
                            onChange={(value) => {
                              setFaqs(prev => 
                                prev.map(faq => 
                                  faq.id === item.id
                                    ? {
                                        ...faq,
                                        subQuestions: faq.subQuestions.map(sub => 
                                          sub.id === subItem.id 
                                            ? { ...sub, question: value } 
                                            : sub
                                        )
                                      }
                                    : faq
                                )
                              );
                            }} 
                          />                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFAQ(subItem.id, true, item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        <TiptapEditor 
                            content={subItem.answer} 
                            onChange={(value) => {
                              setFaqs(prev => 
                                prev.map(faq => 
                                  faq.id === item.id
                                    ? {
                                        ...faq,
                                        subQuestions: faq.subQuestions.map(sub => 
                                          sub.id === subItem.id 
                                            ? { ...sub, answer: value } 
                                            : sub
                                        )
                                      }
                                    : faq
                                )
                              );
                            }} 
                          />                      
                          </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 rounded-lg border-2 border-dashed">
            No questions added yet. Click the button below to add one.
          </div>
        )}
      </div>

      <Button type="button" variant="outline" onClick={addFAQ} className="w-full bg-transparent">
        <Plus size={16} className="mr-2" /> Add Question
      </Button>
    </div>
  )
})

FAQEditor.displayName = "FAQEditor"

export default FAQEditor
