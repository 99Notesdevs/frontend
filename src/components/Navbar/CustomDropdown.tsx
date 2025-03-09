import React from 'react';
import Link from 'next/link';

interface CustomDropdownProps {
  title: string;
  items: { name: string; link: string | { [key: string]: string[] } }[];
  defaultDescription?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ title, items }) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const getFormattedLink = (path: string) => {
    return path.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  };

  const renderLink = (name: string, link: string | { [key: string]: string[] }) => {
    if (typeof link === 'string') {
      return link;
    }
    
    // Generate link based on section and item name
    const baseRoute = title.toLowerCase().replace(/\s+upsc/i, '').replace(/[^a-zA-Z0-9]/g, '-');
    
    // Special case for UPSC Notes
    if (title === 'UPSC Notes') {
      return `/upsc-notes/${getFormattedLink(name)}`;
    }
    
    // Special case for Current Affairs
    if (title === 'Current Affairs UPSC') {
      if (name === 'Daily Current Affairs') {
        return '/current-affairs/daily';
      }
      if (name === 'Monthly Current Affairs') {
        return '/current-affairs/monthly';
      }
      if (name === 'Yearly Current Affairs') {
        return '/current-affairs/yearly';
      }
      return `/current-affairs/${getFormattedLink(name)}`;
    }
    
    // Special case for Free Study Material
    if (title === 'Free Study Material') {
      if (name === 'Download PYQS') {
        return '/free-study-material/download-pyqs';
      }
      if (name === 'UPSC Syllabus') {
        return '/free-study-material/upsc-syllabus';
      }
      if (name === 'Indian Constitution') {
        return '/free-study-material/indian-constitution';
      }
    }
    
    // Special case for Exam Forum
    if (title === 'Exam Forum') {
      if (name === 'Recruitment Exams') {
        return '/exam-forum/recruitment-exams';
      }
      if (name === 'Higher Education') {
        return '/exam-forum/higher-education';
      }
    }
    
    return `/${baseRoute}/${getFormattedLink(name)}`;
  };

  const generateSubLink = (hoveredItem: string, subject: string, topic: string) => {
    const baseRoute = title.toLowerCase().replace(/\s+upsc/i, '').replace(/[^a-zA-Z0-9]/g, '-');
    
    // Special case for UPSC Notes
    if (title === 'UPSC Notes') {
      return `/upsc-notes/${getFormattedLink(hoveredItem)}/${getFormattedLink(subject)}/${getFormattedLink(topic)}`;
    }
    
    // Special case for Current Affairs
    if (title === 'Current Affairs UPSC') {
      const currentAffairsMap: { [key: string]: string } = {
        'Daily Current Affairs': 'daily',
        'Monthly Current Affairs': 'monthly',
        'Yearly Current Affairs': 'yearly'
      };
      
      const topicMap: { [key: string]: string } = {
        'Daily Current Affairs': 'news-analysis',
        'The Hindu Editorial': 'hindu-editorial',
        'Indian Express Editorial': 'indian-express-editorial',
        'PIB': 'pib',
        'Daily Quiz': 'daily-quiz',
        'Daily Answer Writing': 'daily-answer-writing'
      };

      const section = currentAffairsMap[hoveredItem] || getFormattedLink(hoveredItem);
      const mappedTopic = topicMap[topic] || getFormattedLink(topic);
      
      return `/current-affairs/${section}/${mappedTopic}`;
    }
    
    // Special case for Free Study Material
    if (title === 'Free Study Material') {
      if (hoveredItem === 'UPSC Syllabus') {
        const syllabusMap: { [key: string]: string } = {
          'UPSC Prelims Syllabus': 'prelims',
          'UPSC Mains Syllabus': 'mains',
          'UPSC Optional Syllabus': 'optional'
        };
        return `/free-study-material/upsc-syllabus/syllabus/${syllabusMap[topic] || getFormattedLink(topic)}`;
      }
      if (hoveredItem === 'Download PYQS') {
        return `/free-study-material/download-pyqs/${getFormattedLink(subject)}/${getFormattedLink(topic)}`;
      }
      if (hoveredItem === 'Indian Constitution') {
        return `/free-study-material/indian-constitution/${getFormattedLink(subject)}/${getFormattedLink(topic)}`;
      }
    }
    
    // Special case for Exam Forum
    if (title === 'Exam Forum') {
      if (hoveredItem === 'Recruitment Exams') {
        return `/exam-forum/recruitment-exams/${getFormattedLink(subject)}/${getFormattedLink(topic)}`;
      }
      if (hoveredItem === 'Higher Education') {
        return `/exam-forum/higher-education/${getFormattedLink(subject)}/${getFormattedLink(topic)}`;
      }
    }
    
    return `/${baseRoute}/${getFormattedLink(hoveredItem)}/${getFormattedLink(subject)}/${getFormattedLink(topic)}`;
  };

  return (
    <div className="group relative">
      {/* Main Menu Item */}
      <Link 
        href={`/${title.toLowerCase().replace(/\s+upsc/i, '').replace(/[^a-zA-Z0-9]/g, '-')}`}
        className="flex items-center space-x-2 text-gray-800 py-6 px-2 hover:text-blue-700"
      >
        <span className="text-[14px] font-bold tracking-wide whitespace-nowrap">{title}</span>
        <svg
          className="w-3.5 h-3.5 text-gray-500 transition-transform group-hover:rotate-180 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>

      {/* Dropdown Menu */}
      <div className="absolute left-0 top-full min-w-[800px] bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-in-out z-50">
        <div className="flex">
          {/* Left Column */}
          <div className="w-1/2 border-r border-gray-200">
            <div className="p-4">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">{title}</h3>
              <div className="space-y-1">
                {items.map((item) => (
                  <div 
                    key={item.name} 
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.name)}
                  >
                    <Link 
                      href={renderLink(item.name, item.link)}
                      className={`flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer rounded ${hoveredItem === item.name ? 'bg-gray-50' : ''}`}
                    >
                      <span className={`text-[13px] font-medium ${hoveredItem === item.name ? 'text-blue-700' : ''}`}>
                        {item.name}
                      </span>
                      {typeof item.link === 'object' && (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="w-1/2 p-4">
            {hoveredItem && (
              <div className="space-y-4">
                {items.find(item => item.name === hoveredItem)?.link && typeof items.find(item => item.name === hoveredItem)?.link === 'object' && (
                  Object.entries(items.find(item => item.name === hoveredItem)?.link as { [key: string]: string[] }).map(([subject, topics]) => (
                    <div key={subject} className="space-y-2">
                      <h3 className="text-[14px] font-semibold text-gray-900">{subject}</h3>
                      <ul className="space-y-1">
                        {topics.map((topic) => (
                          topic && (
                            <li key={topic}>
                              <Link 
                                href={generateSubLink(hoveredItem, subject, topic)}
                                className="text-[13px] text-gray-600 hover:text-blue-700 flex items-center"
                              >
                                <span className="mr-1.5 text-gray-400">›</span>
                                {topic}
                              </Link>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDropdown;
