import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaUserGraduate, FaBriefcase, FaUsers } from "react-icons/fa";

const recruitmentGroups = [
  {
    title: "Group A",
    icon: <FaUserGraduate className="w-8 h-8" />,
    description: "Top-level administrative and civil services positions",
    path: "/exam-forum/recruitment-exams/group-a",
    exams: [
      "Civil Services (IAS, IPS, IFS)",
      "UPSC Engineering Services",
      "UPPCS",
      "MPPSC",
      "MPSC",
      "Other State PSCs"
    ]
  },
  {
    title: "Group B",
    icon: <FaBriefcase className="w-8 h-8" />,
    description: "Gazetted officer positions in various departments",
    path: "/exam-forum/recruitment-exams/group-b",
    exams: [
      "NDA/CDS",
      "SSC (CGL)",
      "State SSC",
      "RBI Grade B",
      "Insurance Officers",
      "NABARD Grade B",
      "UGC NET",
      "Judicial Services"
    ]
  },
  {
    title: "Group C & D",
    icon: <FaUsers className="w-8 h-8" />,
    description: "Non-gazetted positions across departments",
    path: "/exam-forum/recruitment-exams/group-c-and-d",
    exams: [
      "Railways (RRB)",
      "SSC (CHSL)",
      "Bank PO/Clerk",
      "Agniveer",
      "Police Constable",
      "RRB Group D"
    ]
  }
];

const RecruitmentExams: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Government Recruitment Exams - 99Notes</title>
        <meta 
          name="description" 
          content="Comprehensive information about various government recruitment examinations in India. Prepare for Group A, B, C & D positions." 
        />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Government Recruitment Exams</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Prepare for various government job examinations with comprehensive study materials, exam patterns, and discussions.
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recruitmentGroups.map((group) => (
            <div key={group.title} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {group.icon}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{group.title}</h2>
                    <p className="text-gray-600 mt-1">{group.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <ul className="space-y-2">
                  {group.exams.map((exam) => (
                    <li key={exam}>
                      <Link
                        href={`${group.path}/${exam.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                        className="block p-3 bg-gray-50 rounded border border-gray-200 hover:border-blue-500 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{exam}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    href={group.path}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View All {group.title} Exams
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RecruitmentExams; 