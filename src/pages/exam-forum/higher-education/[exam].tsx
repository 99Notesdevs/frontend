import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { FaCalendar, FaBook, FaClipboardList, FaGraduationCap, FaFileAlt, FaChartLine } from "react-icons/fa";

// This would typically come from an API or database
const examData = {
  "jee-main": {
    title: "JEE Main",
    description: "Joint Entrance Examination (Main) is an all-India test for admission to various engineering colleges including NITs and IIITs.",
    pattern: {
      sections: [
        {
          name: "Physics",
          details: [
            "25 questions (20 MCQs + 5 Numerical)",
            "100 marks",
            "Topics from 11th and 12th Physics"
          ]
        },
        {
          name: "Chemistry",
          details: [
            "25 questions (20 MCQs + 5 Numerical)",
            "100 marks",
            "Topics from 11th and 12th Chemistry"
          ]
        },
        {
          name: "Mathematics",
          details: [
            "25 questions (20 MCQs + 5 Numerical)",
            "100 marks",
            "Topics from 11th and 12th Mathematics"
          ]
        }
      ]
    },
    eligibility: {
      education: "12th pass with Physics, Chemistry, and Mathematics",
      age: "No age limit",
      attempts: "Can appear twice in same year",
      nationality: "Indian nationals and OCI/PIO"
    },
    syllabus: {
      physics: [
        "Mechanics",
        "Electricity and Magnetism",
        "Optics",
        "Modern Physics",
        "Heat and Thermodynamics"
      ],
      chemistry: [
        "Physical Chemistry",
        "Organic Chemistry",
        "Inorganic Chemistry",
        "General Chemistry"
      ],
      mathematics: [
        "Algebra",
        "Calculus",
        "Coordinate Geometry",
        "Trigonometry",
        "Statistics and Probability"
      ]
    },
    importantDates: {
      registration: "November-December",
      firstAttempt: "January-February",
      secondAttempt: "March-April",
      result: "Within a month of exam"
    },
    preparation: {
      books: [
        "HC Verma - Physics",
        "RD Sharma - Mathematics",
        "MS Chouhan - Organic Chemistry",
        "NCERT Books (11th & 12th)"
      ],
      tips: [
        "Focus on NCERT thoroughly",
        "Practice numerical problems regularly",
        "Take mock tests",
        "Time management is crucial",
        "Understand concepts rather than memorizing"
      ]
    }
  },
  "neet-ug": {
    title: "NEET UG",
    description: "National Eligibility cum Entrance Test (UG) is the qualifying entrance exam for MBBS and BDS courses in India.",
    pattern: {
      sections: [
        {
          name: "Physics",
          details: [
            "45 questions",
            "180 marks",
            "Topics from 11th and 12th Physics"
          ]
        },
        {
          name: "Chemistry",
          details: [
            "45 questions",
            "180 marks",
            "Topics from 11th and 12th Chemistry"
          ]
        },
        {
          name: "Biology",
          details: [
            "90 questions",
            "360 marks",
            "Topics from 11th and 12th Biology (Botany & Zoology)"
          ]
        }
      ]
    },
    eligibility: {
      education: "12th pass with Physics, Chemistry, and Biology",
      age: "17-25 years",
      attempts: "Unlimited attempts",
      nationality: "Indian nationals and OCI/PIO"
    },
    syllabus: {
      physics: [
        "Mechanics",
        "Electricity and Magnetism",
        "Optics and Modern Physics",
        "Heat and Thermodynamics"
      ],
      chemistry: [
        "Physical Chemistry",
        "Organic Chemistry",
        "Inorganic Chemistry"
      ],
      biology: [
        "Cell Biology",
        "Plant Physiology",
        "Human Physiology",
        "Genetics and Evolution",
        "Biotechnology"
      ]
    },
    importantDates: {
      registration: "March-April",
      examination: "May",
      result: "June-July",
      counselling: "July-September"
    },
    preparation: {
      books: [
        "NCERT Biology (11th & 12th)",
        "NCERT Physics (11th & 12th)",
        "NCERT Chemistry (11th & 12th)",
        "Trueman's Biology",
        "MTG Fingertips Biology"
      ],
      tips: [
        "NCERT is the bible for NEET preparation",
        "Practice previous year questions",
        "Focus on NCERT diagrams",
        "Regular revision is key",
        "Take mock tests for practice"
      ]
    }
  }
  // Add more exams here
};

const ExamPage: React.FC = () => {
  const router = useRouter();
  const { exam } = router.query;
  const examInfo = examData[exam as keyof typeof examData];

  if (!examInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{examInfo.title} - Exam Details - 99Notes</title>
        <meta 
          name="description" 
          content={`Complete information about ${examInfo.title} including exam pattern, syllabus, eligibility criteria, and preparation tips.`} 
        />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{examInfo.title}</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              {examInfo.description}
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Exam Pattern */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaClipboardList className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Exam Pattern</h2>
                </div>
                <div className="space-y-6">
                  {examInfo.pattern.sections.map((section, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.name}</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {section.details.map((detail, dIndex) => (
                          <li key={dIndex}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Syllabus */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaBook className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Syllabus</h2>
                </div>
                <div className="space-y-6">
                  {Object.entries(examInfo.syllabus).map(([subject, topics]) => (
                    <div key={subject}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">{subject}</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {topics.map((topic: string, index: number) => (
                          <li key={index}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preparation Tips */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaChartLine className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Preparation Guide</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Books</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {examInfo.preparation.books.map((book, index) => (
                        <li key={index}>{book}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Preparation Tips</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {examInfo.preparation.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            {/* Eligibility */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaGraduationCap className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Eligibility</h2>
                </div>
                <dl className="space-y-4">
                  {Object.entries(examInfo.eligibility).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-medium text-gray-900 capitalize">{key}</dt>
                      <dd className="text-gray-600 mt-1">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaCalendar className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Important Dates</h2>
                </div>
                <dl className="space-y-4">
                  {Object.entries(examInfo.importantDates).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                      <dd className="text-gray-600 mt-1">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaFileAlt className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Quick Links</h2>
                </div>
                <div className="space-y-3">
                  <Link
                    href="#"
                    className="block w-full px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                  >
                    Previous Year Papers
                  </Link>
                  <Link
                    href="#"
                    className="block w-full px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                  >
                    Study Material
                  </Link>
                  <Link
                    href="#"
                    className="block w-full px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                  >
                    Mock Tests
                  </Link>
                  <Link
                    href="#"
                    className="block w-full px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                  >
                    Official Website
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamPage; 