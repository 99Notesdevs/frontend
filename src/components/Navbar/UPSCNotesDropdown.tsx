import React from 'react';
import Link from 'next/link';

interface DropdownContentProps {
  items: {
    [key: string]: {
      [key: string]: string[];
    };
  };
  hoveredItem: string | null;
  setHoveredItem: React.Dispatch<React.SetStateAction<string | null>>;
  title: string;
  description?: (item: string) => string;
}

const getFormattedLink = (path: string) => {
  return path.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
};

const DropdownContent: React.FC<DropdownContentProps> = ({ items, hoveredItem, setHoveredItem, title, description }) => (
  <div className="flex">
    {/* Left Column */}
    <div className="w-1/2 border-r border-gray-200">
      <div className="p-4">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="space-y-1">
          {Object.keys(items).map((item) => (
            <div 
              key={item} 
              className="relative"
              onMouseEnter={() => setHoveredItem(item)}
            >
              <Link 
                href={`/upsc-notes/${getFormattedLink(item)}`}
                className={`flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer rounded ${hoveredItem === item ? 'bg-gray-50' : ''}`}
              >
                <span className={`text-[13px] font-medium ${hoveredItem === item ? 'text-blue-700' : ''}`}>
                  {item}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
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
          {Object.entries(items[hoveredItem]).map(([subject, topics]) => (
            <div key={subject} className="space-y-2">
              <h3 className="text-[14px] font-semibold text-gray-900">{subject}</h3>
              <ul className="space-y-1">
                {topics.map((topic) => (
                  topic && (
                    <li key={topic}>
                      <Link 
                        href={`/upsc-notes/${getFormattedLink(hoveredItem)}/${getFormattedLink(subject)}/${getFormattedLink(topic)}`}
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
          ))}
          {description && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-[13px] text-gray-600">{description(hoveredItem)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

interface DropdownProps {
  items: {
    [key: string]: {
      [key: string]: string[];
    };
  };
  title: string;
  description?: (item: string) => string;
}

const Dropdown: React.FC<DropdownProps> = ({ items, title, description }) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  return (
    <div className="group relative">
      {/* Main Menu Item */}
      <Link 
        href="/upsc-notes"
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
        <DropdownContent items={items} hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} title={title} description={description} />
      </div>
    </div>
  );
};

export default Dropdown;