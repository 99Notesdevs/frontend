import React from "react";
import CurrentAffairsTemplate from "../../../../components/CurrentAffairsTemplate";

const optionalData = {
  title: "Optional Subjects",
  description: "Choose one optional subject for two papers (500 marks total)",
  subjects: [
    {
      category: "Literature",
      options: [
        "Assamese Literature",
        "Bengali Literature",
        "English Literature",
        "Hindi Literature",
        "Kannada Literature",
        "Malayalam Literature",
        "Tamil Literature",
        "Telugu Literature",
        "Urdu Literature"
      ]
    },
    {
      category: "Humanities",
      options: [
        "Anthropology",
        "Economics",
        "Geography",
        "History",
        "Philosophy",
        "Political Science and International Relations",
        "Psychology",
        "Public Administration",
        "Sociology"
      ]
    },
    {
      category: "Sciences",
      options: [
        "Agriculture",
        "Animal Husbandry & Veterinary Science",
        "Botany",
        "Chemistry",
        "Civil Engineering",
        "Mathematics",
        "Physics",
        "Statistics",
        "Zoology"
      ]
    }
  ],
  examFormat: {
    papers: [
      "Paper I - 250 marks (3 hours)",
      "Paper II - 250 marks (3 hours)"
    ],
    totalMarks: "500 marks",
    medium: "Can be written in any language listed in the 8th Schedule of Constitution or in English"
  },
  importantNotes: [
    "Candidates must choose only one optional subject",
    "Both papers must be attempted in the same language",
    "The syllabus for each optional subject is equivalent to an Honours degree level",
    "Questions will test knowledge of the subject at an advanced level",
    "Answers must be written in the medium declared by the candidate in the application form"
  ]
};

const OptionalPage: React.FC = () => {
  const navItems = [
    { title: "UPSC Prelims Syllabus", path: "/free-study-material/upsc-syllabus/syllabus/prelims" },
    { title: "UPSC Mains Syllabus", path: "/free-study-material/upsc-syllabus/syllabus/mains" },
    { title: "UPSC Optional Syllabus", path: "/free-study-material/upsc-syllabus/syllabus/optional" }
  ];

  return (
    <CurrentAffairsTemplate
      title={optionalData.title}
      description={optionalData.description}
      navItems={navItems}
    >
      <div className="space-y-8">
        {/* Exam Format */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Examination Format</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Papers:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {optionalData.examFormat.papers.map((paper, index) => (
                  <li key={index}>{paper}</li>
                ))}
              </ul>
            </div>
            <div className="text-gray-600">
              <p>Total Marks: {optionalData.examFormat.totalMarks}</p>
              <p className="mt-2">Medium: {optionalData.examFormat.medium}</p>
            </div>
          </div>
        </div>

        {/* Subject Categories */}
        {optionalData.subjects.map((category, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.options.map((subject, sIndex) => (
                <div key={sIndex} className="bg-gray-50 rounded p-3 text-gray-700">
                  {subject}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Important Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Important Notes</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {optionalData.importantNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </CurrentAffairsTemplate>
  );
};

export default OptionalPage;
