"use client";

import React, { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import SliderWrapper from "@/components/About/SliderWrapper";
import { api } from "@/config/api/route";

interface Content {
  heroImage: string;
  heroText: string;
  whatWeDo: {
    title: string;
    description: string;
    items: string[];
    image: string;
  };
  mission: {
    title: string;
    description: string;
  };
  founder: {
    name: string;
    title: string;
    quote: string;
    description: string[];
    image: string;
  };
  cofounder: {
    name: string;
    title: string;
    quote: string;
    description: string[];
    image: string;
  };
  veterans: {
    title: string;
    description: string;
    images: { src: string; alt: string; info: string }[];
  };
  coreMembers: {
    title: string;
    description: string;
    images: { src: string; alt: string; info: string }[];
  };
}

export default function UpdateAboutPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState<Partial<Content>>({});
  const [title, setTitle] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEditClick = (section: string) => {
    setEditingSection(section);
    if (content) {
      setTempContent(content);
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = (await api.get(`/about-99-notes`)) as {
          success: boolean; data: any;
        };
        const result = res.data;
        const parsedContent: Content = JSON.parse(result.content);
        const title = result.title;
        setTitle(title);
        setContent(parsedContent);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: string,
    field: string,
    index?: number
  ) => {
    console.log("Change......");
    setTempContent((prev) => {
      // Handle top-level fields like heroImage and heroText
      if (section === "heroImage" || section === "heroText") {
        return {
          ...prev,
          [section]: e.target.value,
        };
      }

      // Handle nested fields
      const sectionData = (prev[section as keyof Content] || {}) as any;
      if (Array.isArray(sectionData[field])) {
        console.log("Array field detected");
        // Handle array fields (e.g., images)
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: sectionData[field].map((item: any, i: number) =>
              i === index ? e.target.value : item
            ),
          },
        };
      } else {
        console.log("Non-array field detected");
        // Handle non-array fields
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: e.target.value,
          },
        };
      }
    });
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: string,
    field: string,
    index: number,
    key: string
  ) => {
    setTempContent((prev) => {
      const sectionData = (prev[section as keyof Content] || {}) as any;
      const updatedArray = [...sectionData[field]];
      updatedArray[index] = {
        ...updatedArray[index],
        [key]: e.target.value,
      };
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: updatedArray,
        },
      };
    });
  };

  const handleAddArrayItem = (section: string, field: string) => {
    setTempContent((prev) => {
      const sectionData = (prev[section as keyof Content] || {}) as any;
      const updatedArray = [...(sectionData[field] || [])];
      updatedArray.push({ src: "", alt: "", info: "" }); // Add a new empty object
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: updatedArray,
        },
      };
    });
  };

  const handleRemoveArrayItem = (
    section: string,
    field: string,
    index: number
  ) => {
    setTempContent((prev) => {
      const sectionData = (prev[section as keyof Content] || {}) as any;
      const updatedArray = [...sectionData[field]];
      updatedArray.splice(index, 1); // Remove the item at the specified index
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: updatedArray,
        },
      };
    });
  };

  const handleSave = async () => {
    try {
      (await api.put(`/about-99-notes/1`, {
        title: title,
        content: JSON.stringify(tempContent),
      })) as { success: boolean };
      setContent(tempContent as Content);
      setTitle(title);
      setEditingSection(null);
      showToast("Section updated successfully!", "success");
    } catch (error) {
      console.error("Error updating section:", error);
      showToast("Failed to update the section.", "error");
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setTempContent({});
  };

  if (!content) return <div>Loading...</div>;

  return (
    <>
      {toast && (
        <div
          className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "bg-slate-900 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <p className="text-sm">{toast.message}</p>
        </div>
      )}
      <header className="bg-[var(--admin-bg-secondary)] text-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold">
            Dashboard - Update About Page
          </h1>
          <p className="text-[var(--admin-scroll-thumb)] text-sm mt-1">
            Make changes to the About page content
          </p>
        </div>
      </header>

      <main className="w-full bg-[var(--admin-bg-lightest)] min-h-screen overflow-hidden">
        <div className="container mx-auto p-6">
          {/* Hero Section */}
          <section
            id="hero-section"
            className="relative mb-10 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold text-[var(--admin-bg-dark)] border-b border-[var(--admin-border)] pb-2 mb-4 flex items-center">
              <span className="mr-2">Hero Section</span>
              {editingSection !== "hero" && (
                <button
                  onClick={() => handleEditClick("hero")}
                  className="ml-auto text-[var(--admin-scroll-thumb)] hover:text-[var(--admin-bg-dark)] transition-colors"
                  title="Edit Hero Section"
                >
                  <FaPencilAlt className="w-4 h-4" />
                </button>
              )}
            </h2>
            {editingSection === "hero" ? (
              <div className="mt-4">
                <label className="block mb-4">
                  <span className="text-[var(--admin-bg-primary)] font-medium">
                    Hero Image URL:
                  </span>
                  <input
                    type="text"
                    value={tempContent.heroImage || ""}
                    onChange={(e) => handleInputChange(e, "heroImage", "")}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                    focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                    placeholder="Enter image URL"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-[var(--admin-bg-primary)] font-medium">
                    Hero Text:
                  </span>
                  <textarea
                    value={tempContent.heroText || ""}
                    onChange={(e) => handleInputChange(e, "heroText", "")}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                    focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                    rows={4}
                    placeholder="Enter hero text"
                  ></textarea>
                </label>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-[var(--admin-scroll-thumb)] rounded-md text-[var(--admin-secondary)] bg-white hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[var(--admin-bg-dark)] text-white rounded-md hover:bg-[var(--admin-bg-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-bg-dark)]"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <img
                  src={content.heroImage}
                  alt="Hero"
                  className="w-full h-64 object-cover rounded"
                />
                <p className="mt-4">{content.heroText}</p>
              </div>
            )}
          </section>

          {/* What We Do Section */}
          <section
            id="what-we-do-section"
            className="mb-10 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold text-[var(--admin-bg-dark)] border-b border-[var(--admin-border)] pb-2 mb-4 flex items-center">
              <span className="mr-2">What We Do</span>
              {editingSection !== "whatWeDo" && (
                <button
                  onClick={() => handleEditClick("whatWeDo")}
                  className="ml-auto text-[var(--admin-scroll-thumb)] hover:text-[var(--admin-bg-dark)] transition-colors"
                  title="Edit What We Do Section"
                >
                  <FaPencilAlt className="w-4 h-4" />
                </button>
              )}
            </h2>

            {editingSection === "whatWeDo" ? (
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-[var(--admin-bg-primary)] font-medium">
                    Title:
                  </span>
                  <input
                    type="text"
                    value={tempContent.whatWeDo?.title || ""}
                    onChange={(e) => handleInputChange(e, "whatWeDo", "title")}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                    focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                    placeholder="Enter title"
                  />
                </label>
                <label className="block">
                  <span className="text-[var(--admin-bg-primary)] font-medium">
                    Description:
                  </span>
                  <textarea
                    value={tempContent.whatWeDo?.description || ""}
                    onChange={(e) =>
                      handleInputChange(e, "whatWeDo", "description")
                    }
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                    focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                    rows={4}
                    placeholder="Enter description"
                  ></textarea>
                </label>
                <label className="block">
                  <span className="text-[var(--admin-bg-primary)] font-medium">
                    Image URL:
                  </span>
                  <input
                    type="text"
                    value={tempContent.whatWeDo?.image || ""}
                    onChange={(e) => handleInputChange(e, "whatWeDo", "image")}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                    focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                    placeholder="Enter image URL"
                  />
                </label>
                <div>
                  <span className="text-[var(--admin-bg-primary)] font-medium block mb-2">
                    Items:
                  </span>
                  {tempContent.whatWeDo?.items.map((item, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleInputChange(e, "whatWeDo", "items", index)
                        }
                        className="flex-grow px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                        focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                        placeholder={`Item ${index + 1}`}
                      />
                      <button
                        onClick={() =>
                          handleRemoveArrayItem("whatWeDo", "items", index)
                        }
                        className="ml-2 p-2 text-red-600 hover:text-red-800 focus:outline-none"
                        title="Remove item"
                      >
                        <svg
                          className="w-5 h-5"
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
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddArrayItem("whatWeDo", "items")}
                    className="mt-2 px-3 py-1 bg-[var(--admin-bg-lightest)] text-[var(--admin-secondary)] rounded-md border border-[var(--admin-scroll-thumb)] hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)] flex items-center text-sm"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Item
                  </button>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-[var(--admin-scroll-thumb)] rounded-md text-[var(--admin-secondary)] bg-white hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[var(--admin-bg-dark)] text-white rounded-md hover:bg-[var(--admin-bg-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-bg-dark)]"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--admin-bg-dark)] mb-3">
                    {content?.whatWeDo.title}
                  </h3>
                  <p className="text-[var(--admin-secondary)] mb-4">
                    {content?.whatWeDo.description}
                  </p>
                  <ul className="space-y-2">
                    {content?.whatWeDo.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[var(--admin-bg-dark)] mr-2">
                          •
                        </span>
                        <span className="text-[var(--admin-secondary)]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative h-64 overflow-hidden rounded-lg shadow-md">
                  <img
                    src={content?.whatWeDo.image}
                    alt="What We Do"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Mission Section */}
          <section
            id="mission-section"
            className="mb-10 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold text-[var(--admin-bg-dark)] border-b border-[var(--admin-border)] pb-2 mb-4 flex items-center">
              <span className="mr-2">Our Mission</span>
              {editingSection !== "mission" && (
                <button
                  onClick={() => handleEditClick("mission")}
                  className="ml-auto text-[var(--admin-scroll-thumb)] hover:text-[var(--admin-bg-dark)] transition-colors"
                  title="Edit Mission Section"
                >
                  <FaPencilAlt className="w-4 h-4" />
                </button>
              )}
            </h2>

            {editingSection === "mission" ? (
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-[var(--admin-bg-primary)] font-medium">
                    Title:
                  </span>
                  <input
                    type="text"
                    value={tempContent.mission?.title || ""}
                    onChange={(e) => handleInputChange(e, "mission", "title")}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                    focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                    placeholder="Enter title"
                  />
                </label>
                <label className="block">
                  <span className="text-[var(--admin-bg-primary)] font-medium">
                    Description:
                  </span>
                  <textarea
                    value={tempContent.mission?.description || ""}
                    onChange={(e) =>
                      handleInputChange(e, "mission", "description")
                    }
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                    focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                    rows={4}
                    placeholder="Enter description"
                  ></textarea>
                </label>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-[var(--admin-scroll-thumb)] rounded-md text-[var(--admin-secondary)] bg-white hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[var(--admin-bg-dark)] text-white rounded-md hover:bg-[var(--admin-bg-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-bg-dark)]"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--admin-bg-lightest)] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[var(--admin-bg-dark)] mb-3">
                  {content?.mission.title}
                </h3>
                <p className="text-[var(--admin-secondary)]">
                  {content?.mission.description}
                </p>
              </div>
            )}
          </section>

          {/* Founder Section */}
          <section
            id="founder-section"
            className="mb-10 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold text-[var(--admin-bg-dark)] border-b border-[var(--admin-border)] pb-2 mb-4 flex items-center">
              <span className="mr-2">Founder</span>
              {editingSection !== "founder" && (
                <button
                  onClick={() => handleEditClick("founder")}
                  className="ml-auto text-[var(--admin-scroll-thumb)] hover:text-[var(--admin-bg-dark)] transition-colors"
                  title="Edit Founder Section"
                >
                  <FaPencilAlt className="w-4 h-4" />
                </button>
              )}
            </h2>

            {editingSection === "founder" ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-[var(--admin-bg-primary)] font-medium">
                        Name:
                      </span>
                      <input
                        type="text"
                        value={tempContent.founder?.name || ""}
                        onChange={(e) =>
                          handleInputChange(e, "founder", "name")
                        }
                        className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                        focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                        placeholder="Enter name"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[var(--admin-bg-primary)] font-medium">
                        Title:
                      </span>
                      <input
                        type="text"
                        value={tempContent.founder?.title || ""}
                        onChange={(e) =>
                          handleInputChange(e, "founder", "title")
                        }
                        className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                        focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                        placeholder="Enter title"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[var(--admin-bg-primary)] font-medium">
                        Quote:
                      </span>
                      <textarea
                        value={tempContent.founder?.quote || ""}
                        onChange={(e) =>
                          handleInputChange(e, "founder", "quote")
                        }
                        className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                        focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                        rows={3}
                        placeholder="Enter quote"
                      ></textarea>
                    </label>
                    <label className="block">
                      <span className="text-[var(--admin-bg-primary)] font-medium">
                        Image URL:
                      </span>
                      <input
                        type="text"
                        value={tempContent.founder?.image || ""}
                        onChange={(e) =>
                          handleInputChange(e, "founder", "image")
                        }
                        className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                        focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                        placeholder="Enter image URL"
                      />
                    </label>
                  </div>

                  <div>
                    <span className="text-[var(--admin-bg-primary)] font-medium block mb-2">
                      Description:
                    </span>
                    {tempContent.founder?.description.map((desc, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <textarea
                          value={desc}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "founder",
                              "description",
                              index
                            )
                          }
                          className="flex-grow px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                          focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                          rows={3}
                          placeholder={`Description paragraph ${index + 1}`}
                        ></textarea>
                        <button
                          onClick={() =>
                            handleRemoveArrayItem(
                              "founder",
                              "description",
                              index
                            )
                          }
                          className="ml-2 p-2 text-red-600 hover:text-red-800 focus:outline-none"
                          title="Remove paragraph"
                        >
                          <svg
                            className="w-5 h-5"
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
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        handleAddArrayItem("founder", "description")
                      }
                      className="mt-2 px-3 py-1 bg-[var(--admin-bg-lightest)] text-[var(--admin-secondary)] rounded-md border border-[var(--admin-scroll-thumb)] hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)] flex items-center text-sm"
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Paragraph
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-[var(--admin-scroll-thumb)] rounded-md text-[var(--admin-secondary)] bg-white hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[var(--admin-bg-dark)] text-white rounded-md hover:bg-[var(--admin-bg-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-bg-dark)]"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-80 overflow-hidden rounded-lg shadow-md">
                  <img
                    src={content?.founder.image}
                    alt={content?.founder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--admin-bg-dark)]">
                    {content?.founder.name}
                  </h3>
                  <p className="text-[var(--admin-secondary)] mb-4">
                    {content?.founder.title}
                  </p>
                  <blockquote className="italic text-[var(--admin-secondary)] border-l-4 border-[var(--admin-bg-dark)] pl-4 mb-4">
                    "{content?.founder.quote}"
                  </blockquote>
                  <div className="space-y-2">
                    {content?.founder.description.map((desc, index) => (
                      <p key={index} className="text-[var(--admin-secondary)]">
                        {desc}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Co-Founder Section */}
          <section
            id="cofounder-section"
            className="mb-10 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold text-[var(--admin-bg-dark)] border-b border-[var(--admin-border)] pb-2 mb-4 flex items-center">
              <span className="mr-2">Co-Founder</span>
              {editingSection !== "cofounder" && (
                <button
                  onClick={() => handleEditClick("cofounder")}
                  className="ml-auto text-[var(--admin-scroll-thumb)] hover:text-[var(--admin-bg-dark)] transition-colors"
                  title="Edit Co-Founder Section"
                >
                  <FaPencilAlt className="w-4 h-4" />
                </button>
              )}
            </h2>

            {editingSection === "cofounder" ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-[var(--admin-bg-primary)] font-medium">
                        Name:
                      </span>
                      <input
                        type="text"
                        value={tempContent.cofounder?.name || ""}
                        onChange={(e) =>
                          handleInputChange(e, "cofounder", "name")
                        }
                        className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                        focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                        placeholder="Enter name"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[var(--admin-bg-primary)] font-medium">
                        Title:
                      </span>
                      <input
                        type="text"
                        value={tempContent.cofounder?.title || ""}
                        onChange={(e) =>
                          handleInputChange(e, "cofounder", "title")
                        }
                        className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                        focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                        placeholder="Enter title"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[var(--admin-bg-primary)] font-medium">
                        Quote:
                      </span>
                      <textarea
                        value={tempContent.cofounder?.quote || ""}
                        onChange={(e) =>
                          handleInputChange(e, "cofounder", "quote")
                        }
                        className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                        focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                        rows={3}
                        placeholder="Enter quote"
                      ></textarea>
                    </label>
                    <label className="block">
                      <span className="text-[var(--admin-bg-primary)] font-medium">
                        Image URL:
                      </span>
                      <input
                        type="text"
                        value={tempContent.cofounder?.image || ""}
                        onChange={(e) =>
                          handleInputChange(e, "cofounder", "image")
                        }
                        className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                        focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                        placeholder="Enter image URL"
                      />
                    </label>
                  </div>

                  <div>
                    <span className="text-[var(--admin-bg-primary)] font-medium block mb-2">
                      Description:
                    </span>
                    {tempContent.cofounder?.description.map((desc, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <textarea
                          value={desc}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "cofounder",
                              "description",
                              index
                            )
                          }
                          className="flex-grow px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                          focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                          rows={3}
                          placeholder={`Description paragraph ${index + 1}`}
                        ></textarea>
                        <button
                          onClick={() =>
                            handleRemoveArrayItem(
                              "cofounder",
                              "description",
                              index
                            )
                          }
                          className="ml-2 p-2 text-red-600 hover:text-red-800 focus:outline-none"
                          title="Remove paragraph"
                        >
                          <svg
                            className="w-5 h-5"
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
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        handleAddArrayItem("cofounder", "description")
                      }
                      className="mt-2 px-3 py-1 bg-[var(--admin-bg-lightest)] text-[var(--admin-secondary)] rounded-md border border-[var(--admin-scroll-thumb)] hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)] flex items-center text-sm"
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Paragraph
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-[var(--admin-scroll-thumb)] rounded-md text-[var(--admin-secondary)] bg-white hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[var(--admin-bg-dark)] text-white rounded-md hover:bg-[var(--admin-bg-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-bg-dark)]"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--admin-bg-dark)]">
                    {content?.cofounder.name}
                  </h3>
                  <p className="text-[var(--admin-secondary)] mb-4">
                    {content?.cofounder.title}
                  </p>
                  <blockquote className="italic text-[var(--admin-secondary)] border-l-4 border-[var(--admin-bg-dark)] pl-4 mb-4">
                    "{content?.cofounder.quote}"
                  </blockquote>
                  <div className="space-y-2">
                    {content?.cofounder.description.map((desc, index) => (
                      <p key={index} className="text-[var(--admin-secondary)]">
                        {desc}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="relative h-80 overflow-hidden rounded-lg shadow-md">
                  <img
                    src={content?.cofounder.image}
                    alt={content?.cofounder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Veterans Section */}
          <section
            id="veterans-section"
            className="mb-10 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold text-[var(--admin-bg-dark)] border-b border-[var(--admin-border)] pb-2 mb-4 flex items-center">
              <span className="mr-2">Veterans</span>
              {editingSection !== "veterans" && (
                <button
                  onClick={() => handleEditClick("veterans")}
                  className="ml-auto text-[var(--admin-scroll-thumb)] hover:text-[var(--admin-bg-dark)] transition-colors"
                  title="Edit Veterans Section"
                >
                  <FaPencilAlt className="w-4 h-4" />
                </button>
              )}
            </h2>

            {editingSection === "veterans" ? (
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-[var(--admin-bg-primary)] font-medium">
                    Title:
                  </span>
                  <input
                    type="text"
                    value={tempContent.veterans?.title || ""}
                    onChange={(e) => handleInputChange(e, "veterans", "title")}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                    focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                    placeholder="Enter title"
                  />
                </label>
                <label className="block">
                  <span className="text-[var(--admin-bg-primary)] font-medium">
                    Description:
                  </span>
                  <textarea
                    value={tempContent.veterans?.description || ""}
                    onChange={(e) =>
                      handleInputChange(e, "veterans", "description")
                    }
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                    focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                    rows={4}
                    placeholder="Enter description"
                  ></textarea>
                </label>

                <div>
                  <span className="text-[var(--admin-bg-primary)] font-medium block mb-2">
                    Images:
                  </span>
                  {tempContent.veterans?.images.map((image, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 border border-[var(--admin-scroll-thumb)] rounded-md bg-[var(--admin-bg-lightest)]"
                    >
                      <label className="block mb-2">
                        <span className="text-[var(--admin-bg-primary)] text-sm">
                          Image URL:
                        </span>
                        <input
                          type="text"
                          value={image.src}
                          onChange={(e) =>
                            handleArrayInputChange(
                              e,
                              "veterans",
                              "images",
                              index,
                              "src"
                            )
                          }
                          className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                          focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                          placeholder="Enter image URL"
                        />
                      </label>
                      <label className="block mb-2">
                        <span className="text-[var(--admin-bg-primary)] text-sm">
                          Alt Text:
                        </span>
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) =>
                            handleArrayInputChange(
                              e,
                              "veterans",
                              "images",
                              index,
                              "alt"
                            )
                          }
                          className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                          focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                          placeholder="Enter alt text"
                        />
                      </label>
                      <label className="block mb-2">
                        <span className="text-[var(--admin-bg-primary)] text-sm">
                          Info:
                        </span>
                        <textarea
                          value={image.info}
                          onChange={(e) =>
                            handleArrayInputChange(
                              e,
                              "veterans",
                              "images",
                              index,
                              "info"
                            )
                          }
                          className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                          focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                          rows={2}
                          placeholder="Enter image info"
                        ></textarea>
                      </label>
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            handleRemoveArrayItem("veterans", "images", index)
                          }
                          className="px-3 py-1 bg-red-50 text-red-600 rounded-md border border-red-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center text-sm"
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
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddArrayItem("veterans", "images")}
                    className="mt-2 px-3 py-1 bg-[var(--admin-bg-lightest)] text-[var(--admin-secondary)] rounded-md border border-[var(--admin-scroll-thumb)] hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)] flex items-center text-sm"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Image
                  </button>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-[var(--admin-scroll-thumb)] rounded-md text-[var(--admin-secondary)] bg-white hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[var(--admin-bg-dark)] text-white rounded-md hover:bg-[var(--admin-bg-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-bg-dark)]"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[var(--admin-bg-dark)] mb-2">
                    {content?.veterans.title}
                  </h3>
                  <p className="text-[var(--admin-secondary)]">
                    {content?.veterans.description}
                  </p>
                </div>
                <div className="bg-[var(--admin-bg-lightest)] p-4 rounded-lg">
                  <SliderWrapper images={content?.veterans.images} />
                </div>
              </div>
            )}
          </section>

          {/* Core Members Section */}
          <section
            id="core-members-section"
            className="mb-10 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl font-bold text-[var(--admin-bg-dark)] border-b border-[var(--admin-border)] pb-2 mb-4 flex items-center">
              <span className="mr-2">Core Members</span>
              {editingSection !== "coreMembers" && (
                <button
                  onClick={() => handleEditClick("coreMembers")}
                  className="ml-auto text-[var(--admin-scroll-thumb)] hover:text-[var(--admin-bg-dark)] transition-colors"
                  title="Edit Core Members Section"
                >
                  <FaPencilAlt className="w-4 h-4" />
                </button>
              )}
            </h2>

            {editingSection === "coreMembers" ? (
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-[var(--admin-bg-primary)] font-medium">
                    Title:
                  </span>
                  <input
                    type="text"
                    value={tempContent.coreMembers?.title || ""}
                    onChange={(e) =>
                      handleInputChange(e, "coreMembers", "title")
                    }
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                    focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                    placeholder="Enter title"
                  />
                </label>
                <label className="block">
                  <span className="text-[var(--admin-bg-primary)] font-medium">
                    Description:
                  </span>
                  <textarea
                    value={tempContent.coreMembers?.description || ""}
                    onChange={(e) =>
                      handleInputChange(e, "coreMembers", "description")
                    }
                    className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                    focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                    rows={4}
                    placeholder="Enter description"
                  ></textarea>
                </label>

                <div>
                  <span className="text-[var(--admin-bg-primary)] font-medium block mb-2">
                    Images:
                  </span>
                  {tempContent.coreMembers?.images.map((image, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 border border-[var(--admin-scroll-thumb)] rounded-md bg-[var(--admin-bg-lightest)]"
                    >
                      <label className="block mb-2">
                        <span className="text-[var(--admin-bg-primary)] text-sm">
                          Image URL:
                        </span>
                        <input
                          type="text"
                          value={image.src}
                          onChange={(e) =>
                            handleArrayInputChange(
                              e,
                              "coreMembers",
                              "images",
                              index,
                              "src"
                            )
                          }
                          className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                          focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                          placeholder="Enter image URL"
                        />
                      </label>
                      <label className="block mb-2">
                        <span className="text-[var(--admin-bg-primary)] text-sm">
                          Alt Text:
                        </span>
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) =>
                            handleArrayInputChange(
                              e,
                              "coreMembers",
                              "images",
                              index,
                              "alt"
                            )
                          }
                          className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                          focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                          placeholder="Enter alt text"
                        />
                      </label>
                      <label className="block mb-2">
                        <span className="text-[var(--admin-bg-primary)] text-sm">
                          Info:
                        </span>
                        <textarea
                          value={image.info}
                          onChange={(e) =>
                            handleArrayInputChange(
                              e,
                              "coreMembers",
                              "images",
                              index,
                              "info"
                            )
                          }
                          className="mt-1 block w-full px-3 py-2 bg-white border border-[var(--admin-scroll-thumb)] rounded-md text-sm shadow-sm placeholder-[var(--admin-scroll-thumb)]
                          focus:outline-none focus:border-[var(--admin-bg-dark)] focus:ring-1 focus:ring-[var(--admin-bg-dark)]"
                          rows={2}
                          placeholder="Enter image info"
                        ></textarea>
                      </label>
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            handleRemoveArrayItem(
                              "coreMembers",
                              "images",
                              index
                            )
                          }
                          className="px-3 py-1 bg-red-50 text-red-600 rounded-md border border-red-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center text-sm"
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
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddArrayItem("coreMembers", "images")}
                    className="mt-2 px-3 py-1 bg-[var(--admin-bg-lightest)] text-[var(--admin-secondary)] rounded-md border border-[var(--admin-scroll-thumb)] hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)] flex items-center text-sm"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Image
                  </button>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-[var(--admin-scroll-thumb)] rounded-md text-[var(--admin-secondary)] bg-white hover:bg-[var(--admin-bg-lightest)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-scroll-thumb)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[var(--admin-bg-dark)] text-white rounded-md hover:bg-[var(--admin-bg-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--admin-bg-dark)]"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[var(--admin-bg-dark)] mb-2">
                    {content?.coreMembers.title}
                  </h3>
                  <p className="text-[var(--admin-secondary)]">
                    {content?.coreMembers.description}
                  </p>
                </div>
                <div className="bg-[var(--admin-bg-lightest)] p-4 rounded-lg">
                  <SliderWrapper images={content?.coreMembers.images} />
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
