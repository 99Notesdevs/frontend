import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaUserGraduate, FaBriefcase, FaUniversity, FaUsers } from "react-icons/fa";

const examForumCategories = {
  "Recruitment Exams": {
    icon: <FaBriefcase className="w-6 h-6" />,
    description: "Government job recruitment examinations at various levels",
    groups: {
      "Group A": {
        icon: <FaUserGraduate className="w-5 h-5" />,
        description: "Top-level administrative and civil services positions",
        exams: [
          { name: "Civil Services", description: "UPSC IAS, IPS, IFS and other central services" },
          { name: "UPSC", description: "Various Union Public Service Commission examinations" },
          { name: "UPPCS", description: "Uttar Pradesh Public Service Commission" },
          { name: "MPPSC", description: "Madhya Pradesh Public Service Commission" },
          { name: "MPSC", description: "Maharashtra Public Service Commission" },
          { name: "Other States", description: "PSC examinations of other states" }
        ]
      },
      "Group B": {
        icon: <FaUniversity className="w-5 h-5" />,
        description: "Gazetted officer positions in various departments",
        exams: [
          { name: "NDA/CDS", description: "Defence Services entrance examinations" },
          { name: "SSC (CGL)", description: "Combined Graduate Level examination" },
          { name: "State SSC", description: "State Staff Selection Commission exams" },
          { name: "RBI", description: "Reserve Bank of India recruitment" },
          { name: "Insurance Exams", description: "LIC, GIC and other insurance sector jobs" },
          { name: "NABARD", description: "National Bank for Agriculture and Rural Development" },
          { name: "Teaching Exams", description: "NET, SET and other teaching positions" },
          { name: "Judiciary Exams", description: "State judicial services examinations" }
        ]
      },
      "Group C&D": {
        icon: <FaUsers className="w-5 h-5" />,
        description: "Non-gazetted positions across departments",
        exams: [
          { name: "Railways", description: "Various railway recruitment board examinations" },
          { name: "SSC (CHSL)", description: "Combined Higher Secondary Level" },
          { name: "Banking", description: "Bank PO, Clerk and specialist officer posts" },
          { name: "Agniveer", description: "Armed forces recruitment under Agnipath scheme" },
          { name: "Police Constable", description: "State police constable recruitment" },
          { name: "RRB Group D", description: "Railway Group D positions" }
        ]
      }
    }
  },
  "Higher Education": {
    icon: <FaUniversity className="w-6 h-6" />,
    description: "Entrance examinations for higher education institutions",
    groups: {
      "National Level": {
        icon: <FaUserGraduate className="w-5 h-5" />,
        description: "Major national level entrance examinations",
        exams: [
          { name: "CUET", description: "Common University Entrance Test" },
          { name: "JEE", description: "Joint Entrance Examination for engineering" },
          { name: "NEET", description: "National Eligibility cum Entrance Test for medical" },
          { name: "CLAT", description: "Common Law Admission Test" },
          { name: "CA Foundation", description: "Chartered Accountancy foundation level" }
        ]
      }
    }
  }
};

const ExamForum: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Exam Forum - 99Notes</title>
        <meta 
          name="description" 
          content="Join discussions and get insights on various recruitment and higher education exams. Connect with fellow aspirants and experts." 
        />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Exam Forum</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Join our vibrant community of exam aspirants. Discuss strategies, share resources, and connect with fellow candidates.
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8">
          {Object.entries(examForumCategories).map(([category, { icon, description, groups }]) => (
            <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                    <p className="text-gray-600 mt-1">{description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(groups).map(([groupName, { icon: groupIcon, description: groupDesc, exams }]) => (
                    <div key={groupName} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {groupIcon}
                        <h3 className="text-xl font-semibold text-gray-900">{groupName}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{groupDesc}</p>
                      <ul className="space-y-2">
                        {exams.map((exam) => (
                          <li key={exam.name}>
                            <Link 
                              href={`/exam-forum/${category.toLowerCase().replace(/ /g, "-")}/${groupName.toLowerCase().replace(/ /g, "-")}/${exam.name.toLowerCase().replace(/ /g, "-")}`}
                              className="block p-3 bg-white rounded border border-gray-200 hover:border-blue-500 transition-colors"
                            >
                              <span className="font-medium text-gray-900">{exam.name}</span>
                              <p className="text-sm text-gray-600 mt-1">{exam.description}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
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

export default ExamForum;
