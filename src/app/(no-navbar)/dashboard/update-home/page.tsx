"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import StudyMaterials from "@/components/StudyMaterials/Studymaterials";
import CurrentAffairs from "@/components/CurrentAffairs/CurrentAffairs";
import CoachingInfo from "@/components/CoachingInfo/CoachingInfo";
import FAQ from "@/components/common/FAQ/FAQ";
import Reason99notes from "@/components/CoachingInfo/Reason99notes";
import { api } from "@/config/api/route";
import Cookies from "js-cookie";

interface CommonSection {
  title: string;
  description: string;
}

interface FAQSection extends CommonSection {
  faqData: {
    question: string;
    answer: string | React.ReactNode;
    number?: number;
  }[];
}

interface CoachingInfoSection extends CommonSection {
  faqs: {
    question: string;
    answer: string | React.ReactNode;
  }[];
}

interface Reason99notesSection extends CommonSection {
  footer: string;
  reasons: {
    title: string;
    content: string;
  }[];
}

interface HomeProps {
  Hero: CommonSection;
  StudyMaterials: CommonSection;
  CurrentAffairs: CommonSection;
  CoachingInfo: CoachingInfoSection;
  FAQ: FAQSection;
  Reason99notes: Reason99notesSection;
}

export default function UpdateHomePage() {
  const token = Cookies.get("token");
  const [content, setContent] = useState<HomeProps | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState<Partial<HomeProps>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEditClick = (section: string) => {
    setEditingSection(section);
    if (content) {
      // Make sure CoachingInfo has a faqs array
      const initialTempContent = {
        ...content,
        CoachingInfo: {
          ...content.CoachingInfo,
          faqs: content.CoachingInfo?.faqs || [],
        },
      };
      setTempContent(initialTempContent);
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = (await api.get("/about-99-notes/home")) as {
          success: boolean; data: any;
        };
        const result = res.data;
        const parsedContent: HomeProps = JSON.parse(result.content);

        // Ensure CoachingInfo has a faqs array
        if (parsedContent.CoachingInfo && !parsedContent.CoachingInfo.faqs) {
          parsedContent.CoachingInfo.faqs = [];
        }

        setContent(parsedContent);
        setTempContent(parsedContent);
        setTitle(result.title);
        setId(result.id);
      } catch (error) {
        console.error("Error fetching content:", error);
        showToast("Failed to fetch content", "error");
      }
    };

    fetchContent();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof HomeProps,
    field: string,
    index?: number
  ) => {
    setTempContent((prev) => {
      const newContent = { ...prev };

      if (section === "FAQ" && field === "faqData") {
        const faqData = [...(prev?.FAQ?.faqData || [])];
        if (index !== undefined) {
          faqData[index] = {
            ...faqData[index],
            [e.target.name]: e.target.value,
          };
        }
        newContent.FAQ = {
          title: prev?.FAQ?.title || "FAQs",
          description:
            prev?.FAQ?.description || "Find answers to your questions",
          faqData,
        };
      } else if (section === "Reason99notes" && field === "reasons") {
        const reasons = [...(prev?.Reason99notes?.reasons || [])];
        if (index !== undefined) {
          reasons[index] = {
            ...reasons[index],
            [e.target.name]: e.target.value,
          };
        }
        newContent.Reason99notes = {
          title: prev?.Reason99notes?.title || "",
          description: prev?.Reason99notes?.description || "",
          footer: prev?.Reason99notes?.footer || "",
          reasons,
        };
      } else if (section === "CoachingInfo" && field === "faqs") {
        const faqs = [...(prev?.CoachingInfo?.faqs || [])];
        if (index !== undefined) {
          faqs[index] = {
            ...faqs[index],
            [e.target.name]: e.target.value,
          };
        }
        newContent.CoachingInfo = {
          title: prev?.CoachingInfo?.title || "",
          description: prev?.CoachingInfo?.description || "",
          faqs,
        };
      } else if (section === "Reason99notes") {
        newContent.Reason99notes = {
          ...prev?.Reason99notes,
          [field]: e.target.value,
        } as Reason99notesSection;
      } else {
        if (section === "CoachingInfo") {
          const faqs = prev?.CoachingInfo?.faqs || [];
          newContent.CoachingInfo = {
            title: prev?.CoachingInfo?.title || "",
            description: prev?.CoachingInfo?.description || "",
            faqs,
          } as CoachingInfoSection;
        } else {
          if (section === "FAQ") {
            newContent.FAQ = {
              ...prev?.FAQ,
              [field]: e.target.value,
            } as FAQSection;
          } else {
            newContent[section] = {
              ...prev?.[section],
              [field]: e.target.value,
            } as CommonSection;
          }
        }
      }

      return newContent;
    });
  };

  const handleAddFAQ = () => {
    setTempContent((prev) => {
      const newContent = { ...prev };
      newContent.FAQ = {
        title: prev?.FAQ?.title || "FAQs",
        description: prev?.FAQ?.description || "Find answers to your questions",
        faqData: [...(prev?.FAQ?.faqData || []), { question: "", answer: "" }],
      };
      return newContent;
    });
  };

  const handleAddCoachingInfo = () => {
    setTempContent((prev) => {
      const newContent = { ...prev };
      newContent.CoachingInfo = {
        title: prev?.CoachingInfo?.title || "",
        description: prev?.CoachingInfo?.description || "",
        faqs: [
          ...(prev?.CoachingInfo?.faqs || []),
          { question: "", answer: "" },
        ],
      };
      return newContent;
    });
  };

  const handleAddReason = () => {
    setTempContent((prev) => {
      const newContent = { ...prev };
      newContent.Reason99notes = {
        ...prev?.Reason99notes,
        reasons: [
          ...(prev?.Reason99notes?.reasons || []),
          { title: "", content: "" },
        ],
        footer: prev?.Reason99notes?.footer || "",
        title: prev?.Reason99notes?.title || "",
        description: prev?.Reason99notes?.description || "",
      };
      return newContent;
    });
  };

  const handleRemoveFAQ = (index: number) => {
    setTempContent((prev) => {
      const newContent = { ...prev };
      newContent.FAQ = {
        title: prev?.FAQ?.title || "FAQs",
        description: prev?.FAQ?.description || "Find answers to your questions",
        faqData: prev?.FAQ?.faqData?.filter((_, i) => i !== index) || [],
      };
      return newContent;
    });
  };

  const handleRemoveCoachingInfo = (index: number) => {
    setTempContent((prev) => {
      const newContent = { ...prev };
      newContent.CoachingInfo = {
        title: prev?.CoachingInfo?.title || "",
        description: prev?.CoachingInfo?.description || "",
        faqs: prev?.CoachingInfo?.faqs?.filter((_, i) => i !== index) || [],
      };
      return newContent;
    });
  };

  const handleRemoveReason = (index: number) => {
    setTempContent((prev) => {
      const newContent = { ...prev };
      newContent.Reason99notes = {
        ...prev?.Reason99notes,
        reasons:
          prev?.Reason99notes?.reasons?.filter((_, i) => i !== index) || [],
        footer: prev?.Reason99notes?.footer || "",
        title: prev?.Reason99notes?.title || "",
        description: prev?.Reason99notes?.description || "",
      };
      return newContent;
    });
  };

  const handleSave = async () => {
    if (!token || !id) {
      showToast("Please login to save changes", "error");
      return;
    }

    try {
      await api.put(`/about-99-notes/${id}`, {
        title: title,
        content: JSON.stringify(tempContent),
      });
      showToast("Changes saved successfully", "success");
      setContent(tempContent as HomeProps);
      setEditingSection(null);
    } catch (error) {
      console.error("Error saving content:", error);
      showToast("Failed to save changes", "error");
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setTempContent({});
  };

  if (!content) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl">
      <header className="bg-[var(--admin-bg-secondary)] text-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold">
            Dashboard - Update Home Page
          </h1>
          <p className="text-[var(--admin-scroll-thumb)] text-sm mt-1">
            Make changes to the Home page content
          </p>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {Object.entries(content || {}).map(([section, sectionContent]) => (
          <div key={section} className="mb-8">
            <div className="flex justify-between items-center mb-6 mt-5">
              <h2 className="text-2xl font-bold text-slate-900">{section}</h2>
              <button
                onClick={() => handleEditClick(section as keyof HomeProps)}
                className="text-slate-500 hover:text-slate-700 transition-colors duration-200"
              >
                <FaPencilAlt className="inline mr-1" />
                {editingSection === section ? "Cancel" : "Edit"}
              </button>
            </div>

            {editingSection === section ? (
              <div className="space-y-4">
                {/* First render title and description fields */}
                {section === "CoachingInfo" && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        title
                      </label>
                      <textarea
                        name="title"
                        value={
                          (tempContent.CoachingInfo as CoachingInfoSection)
                            ?.title || ""
                        }
                        onChange={(e) =>
                          handleInputChange(e, "CoachingInfo", "title")
                        }
                        className="w-full p-2 border border-[var(--admin-border)] rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        description
                      </label>
                      <textarea
                        name="description"
                        value={
                          (tempContent.CoachingInfo as CoachingInfoSection)
                            ?.description || ""
                        }
                        onChange={(e) =>
                          handleInputChange(e, "CoachingInfo", "description")
                        }
                        className="w-full p-2 border border-[var(--admin-border)] rounded"
                      />
                    </div>

                    {/* Then render the faqs section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Questions</h3>
                      <div className="space-y-4">
                        {(
                          tempContent.CoachingInfo as CoachingInfoSection
                        )?.faqs?.map((item, i) => (
                          <div
                            key={i}
                            className="border border-[var(--admin-border)] p-4 rounded-lg"
                          >
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-1">
                                question
                              </label>
                              <textarea
                                name="question"
                                value={item.question || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    "CoachingInfo",
                                    "faqs",
                                    i
                                  )
                                }
                                className="w-full p-2 border border-[var(--admin-border)] rounded"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-1">
                                answer
                              </label>
                              <textarea
                                name="answer"
                                value={(item.answer as string) || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    "CoachingInfo",
                                    "faqs",
                                    i
                                  )
                                }
                                className="w-full p-2 border border-[var(--admin-border)] rounded"
                              />
                            </div>
                            <button
                              onClick={() => handleRemoveCoachingInfo(i)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Remove
                            </button>
                          </div>
                        ))}

                        {/* Add button for coaching info questions */}
                        <button
                          onClick={handleAddCoachingInfo}
                          className="text-[var(--admin-scroll-thumb)] hover:text-[var(--admin-bg-dark)] flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Add Question
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Handle other sections */}
                {section !== "CoachingInfo" &&
                  Object.entries(sectionContent).map(
                    ([field, value], index) => {
                      if (field === "faqData" || field === "reasons") {
                        return (
                          <div key={field}>
                            <h3 className="text-lg font-semibold mb-4">
                              {field}
                            </h3>
                            <div className="space-y-4">
                              {(tempContent[section as keyof HomeProps] as any)[
                                field
                              ].map((item: any, i: number) => (
                                <div
                                  key={i}
                                  className="border border-[var(--admin-border)] p-4 rounded-lg"
                                >
                                  {Object.entries(item).map(
                                    ([subField, subValue]) => (
                                      <div key={subField} className="mb-4">
                                        <label className="block text-sm font-medium mb-1">
                                          {subField}
                                        </label>
                                        <textarea
                                          name={subField}
                                          value={
                                            (
                                              tempContent[
                                                section as keyof HomeProps
                                              ] as any
                                            )[field][i][subField] || ""
                                          }
                                          onChange={(e) =>
                                            handleInputChange(
                                              e,
                                              section as keyof HomeProps,
                                              field,
                                              i
                                            )
                                          }
                                          className="w-full p-2 border border-[var(--admin-border)] rounded"
                                        />
                                      </div>
                                    )
                                  )}
                                  <button
                                    onClick={() => {
                                      if (field === "faqData") {
                                        if (section === "CoachingInfo")
                                          handleRemoveCoachingInfo(i);
                                        else handleRemoveFAQ(i);
                                      } else if (field === "reasons")
                                        handleRemoveReason(i);
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  if (field === "faqData") {
                                    if (section === "CoachingInfo")
                                      handleAddCoachingInfo();
                                    else handleAddFAQ();
                                  } else if (field === "reasons")
                                    handleAddReason();
                                }}
                                className="text-[var(--admin-scroll-thumb)] hover:text-[var(--admin-bg-dark)]"
                              >
                                Add{" "}
                                {field === "faqData"
                                  ? section === "CoachingInfo"
                                    ? "Coaching Info"
                                    : "FAQ"
                                  : "Reason"}
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={field} className="mb-4">
                          <label className="block text-sm font-medium mb-1">
                            {field}
                          </label>
                          <textarea
                            name={field}
                            value={
                              (tempContent[section as keyof HomeProps] as any)[
                                field
                              ] || ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                section as keyof HomeProps,
                                field
                              )
                            }
                            className="w-full p-2 border border-[var(--admin-border)] rounded"
                          />
                        </div>
                      );
                    }
                  )}

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-[var(--admin-border)] rounded hover:bg-[var(--admin-bg-lightest)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[var(--admin-bg-dark)] text-white rounded hover:bg-[var(--admin-bg-secondary)]"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="preview-section">
                {section === "Hero" && (
                  <div className="space-y-7 max-w-xl md:pl-9">
                    <div className="space-y-4 mt-4 md:mt-0">
                      <h1 className="text-4xl font-semibold text-[var(--admin-bg-dark)] leading-relaxed font-opensans">
                        <span
                          className="block"
                          dangerouslySetInnerHTML={{
                            __html: sectionContent.title,
                          }}
                        ></span>
                      </h1>
                    </div>
                    <p className="text-base font-semibold text-[var(--admin-bg-primary)] leading-relaxed font-opensans">
                      {sectionContent.description}
                    </p>
                  </div>
                )}
                {section === "StudyMaterials" && (
                  <StudyMaterials
                    title={sectionContent.title}
                    description={sectionContent.description}
                  />
                )}
                {section === "CurrentAffairs" && (
                  <CurrentAffairs
                    title={sectionContent.title}
                    description={sectionContent.description}
                  />
                )}
                {section === "CoachingInfo" && (
                  <CoachingInfo
                    title={sectionContent.title}
                    description={sectionContent.description}
                    faqs={(sectionContent as CoachingInfoSection).faqs}
                  />
                )}
                {section === "FAQ" && (
                  <FAQ
                    title={sectionContent.title}
                    description={sectionContent.description}
                    faqData={(sectionContent as FAQSection).faqData}
                  />
                )}
                {section === "Reason99notes" && (
                  <Reason99notes
                    title={sectionContent.title}
                    description={sectionContent.description}
                    reasons={(sectionContent as Reason99notesSection).reasons}
                    footer={(sectionContent as Reason99notesSection).footer}
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {toast && (
          <div
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
