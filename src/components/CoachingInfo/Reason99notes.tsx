"use client";

import React from 'react';

interface Reason {
  title: string;
  description: string;
  footer: string;
  reasons: {
    title: string;
    content: string;
  }[];
}

const Reason99notes: React.FC<Reason> = ({ title, description, footer, reasons }) => {
// const reasons: Reason[] = [
  //   {
  //     title: "Experienced Faculty",
  //     content: "Our team of seasoned professionals has a deep understanding of the UPSC syllabus and examination pattern. We are committed to equipping students with the right strategies and techniques to ace the IAS exam."
  //   },
  //   {
  //     title: "Comprehensive Study Material",
  //     content: "Our study material is meticulously curated and regularly updated to include the latest developments and trends, ensuring our students are always ahead of the curve."
  //   },
  //   {
  //     title: "Regular Mock Tests",
  //     content: "Our IAS coaching program includes regular mock tests that mimic the UPSC exam pattern, providing students with a realistic experience of the exam."
  //   },
  //   {
  //     title: "Personalized Guidance",
  //     content: "We understand that every student is unique. Our faculty provides personalized guidance to each student, helping them overcome their weaknesses and build on their strengths."
  //   },
  //   {
  //     title: "Affordable Education",
  //     content: "We believe in making quality education accessible to all. Our IAS coaching program is competitively priced, ensuring that every aspiring IAS officer can benefit from our top-quality coaching."
  //   },
  //   {
  //     title: "Proven Track Record",
  //     content: "Join the leading UPSC coaching institute in Delhi with a consistent record of producing successful candidates. Our results speak for themselves."
  //   }
  // ];

  return (
    <div className="bg-gradient-to-b from-[var(--bg-main)] to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <span className="text-[var(--primary)] font-medium tracking-wider text-sm uppercase mb-4 font-opensans">Reason</span>
            <h2 className="text-3xl font-semibold text-[var(--surface-darker)] pt-2 mb-4 font-opensans">
              {title}
            </h2>
            <div className="w-24 h-1 bg-[var(--primary)] mx-auto mt-2"></div>
          </div>
          <p className="text-[var(--text-strong)] mt-4 max-w-2xl mx-auto font-normal font-opensans">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="border-b border-[var(--border-light)] pb-4 last:pb-0">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-medium text-[var(--surface-darker)] font-opensans">{reason.title}</h3>
              </div>
              <div className="mt-2">
                <p className="text-[var(--text-strong)] text-sm font-normal font-opensans">{reason.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="bg-gradient-to-r from-[var(--bg-elevated)] to-[var(--bg-subtle)] p-10 rounded-3xl shadow-inner">
            <p className="text-lg text-[var(--text-strong)] text-center max-w-3xl mx-auto leading-relaxed font-opensans">
              {footer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reason99notes;
