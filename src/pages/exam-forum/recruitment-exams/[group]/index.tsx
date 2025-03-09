import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { FaUserGraduate, FaBriefcase, FaUsers } from "react-icons/fa";

const groupData = {
  "group-a": {
    title: "Group A",
    icon: <FaUserGraduate className="w-8 h-8" />,
    description: "Top-level administrative and civil services positions",
    exams: [
      {
        name: "Civil Services (IAS, IPS, IFS)",
        description: "Premier civil services examination conducted by UPSC",
        pattern: "Prelims, Mains, and Interview",
        eligibility: "Graduate in any discipline",
        lastDate: "Typically in March",
        notification: "February-March"
      },
      {
        name: "UPSC Engineering Services",
        description: "Technical services under the Government of India",
        pattern: "Prelims, Mains, and Interview",
        eligibility: "B.E/B.Tech in relevant discipline",
        lastDate: "October",
        notification: "September"
      },
      {
        name: "UPPCS",
        description: "State civil services of Uttar Pradesh",
        pattern: "Prelims and Mains",
        eligibility: "Graduate in any discipline",
        lastDate: "Varies yearly",
        notification: "Annual"
      },
      // Add more exams with details
    ]
  },
  "group-b": {
    title: "Group B",
    icon: <FaBriefcase className="w-8 h-8" />,
    description: "Gazetted officer positions in various departments",
    exams: [
      {
        name: "SSC CGL",
        description: "Combined Graduate Level examination for various posts",
        pattern: "Tier I, II, III, and IV",
        eligibility: "Graduate in any discipline",
        lastDate: "Varies",
        notification: "December-January"
      },
      {
        name: "RBI Grade B",
        description: "Officers in Reserve Bank of India",
        pattern: "Phase I and Phase II",
        eligibility: "Graduate with 60% marks",
        lastDate: "Varies",
        notification: "Annual"
      },
      // Add more exams with details
    ]
  },
  "group-c-and-d": {
    title: "Group C & D",
    icon: <FaUsers className="w-8 h-8" />,
    description: "Non-gazetted positions across departments",
    exams: [
      {
        name: "SSC CHSL",
        description: "Combined Higher Secondary Level for clerical posts",
        pattern: "Tier I and Tier II",
        eligibility: "12th Pass",
        lastDate: "Varies",
        notification: "December"
      },
      {
        name: "Railways RRB",
        description: "Various posts in Indian Railways",
        pattern: "CBT 1 and CBT 2",
        eligibility: "Varies by post",
        lastDate: "Varies",
        notification: "As per vacancy"
      },
      // Add more exams with details
    ]
  }
};

const GroupPage: React.FC = () => {
  const router = useRouter();
  const { group } = router.query;
  const groupInfo = groupData[group as keyof typeof groupData];

  if (!groupInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{groupInfo.title} Exams - Government Recruitment - 99Notes</title>
        <meta 
          name="description" 
          content={`Complete information about ${groupInfo.title} recruitment examinations, including exam pattern, eligibility, and important dates.`} 
        />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex justify-center mb-4">
              {groupInfo.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{groupInfo.title} Examinations</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              {groupInfo.description}
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6">
          {groupInfo.exams.map((exam) => (
            <div key={exam.name} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{exam.name}</h2>
                <p className="text-gray-600 mb-4">{exam.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-medium text-gray-900 mb-2">Exam Pattern</h3>
                    <p className="text-gray-600">{exam.pattern}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-medium text-gray-900 mb-2">Eligibility</h3>
                    <p className="text-gray-600">{exam.eligibility}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-medium text-gray-900 mb-2">Important Dates</h3>
                    <p className="text-gray-600">
                      Last Date: {exam.lastDate}<br />
                      Notification: {exam.notification}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/exam-forum/recruitment-exams/${group}/${exam.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Details & Discussions
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

export default GroupPage; 