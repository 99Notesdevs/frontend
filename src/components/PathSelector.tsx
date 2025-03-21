import { useState, useEffect } from 'react';
import { navItems } from './Navbar/navData';

type PathSelectorProps = {
  onPathChange: (path: string[]) => void;
}

interface NavItemObject {
  [key: string]: NavItem;
}

type NavItem = string[] | NavItemObject;

// Type assertion for navItems
const typedNavItems = navItems as NavItemObject;

export default function PathSelector({ onPathChange }: PathSelectorProps) {
  const [level1, setLevel1] = useState<string>('UPSC Notes');
  const [level2, setLevel2] = useState<string>('');
  const [level3, setLevel3] = useState<string>('');
  const [level4, setLevel4] = useState<string>('');
  const [level5, setLevel5] = useState<string>('');

  useEffect(() => {
    onPathChange([level1, level2, level3, level4, level5].filter(Boolean));
  }, [level1, level2, level3, level4, level5, onPathChange]);

  const getOptions = (level: number): string[] => {
    switch (level) {
      case 1:
        return Object.keys(typedNavItems);
      case 2:
        if (!level1) return [];
        const level1Item = typedNavItems[level1] as NavItemObject;
        return Object.keys(level1Item);
      case 3:
        if (!level1 || !level2) return [];
        const level2Parent = typedNavItems[level1] as NavItemObject;
        const level2Item = level2Parent[level2] as NavItemObject;
        return Object.keys(level2Item);
      case 4:
        if (!level1 || !level2 || !level3) return [];
        const level3Parent = (typedNavItems[level1] as NavItemObject)[level2] as NavItemObject;
        const level3Item = level3Parent[level3];
        return Array.isArray(level3Item) ? level3Item : [];
      default:
        return [];
    }
  };

  const handleChange = (level: number, value: string) => {
    switch (level) {
      case 1:
        setLevel1(value);
        setLevel2('');
        setLevel3('');
        setLevel4('');
        setLevel5('');
        break;
      case 2:
        setLevel2(value);
        setLevel3('');
        setLevel4('');
        setLevel5('');
        break;
      case 3:
        setLevel3(value);
        setLevel4('');
        setLevel5('');
        break;
      case 4:
        setLevel4(value);
        setLevel5('');
        break;
      case 5:
        setLevel5(value);
        break;
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {[1, 2, 3, 4, 5].map((level) => (
        <select
          key={level}
          value={[level1, level2, level3, level4, level5][level - 1]}
          onChange={(e) => handleChange(level, e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 text-sm"
          disabled={level > 1 && !([level1, level2, level3, level4][level - 2])}
        >
          <option value="">Select {level === 1 ? 'Category' : `Level ${level}`}</option>
          {getOptions(level).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
