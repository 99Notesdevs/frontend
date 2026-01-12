"use client";

import {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Add global styles for Tiptap editors in FAQ
const faqEditorStyles = `
  .faq-tiptap-container {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background: white;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    overflow: hidden;
  }
  
  .faq-tiptap-container:focus-within {
    border-color: #818cf8;
    box-shadow: 0 0 0 1px #818cf8;
  }
  
  .faq-tiptap-container .ProseMirror {
    min-height: 100px;
    max-height: 200px;
    overflow-y: auto;
    padding: 0.75rem;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: #1f2937;
    outline: none;
  }
  
  .faq-tiptap-container .ProseMirror > * + * {
    margin-top: 0.75em;
  }
  
  .faq-tiptap-container .ProseMirror p {
    margin: 0.25em 0;
  }
  
  .faq-tiptap-container .ProseMirror h1,
  .faq-tiptap-container .ProseMirror h2,
  .faq-tiptap-container .ProseMirror h3 {
    margin: 1em 0 0.5em 0;
    line-height: 1.3;
  }
  
  .faq-tiptap-container .ProseMirror ul,
  .faq-tiptap-container .ProseMirror ol {
    padding: 0 1.25em;
    margin: 0.5em 0;
  }
  
  /* Custom scrollbar */
  .faq-tiptap-container .ProseMirror::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .faq-tiptap-container .ProseMirror::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .faq-tiptap-container .ProseMirror::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  .faq-tiptap-container .ProseMirror::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;
const TiptapEditor = dynamic(
  () => import("@/components/ui/tiptapeditor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    ),
  }
);

interface SubQuestion {
  id: string;
  question: string;
  answer: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  subQuestions: SubQuestion[];
}

export interface FAQEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

export interface FAQEditorRef {
  reset: () => void;
}

export const FAQEditor = forwardRef<FAQEditorRef, FAQEditorProps>(
  ({ value, onChange }, ref) => {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [isAdding, setIsAdding] = useState<{ [key: string]: boolean }>({});

    // Expose reset method to parent
    useImperativeHandle(ref, () => ({
      reset: () => {
        setFaqs([]);
        setIsAdding({});
      },
    }));

    // Parse the initial value
    useEffect(() => {
      if (value) {
        try {
          const parsed = JSON.parse(value);
          if (parsed && parsed.general && Array.isArray(parsed.general)) {
            // Add IDs to items if they don't exist
            const faqData = parsed.general.map((item: any) => ({
              ...item,
              id:
                item.id ||
                `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              subQuestions: (item.subQuestions || []).map((sub: any) => ({
                ...sub,
                id:
                  sub.id ||
                  `sub_${Date.now()}_${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
              })),
            }));
            setFaqs(faqData);
          } else {
            setFaqs([]);
          }
        } catch (error) {
          console.error("Failed to parse FAQ data", error);
          setFaqs([]);
        }
      } else {
        setFaqs([]);
      }
    }, [value]);

    // Update the parent form when FAQs change
    useEffect(() => {
      const faqData = { general: faqs };
      const jsonString = JSON.stringify(faqData);
      onChange(jsonString);
    }, [faqs, onChange]);

    const addFAQ = useCallback(() => {
      const newFAQ = {
        id: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        question: "",
        answer: "",
        subQuestions: [],
      };
      setFaqs((prev) => [...prev, newFAQ]);
    }, []);

    const addSubQuestion = useCallback(
      (parentId: string) => {
        if (isAdding[parentId]) return;

        setIsAdding((prev) => ({ ...prev, [parentId]: true }));

        setFaqs((prev) =>
          prev.map((item) =>
            item.id === parentId
              ? {
                  ...item,
                  subQuestions: [
                    ...item.subQuestions,
                    {
                      id: `sub_${Date.now()}_${Math.random()
                        .toString(36)
                        .substr(2, 9)}`,
                      question: "",
                      answer: "",
                    },
                  ],
                }
              : item
          )
        );

        setTimeout(() => {
          setIsAdding((prev) => ({ ...prev, [parentId]: false }));
        }, 300);
      },
      [isAdding]
    );

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

    const deleteFAQ = useCallback(
      (id: string, isSubQuestion = false, parentId?: string) => {
        setFaqs((prev) =>
          isSubQuestion && parentId
            ? prev.map((item) => ({
                ...item,
                subQuestions: item.subQuestions.filter((sub) => sub.id !== id),
              }))
            : prev.filter((item) => item.id !== id)
        );
      },
      []
    );

    return (
      <div className="space-y-4">
        <div className="space-y-4">
          {faqs.length > 0 ? (
            faqs.map((item, index) => (
              <div key={item.id} className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">
                      {index + 1}.
                    </span>
                    <div className="space-y-1 w-full">
                      <div className="text-xs font-medium text-gray-500 ml-1">Question</div>
                      <div className="h-[200px] overflow-hidden">
                        <TiptapEditor
                          content={item.question}
                          onChange={(value) => {
                            setFaqs((prev) =>
                              prev.map((faq) =>
                                faq.id === item.id
                                  ? { ...faq, question: value }
                                  : faq
                              )
                            );
                          }}
                        />
                      </div>
                    </div>{" "}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFAQ(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500 ml-1">Answer</div>
                    <div className="faq-tiptap-container">
                      <style jsx global>{faqEditorStyles}</style>
                      <TiptapEditor
                        content={item.answer}
                        onChange={(value) => {
                          setFaqs((prev) =>
                            prev.map((faq) =>
                              faq.id === item.id ? { ...faq, answer: value } : faq
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
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
                        <div
                          key={subItem.id}
                          className="space-y-3 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition-shadow"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {subIndex + 1}.
                            </span>
                            <div className="space-y-1 flex-1">
                              <div className="text-xs font-medium text-gray-500 ml-1">Question</div>
                              <div className="faq-tiptap-container">
                                <TiptapEditor
                                  content={subItem.question}
                                  onChange={(value) => {
                                    setFaqs((prev) =>
                                      prev.map((faq) =>
                                        faq.id === item.id
                                          ? {
                                              ...faq,
                                              subQuestions: faq.subQuestions.map(
                                                (sub) =>
                                                  sub.id === subItem.id
                                                    ? { ...sub, question: value }
                                                    : sub
                                              ),
                                            }
                                          : faq
                                      )
                                    );
                                  }}
                                />
                              </div>
                            </div>{" "}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteFAQ(subItem.id, true, item.id)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                          <div className="space-y-1 mt-2 ml-6">
                            <div className="text-xs font-medium text-gray-500 ml-1">Answer</div>
                            <div className="faq-tiptap-container">
                              <TiptapEditor
                                content={subItem.answer}
                                onChange={(value) => {
                                  setFaqs((prev) =>
                                    prev.map((faq) =>
                                      faq.id === item.id
                                        ? {
                                            ...faq,
                                            subQuestions: faq.subQuestions.map(
                                              (sub) =>
                                                sub.id === subItem.id
                                                  ? { ...sub, answer: value }
                                                  : sub
                                            ),
                                          }
                                        : faq
                                    )
                                  );
                                }}
                              />
                            </div>
                          </div>
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

        <Button
          type="button"
          variant="outline"
          onClick={addFAQ}
          className="w-full bg-transparent"
        >
          <Plus size={16} className="mr-2" /> Add Question
        </Button>
      </div>
    );
  }
);

FAQEditor.displayName = "FAQEditor";

export default FAQEditor;
