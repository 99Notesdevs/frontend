import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaUserGraduate, FaStethoscope, FaBalanceScale, FaCalculator, FaUniversity } from "react-icons/fa";

const examCategories = [
  {
    title: "Engineering & Technology",
    icon: <FaCalculator className="w-8 h-8" />,
    description: "National level engineering entrance examinations",
    exams: [
      {
        name: "JEE Main",
        description: "Joint Entrance Examination for B.Tech/B.E admissions",
        conductedBy: "National Testing Agency (NTA)",
        frequency: "Twice a year",
        eligibility: "12th with PCM"
      },
      {
        name: "JEE Advanced",
        description: "IIT entrance examination for B.Tech programs",
        conductedBy: "IITs",
        frequency: "Once a year",
        eligibility: "Qualify JEE Main"
      },
      {
        name: "GATE",
        description: "Graduate Aptitude Test in Engineering for M.Tech/PSU jobs",
        conductedBy: "IITs & IISc",
        frequency: "Once a year",
        eligibility: "Engineering graduate"
      }
    ]
  },
  {
    title: "Medical & Healthcare",
    icon: <FaStethoscope className="w-8 h-8" />,
    description: "Medical entrance examinations for various healthcare programs",
    exams: [
      {
        name: "NEET UG",
        description: "National Eligibility cum Entrance Test for MBBS/BDS",
        conductedBy: "National Testing Agency (NTA)",
        frequency: "Once a year",
        eligibility: "12th with PCB"
      },
      {
        name: "NEET PG",
        description: "Entrance test for MD/MS/PG Diploma courses",
        conductedBy: "National Board of Examinations",
        frequency: "Once a year",
        eligibility: "MBBS degree"
      },
      {
        name: "AIIMS",
        description: "All India Institute of Medical Sciences entrance test",
        conductedBy: "AIIMS",
        frequency: "Once a year",
        eligibility: "12th with PCB"
      }
    ]
  },
  {
    title: "Law",
    icon: <FaBalanceScale className="w-8 h-8" />,
    description: "Law entrance examinations for UG and PG programs",
    exams: [
      {
        name: "CLAT",
        description: "Common Law Admission Test for National Law Universities",
        conductedBy: "Consortium of NLUs",
        frequency: "Once a year",
        eligibility: "12th pass for UG, LLB for PG"
      },
      {
        name: "AILET",
        description: "All India Law Entrance Test for NLU Delhi",
        conductedBy: "NLU Delhi",
        frequency: "Once a year",
        eligibility: "12th pass"
      }
    ]
  },
  {
    title: "Management",
    icon: <FaUserGraduate className="w-8 h-8" />,
    description: "Management entrance examinations for MBA and related programs",
    exams: [
      {
        name: "CAT",
        description: "Common Admission Test for IIMs and other B-schools",
        conductedBy: "IIMs",
        frequency: "Once a year",
        eligibility: "Graduate in any discipline"
      },
      {
        name: "XAT",
        description: "Xavier Aptitude Test for XLRI and other institutes",
        conductedBy: "XLRI",
        frequency: "Once a year",
        eligibility: "Graduate in any discipline"
      },
      {
        name: "MAT",
        description: "Management Aptitude Test",
        conductedBy: "AIMA",
        frequency: "4 times a year",
        eligibility: "Graduate in any discipline"
      }
    ]
  },
  {
    title: "Central Universities",
    icon: <FaUniversity className="w-8 h-8" />,
    description: "Common entrance tests for central universities",
    exams: [
      {
        name: "CUET UG",
        description: "Common University Entrance Test for UG programs",
        conductedBy: "National Testing Agency (NTA)",
        frequency: "Once a year",
        eligibility: "12th pass"
      },
      {
        name: "CUET PG",
        description: "Common University Entrance Test for PG programs",
        conductedBy: "National Testing Agency (NTA)",
        frequency: "Once a year",
        eligibility: "Graduate in relevant discipline"
      }
    ]
  }
];

const HigherEducationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Higher Education Entrance Exams - 99Notes</title>
        <meta 
          name="description" 
          content="Complete information about various higher education entrance examinations in India including JEE, NEET, CLAT, CAT, and more." 
        />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Higher Education Entrance Exams</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Comprehensive guide to national level entrance examinations for various higher education programs in India
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8">
          {examCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {category.icon}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.exams.map((exam) => (
                    <div key={exam.name} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{exam.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{exam.description}</p>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="font-medium text-gray-700">Conducted By:</dt>
                          <dd className="text-gray-600">{exam.conductedBy}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-700">Frequency:</dt>
                          <dd className="text-gray-600">{exam.frequency}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-700">Eligibility:</dt>
                          <dd className="text-gray-600">{exam.eligibility}</dd>
                        </div>
                      </dl>
                      <div className="mt-4">
                        <Link
                          href={`/exam-forum/higher-education/${exam.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HigherEducationPage; 