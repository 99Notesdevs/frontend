import React from "react";
import CurrentAffairsTemplate from "../../../../components/CurrentAffairsTemplate";

const prelimsData = {
  title: "Preliminary Examination",
  description: "Two papers of objective type (multiple choice questions) and carry a maximum of 400 marks",
  papers: [
    {
      name: "General Studies Paper I (200 marks)",
      topics: [
        "Current events of national and international importance",
        "History of India and Indian National Movement",
        "Indian and World Geography - Physical, Social, Economic Geography of India and the World",
        "Indian Polity and Governance - Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues, etc.",
        "Economic and Social Development - Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives, etc.",
        "Environmental Ecology, Biodiversity and Climate Change",
        "General Science and Technology"
      ],
      duration: "2 hours",
      questions: "100 questions"
    },
    {
      name: "CSAT - General Studies Paper II (200 marks)",
      topics: [
        "Comprehension",
        "Interpersonal skills including communication skills",
        "Logical reasoning and analytical ability",
        "Decision making and problem solving",
        "General mental ability",
        "Basic numeracy and data interpretation (Class X level)"
      ],
      duration: "2 hours",
      questions: "80 questions",
      note: "Qualifying in nature - minimum 33% marks required"
    }
  ]
};

const PrelimsPage: React.FC = () => {
  const navItems = [
    { title: "UPSC Prelims Syllabus", path: "/free-study-material/upsc-syllabus/syllabus/prelims" },
    { title: "UPSC Mains Syllabus", path: "/free-study-material/upsc-syllabus/syllabus/mains" },
    { title: "UPSC Optional Syllabus", path: "/free-study-material/upsc-syllabus/syllabus/optional" }
  ];

  return (
    <CurrentAffairsTemplate
      title={prelimsData.title}
      description={prelimsData.description}
      navItems={navItems}
    >
      <div className="space-y-6">
        {prelimsData.papers.map((paper, pIndex) => (
          <div key={pIndex} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{paper.name}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Topics Covered:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {paper.topics.map((topic, tIndex) => (
                    <li key={tIndex}>{topic}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div>Duration: {paper.duration}</div>
                <div>Questions: {paper.questions}</div>
              </div>
              {paper.note && (
                <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-3 rounded">
                  Note: {paper.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </CurrentAffairsTemplate>
  );
};

export default PrelimsPage;
