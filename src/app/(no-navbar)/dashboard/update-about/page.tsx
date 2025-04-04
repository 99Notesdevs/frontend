"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { env } from "@/config/env";
import { FaPencilAlt } from "react-icons/fa";
import ClientImage from "@/components/About/CientImage";
import SliderWrapper from "@/components/About/SliderWrapper";
import Head from "next/head";
import Cookies from "js-cookie";

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
  const token = Cookies.get("token");
  const [content, setContent] = useState<Content | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState<Partial<Content>>({});
  const [title, setTitle] = useState<string>("");

  const handleEditClick = (section: string) => {
    setEditingSection(section);
    if (content) {
      setTempContent(content);
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${env.API}/about-99-notes`);
        const result = res.data.data;
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
      await axios.put(`${env.API}/about-99-notes`, { title: title, content: JSON.stringify(tempContent) }, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      setContent(tempContent as Content);
      setTitle(title);
      setEditingSection(null);
      alert("Section updated successfully!");
    } catch (error) {
      console.error("Error updating section:", error);
      alert("Failed to update the section.");
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setTempContent({});
  };

  if(!content) return <div>Loading...</div>

  return (
    <>
      <main className="w-full bg-gradient-to-b from-white to-gray-50 min-h-screen overflow-hidden">
        <div className="container mx-auto p-6">
          {/* Hero Section */}
          <section className="relative mb-10">
            <h2 className="text-2xl font-bold">Hero Section</h2>
            {editingSection === "hero" ? (
              <div className="mt-4">
                <label className="block">
                  Hero Image URL:
                  <input
                    type="text"
                    value={tempContent.heroImage || ""}
                    onChange={(e) =>
                      handleInputChange(e, "heroImage", "heroImage")
                    }
                    className="block w-full mt-1 p-2 border rounded"
                  />
                </label>
                <label className="block mt-2">
                  Hero Text:
                  <textarea
                    value={tempContent.heroText || ""}
                    onChange={(e) =>
                      handleInputChange(e, "heroText", "heroText")
                    }
                    className="block w-full mt-1 p-2 border rounded"
                  />
                </label>
                <button
                  onClick={handleSave}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="mt-4 ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <img
                  src={content.heroImage}
                  alt="Hero"
                  className="w-full h-64 object-cover rounded"
                />
                <p className="mt-4">{content.heroText}</p>
                <button
                  onClick={() => handleEditClick("hero")}
                  className="absolute top-0 right-0 mt-2 mr-2 text-blue-600 hover:text-blue-800"
                >
                  <FaPencilAlt />
                </button>
              </div>
            )}
          </section>

          {/* What We Do Section */}
          <section className="py-20 bg-gradient-to-b from-white to-blue-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Edit Icon */}
              <button
                onClick={() => handleEditClick("whatWeDo")}
                className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
              >
                <FaPencilAlt size={20} />
              </button>

              {/* Section Title */}
              <div className="text-center mb-16 space-y-4">
                {editingSection === "whatWeDo" ? (
                  <input
                    type="text"
                    value={tempContent.whatWeDo?.title || ""}
                    onChange={(e) => handleInputChange(e, "whatWeDo", "title")}
                    className="block w-full text-center text-6xl font-bold text-gray-900 font-playfair border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                ) : (
                  <h2 className="font-playfair text-6xl font-bold text-gray-900">
                    {content.whatWeDo.title}
                  </h2>
                )}
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
              </div>

              {/* Section Content */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  {editingSection === "whatWeDo" ? (
                    <textarea
                      value={tempContent.whatWeDo?.description || ""}
                      onChange={(e) =>
                        handleInputChange(e, "whatWeDo", "description")
                      }
                      className="block w-full text-xl leading-relaxed text-gray-700 font-poppins border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                    />
                  ) : (
                    <p className="text-xl leading-relaxed text-gray-700 font-poppins">
                      {content.whatWeDo.description}
                    </p>
                  )}

                  <ul className="space-y-6">
                    {content.whatWeDo.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-4 group"
                      >
                        <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold transform group-hover:scale-110 transition-transform duration-300">
                          {index + 1}
                        </span>
                        {editingSection === "whatWeDo" ? (
                          <input
                            type="text"
                            value={tempContent.whatWeDo?.items[index] || ""}
                            onChange={(e) =>
                              handleInputChange(e, "whatWeDo", "items", index)
                            }
                            className="block w-full text-xl text-gray-700 font-poppins border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                          />
                        ) : (
                          <span className="text-xl text-gray-700 font-poppins group-hover:text-blue-600 transition-colors duration-300">
                            {item}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section Image */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-75 blur-lg"></div>
                  {editingSection === "whatWeDo" ? (
                    <input
                      type="text"
                      value={tempContent.whatWeDo?.image || ""}
                      onChange={(e) =>
                        handleInputChange(e, "whatWeDo", "image")
                      }
                      className="relative z-10 block w-full text-center text-gray-700 font-poppins border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                      placeholder="Enter Image URL"
                    />
                  ) : (
                    <ClientImage
                      src={content.whatWeDo.image}
                      alt="What we do"
                      width={600}
                      height={400}
                      className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
              </div>

              {/* Save and Cancel Buttons */}
              {editingSection === "whatWeDo" && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Edit Icon */}
              <button
                onClick={() => handleEditClick("mission")}
                className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
              >
                <FaPencilAlt size={20} />
              </button>

              {/* Section Title */}
              {editingSection === "mission" ? (
                <input
                  type="text"
                  value={tempContent.mission?.title || ""}
                  onChange={(e) => handleInputChange(e, "mission", "title")}
                  className="block w-full text-center text-6xl font-bold text-gray-900 font-playfair border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                />
              ) : (
                <h2 className="font-playfair text-6xl font-bold text-gray-900">
                  {content.mission.title}
                </h2>
              )}

              {/* Section Description */}
              {editingSection === "mission" ? (
                <textarea
                  value={tempContent.mission?.description || ""}
                  onChange={(e) =>
                    handleInputChange(e, "mission", "description")
                  }
                  className="block w-full mt-4 text-xl leading-relaxed text-gray-700 font-poppins border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                />
              ) : (
                <p className="text-xl leading-relaxed text-gray-700 font-poppins mt-4">
                  {content.mission.description}
                </p>
              )}

              {/* Save and Cancel Buttons */}
              {editingSection === "mission" && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Founder Section */}
          <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Edit Icon */}
              <button
                onClick={() => handleEditClick("founder")}
                className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
              >
                <FaPencilAlt size={20} />
              </button>

              {/* Section Title */}
              <h2 className="font-playfair text-6xl font-bold text-gray-900">
                Meet Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Founder
                </span>
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-12 mt-8">
                {/* Founder Image */}
                <div className="md:w-1/2">
                  {editingSection === "founder" ? (
                    <input
                      type="text"
                      value={tempContent.founder?.image || ""}
                      onChange={(e) => handleInputChange(e, "founder", "image")}
                      className="block w-full text-center text-gray-700 font-poppins border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                      placeholder="Enter Image URL"
                    />
                  ) : (
                    <ClientImage
                      src={content.founder.image}
                      alt={content.founder.name}
                      width={500}
                      height={500}
                      className="rounded-2xl shadow-2xl"
                    />
                  )}
                </div>

                {/* Founder Details */}
                <div className="md:w-1/2">
                  {editingSection === "founder" ? (
                    <>
                      <input
                        type="text"
                        value={tempContent.founder?.name || ""}
                        onChange={(e) =>
                          handleInputChange(e, "founder", "name")
                        }
                        className="block w-full text-4xl font-bold text-gray-900 font-playfair border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                        placeholder="Enter Founder Name"
                      />
                      <input
                        type="text"
                        value={tempContent.founder?.title || ""}
                        onChange={(e) =>
                          handleInputChange(e, "founder", "title")
                        }
                        className="block w-full mt-4 text-xl text-gray-700 font-poppins border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                        placeholder="Enter Founder Title"
                      />
                      <textarea
                        value={tempContent.founder?.quote || ""}
                        onChange={(e) =>
                          handleInputChange(e, "founder", "quote")
                        }
                        className="block w-full mt-4 text-lg italic text-gray-600 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                        placeholder="Enter Founder Quote"
                      />
                      {tempContent.founder?.description.map((desc, index) => (
                        <textarea
                          key={index}
                          value={desc}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "founder",
                              "description",
                              index
                            )
                          }
                          className="block w-full mt-4 text-lg text-gray-700 font-poppins border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                          placeholder={`Enter Description ${index + 1}`}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      <h3 className="text-4xl font-playfair font-bold">
                        {content.founder.name}
                      </h3>
                      <p className="text-xl font-poppins text-gray-700">
                        {content.founder.title}
                      </p>
                      <blockquote className="text-lg italic text-gray-600">
                        {content.founder.quote}
                      </blockquote>
                      {content.founder.description.map((desc, index) => (
                        <p
                          key={index}
                          className="text-lg text-gray-700 font-poppins"
                        >
                          {desc}
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Save and Cancel Buttons */}
              {editingSection === "founder" && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Co-Founder Section */}
          <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Edit Icon */}
              <button
                onClick={() => handleEditClick("cofounder")}
                className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
              >
                <FaPencilAlt size={20} />
              </button>

              {/* Section Title */}
              <h2 className="font-playfair text-6xl font-bold text-gray-900">
                Meet Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Co-Founder
                </span>
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-12 mt-8">
                {/* Co-Founder Image */}
                <div className="md:w-1/2">
                  {editingSection === "cofounder" ? (
                    <input
                      type="text"
                      value={tempContent.cofounder?.image || ""}
                      onChange={(e) =>
                        handleInputChange(e, "cofounder", "image")
                      }
                      className="block w-full text-center text-gray-700 font-poppins border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                      placeholder="Enter Image URL"
                    />
                  ) : (
                    <ClientImage
                      src={content.cofounder.image}
                      alt={content.cofounder.name}
                      width={500}
                      height={500}
                      className="rounded-2xl shadow-2xl"
                    />
                  )}
                </div>

                {/* Co-Founder Details */}
                <div className="md:w-1/2">
                  {editingSection === "cofounder" ? (
                    <>
                      <input
                        type="text"
                        value={tempContent.cofounder?.name || ""}
                        onChange={(e) =>
                          handleInputChange(e, "cofounder", "name")
                        }
                        className="block w-full text-4xl font-bold text-gray-900 font-playfair border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                        placeholder="Enter Co-Founder Name"
                      />
                      <input
                        type="text"
                        value={tempContent.cofounder?.title || ""}
                        onChange={(e) =>
                          handleInputChange(e, "cofounder", "title")
                        }
                        className="block w-full mt-4 text-xl text-gray-700 font-poppins border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                        placeholder="Enter Co-Founder Title"
                      />
                      <textarea
                        value={tempContent.cofounder?.quote || ""}
                        onChange={(e) =>
                          handleInputChange(e, "cofounder", "quote")
                        }
                        className="block w-full mt-4 text-lg italic text-gray-600 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                        placeholder="Enter Co-Founder Quote"
                      />
                      {tempContent.cofounder?.description.map((desc, index) => (
                        <textarea
                          key={index}
                          value={desc}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "cofounder",
                              "description",
                              index
                            )
                          }
                          className="block w-full mt-4 text-lg text-gray-700 font-poppins border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                          placeholder={`Enter Description ${index + 1}`}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      <h3 className="text-4xl font-playfair font-bold">
                        {content.cofounder.name}
                      </h3>
                      <p className="text-xl font-poppins text-gray-700">
                        {content.cofounder.title}
                      </p>
                      <blockquote className="text-lg italic text-gray-600">
                        {content.cofounder.quote}
                      </blockquote>
                      {content.cofounder.description.map((desc, index) => (
                        <p
                          key={index}
                          className="text-lg text-gray-700 font-poppins"
                        >
                          {desc}
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Save and Cancel Buttons */}
              {editingSection === "cofounder" && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Veterans Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            <div className="text-center mb-10">
              {/* Edit Icon */}
              <button
                onClick={() => handleEditClick("veterans")}
                className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
              >
                <FaPencilAlt size={20} />
              </button>

              <h2 className="font-playfair text-4xl font-bold text-gray-900">
                Battle-Hardened{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Veterans
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4"></div>

              {editingSection === "veterans" ? (
                <textarea
                  value={tempContent.veterans?.description || ""}
                  onChange={(e) =>
                    handleInputChange(e, "veterans", "description")
                  }
                  className="block w-full mt-4 text-gray-600 text-center max-w-2xl mx-auto border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                  placeholder="Enter Veterans Description"
                />
              ) : (
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  {content.veterans.description}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
              {editingSection === "veterans" ? (
                <div>
                  {/* Render each image object as a form */}
                  {tempContent.veterans?.images.map((image, index) => (
                    <div key={index} className="mb-4 border-b pb-4">
                      <label className="block mb-2">
                        Image URL:
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
                          className="block w-full mt-1 p-2 border rounded"
                        />
                      </label>
                      <label className="block mb-2">
                        Alt Text:
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
                          className="block w-full mt-1 p-2 border rounded"
                        />
                      </label>
                      <label className="block mb-2">
                        Info:
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
                          className="block w-full mt-1 p-2 border rounded"
                        />
                      </label>
                      <button
                        onClick={() =>
                          handleRemoveArrayItem("veterans", "images", index)
                        }
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {/* Add New Image */}
                  <button
                    onClick={() => handleAddArrayItem("veterans", "images")}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add New Image
                  </button>
                </div>
              ) : (
                <SliderWrapper images={content.veterans.images} />
              )}
            </div>

            {/* Save and Cancel Buttons */}
            {editingSection === "veterans" && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </section>

          {/* Core Members Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
            <div className="text-center mb-10">
              {/* Edit Icon */}
              <button
                onClick={() => handleEditClick("coreMembers")}
                className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
              >
                <FaPencilAlt size={20} />
              </button>

              <h2 className="font-playfair text-4xl font-bold text-gray-900">
                Other{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Core Members
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4"></div>

              {editingSection === "coreMembers" ? (
                <textarea
                  value={tempContent.coreMembers?.description || ""}
                  onChange={(e) =>
                    handleInputChange(e, "coreMembers", "description")
                  }
                  className="block w-full mt-4 text-gray-600 text-center max-w-2xl mx-auto border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                  placeholder="Enter Core Members Description"
                />
              ) : (
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  {content.coreMembers.description}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
              {editingSection === "coreMembers" ? (
                <div>
                  {/* Render each image object as a form */}
                  {tempContent.coreMembers?.images.map((image, index) => (
                    <div key={index} className="mb-4 border-b pb-4">
                      <label className="block mb-2">
                        Image URL:
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
                          className="block w-full mt-1 p-2 border rounded"
                        />
                      </label>
                      <label className="block mb-2">
                        Alt Text:
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
                          className="block w-full mt-1 p-2 border rounded"
                        />
                      </label>
                      <label className="block mb-2">
                        Info:
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
                          className="block w-full mt-1 p-2 border rounded"
                        />
                      </label>
                      <button
                        onClick={() =>
                          handleRemoveArrayItem("coreMembers", "images", index)
                        }
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {/* Add New Image */}
                  <button
                    onClick={() => handleAddArrayItem("coreMembers", "images")}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add New Image
                  </button>
                </div>
              ) : (
                <SliderWrapper images={content.coreMembers.images} />
              )}
            </div>

            {/* Save and Cancel Buttons */}
            {editingSection === "coreMembers" && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
