"use client";

import React, { useState } from 'react';

interface Reason {
  title: string;
  content: string;
}

const Reason99notes: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const reasons: Reason[] = [
    {
      title: "Experienced Faculty",
      content: "Our team of seasoned professionals has a deep understanding of the UPSC syllabus and examination pattern. We are committed to equipping students with the right strategies and techniques to ace the IAS exam."
    },
    {
      title: "Comprehensive Study Material",
      content: "Our study material is meticulously curated and regularly updated to include the latest developments and trends, ensuring our students are always ahead of the curve."
    },
    {
      title: "Regular Mock Tests",
      content: "Our IAS coaching program includes regular mock tests that mimic the UPSC exam pattern, providing students with a realistic experience of the exam."
    },
    {
      title: "Personalized Guidance",
      content: "We understand that every student is unique. Our faculty provides personalized guidance to each student, helping them overcome their weaknesses and build on their strengths."
    },
    {
      title: "Affordable Education",
      content: "We believe in making quality education accessible to all. Our IAS coaching program is competitively priced, ensuring that every aspiring IAS officer can benefit from our top-quality coaching."
    },
    {
      title: "Proven Track Record",
      content: "Join the leading UPSC coaching institute in Delhi with a consistent record of producing successful candidates. Our results speak for themselves."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <span className="text-slate-900 font-medium tracking-wider text-sm uppercase mb-4">Reason</span>
            <h2 className="text-4xl font-bold text-gray-900 pt-2 mb-4">
              Why 99Notes is the Best UPSC Coaching in Delhi
            </h2>
            <div className="w-24 h-1 bg-slate-900 mx-auto mt-2"></div>
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover why thousands of UPSC aspirants choose us as their preferred coaching institute
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:pb-0">
              <button
                onClick={() => setExpanded(expanded === index.toString() ? null : index.toString())}
                className="flex items-center justify-between w-full text-left text-gray-900 hover:text-blue-600 transition-colors"
              >
                <h3 className="text-lg font-semibold">{reason.title}</h3>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-300 ${
                    expanded === index.toString() ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`mt-2 overflow-hidden transition-all duration-300 ${
                  expanded === index.toString() ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 text-sm">{reason.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="bg-gradient-to-r from-gray-100 to-indigo-50 p-10 rounded-3xl shadow-inner">
            <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
              Choosing the right UPSC coaching in Delhi is crucial for your IAS journey. 
              <span className="font-semibold text-blue-800"> At 99Notes</span>, we are committed to providing the best IAS coaching experience, 
              helping you navigate your path with confidence and ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reason99notes;
