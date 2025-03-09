import React from 'react';
import CustomDropdown from './CustomDropdown';
import UPSCNotesDropdown from './UPSCNotesDropdown';
import SearchBar from './SearchBar';
import { navItems, sectionDescriptions } from './navData';

const Navbar: React.FC = () => {
  const formatNavItems = (section: string) => {
    const items = navItems[section as keyof typeof navItems];
    return Object.entries(items).map(([name, content]) => ({
      name,
      link: content
    }));
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <UPSCNotesDropdown 
              items={navItems['UPSC Notes']} 
              title="UPSC Notes"
              description={(item) => sectionDescriptions[item] || ''}
            />
            
            <CustomDropdown
              title="Current Affairs UPSC"
              items={formatNavItems('Current Affairs UPSC')}
            />
            
            <CustomDropdown
              title="Free Study Material"
              items={formatNavItems('Free Study Material')}
            />
            
            <CustomDropdown
              title="Exam Forum"
              items={formatNavItems('Exam Forum')}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;