import React from "react";
import CurrentAffairsTemplate from "../../../../components/CurrentAffairsTemplate";

const mainsData = {
  title: "Main Examination",
  description: "Written examination consisting of 9 papers, including 2 qualifying papers in languages",
  papers: [
    {
      name: "Qualifying Papers",
      topics: [
        "Paper A - Any Indian Language (300 marks)",
        "Paper B - English (300 marks)"
      ],
      note: "Qualifying in nature - marks not counted for ranking"
    },
    {
      name: "Essay",
      topics: ["Paper I - Essay (250 marks)"],
      duration: "3 hours",
      note: "Choice of topics from various fields"
    },
    {
      name: "General Studies",
      topics: [
        "Paper I - Indian Heritage and Culture, History and Geography (250 marks)",
        "Paper II - Governance, Constitution, Polity, Social Justice (250 marks)",
        "Paper III - Technology, Economic Development, Biodiversity, Security (250 marks)",
        "Paper IV - Ethics, Integrity and Aptitude (250 marks)"
      ],
      duration: "3 hours each"
    },
    {
      name: "Optional Subject",
      topics: [
        "Paper I - Optional Subject (250 marks)",
        "Paper II - Optional Subject (250 marks)"
      ],
      duration: "3 hours each",
      note: "One subject to be selected from the list of optional subjects"
    }
  ]
};

const MainsPage: React.FC = () => {
  const navItems = [
    { title: "UPSC Prelims Syllabus", path: "/free-study-material/upsc-syllabus/syllabus/prelims" },
    { title: "UPSC Mains Syllabus", path: "/free-study-material/upsc-syllabus/syllabus/mains" },
    { title: "UPSC Optional Syllabus", path: "/free-study-material/upsc-syllabus/syllabus/optional" }
  ];

  return (
    <CurrentAffairsTemplate
      title={mainsData.title}
      description={mainsData.description}
      navItems={navItems}
    >
      <div className="space-y-6">
        {mainsData.papers.map((paper, pIndex) => (
          <div key={pIndex} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{paper.name}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Papers:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {paper.topics.map((topic, tIndex) => (
                    <li key={tIndex}>{topic}</li>
                  ))}
                </ul>
              </div>
              {paper.duration && (
                <div className="text-sm text-gray-600">
                  Duration: {paper.duration}
                </div>
              )}
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

export default MainsPage;
