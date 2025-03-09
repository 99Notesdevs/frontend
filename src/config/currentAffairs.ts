import { SectionConfig, NavigationSection } from '../types/currentAffairs';

export const sectionConfig: SectionConfig = {
  'news-analysis': {
    title: 'Daily News Analysis',
    description: 'In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.',
    topics: ['Environment', 'Economy', 'Polity', 'International Relations', 'Science & Technology'],
    icon: '📰'
  },
  'hindu-editorial': {
    title: 'The Hindu Editorial Analysis',
    description: 'Comprehensive analysis of The Hindu newspaper editorials with UPSC perspective.',
    topics: ['Economy', 'Polity', 'International Relations', 'Social Issues'],
    icon: '📑'
  },
  'express-editorial': {
    title: 'Indian Express Editorial Analysis',
    description: 'Detailed analysis of Indian Express editorials relevant for UPSC preparation.',
    topics: ['Governance', 'Economy', 'Social Justice', 'International Affairs'],
    icon: '📋'
  },
  'pib': {
    title: 'PIB Analysis',
    description: 'Analysis of important Press Information Bureau releases and their UPSC relevance.',
    topics: ['Government Schemes', 'Policy', 'Economy', 'Development'],
    icon: '🏛️'
  },
  'mcq-quiz': {
    title: 'Daily MCQ Quiz',
    description: 'Practice multiple choice questions based on current affairs.',
    topics: ['General Studies', 'Current Events', 'Static Topics'],
    icon: '❓'
  },
  'answer-writing': {
    title: 'Answer Writing Practice',
    description: 'Daily answer writing practice questions for UPSC Mains preparation.',
    topics: ['GS-1', 'GS-2', 'GS-3', 'GS-4'],
    icon: '✍️'
  },
  'compilation': {
    title: 'Monthly Compilation',
    description: 'Comprehensive monthly compilation of important current affairs topics.',
    topics: ['National', 'International', 'Economy', 'Environment', 'Science & Tech'],
    icon: '📚'
  },
  'yojana': {
    title: 'Yojana Magazine',
    description: 'Analysis of Yojana magazine articles with UPSC perspective.',
    topics: ['Development', 'Economy', 'Social Issues', 'Governance'],
    icon: '📖'
  },
  'kurukshetra': {
    title: 'Kurukshetra Magazine',
    description: 'Coverage of Kurukshetra magazine focusing on rural development.',
    topics: ['Rural Development', 'Agriculture', 'Social Welfare', 'Economy'],
    icon: '📔'
  },
  'science-reporter': {
    title: 'Science Reporter',
    description: 'Important science and technology updates for UPSC preparation.',
    topics: ['Science', 'Technology', 'Innovation', 'Research'],
    icon: '🔬'
  },
  'union-budget': {
    title: 'Union Budget',
    description: 'Comprehensive analysis of the Union Budget with UPSC perspective.',
    topics: ['Economy', 'Taxation', 'Development', 'Social Sector'],
    icon: '💰'
  },
  'economic-survey': {
    title: 'Economic Survey',
    description: 'Key insights and analysis from the Economic Survey of India.',
    topics: ['Economy', 'Growth', 'Development', 'Policy'],
    icon: '📊'
  },
  'year-end-review': {
    title: 'Year End Review',
    description: 'Annual compilation and analysis of important events and developments.',
    topics: ['National', 'International', 'Economy', 'Social'],
    icon: '📅'
  }
};

export const navigationSections: NavigationSection[] = [
  {
    title: "Daily Current Affairs",
    items: [
      { title: "Daily News Analysis", path: "/current-affairs/daily/news-analysis", icon: "📰" },
      { title: "The Hindu Editorial", path: "/current-affairs/daily/hindu-editorial", icon: "📑" },
      { title: "Indian Express Editorial", path: "/current-affairs/daily/express-editorial", icon: "📋" },
      { title: "PIB Analysis", path: "/current-affairs/daily/pib", icon: "🏛️" },
      { title: "Daily MCQ Quiz", path: "/current-affairs/daily/mcq-quiz", icon: "❓" },
      { title: "Answer Writing Practice", path: "/current-affairs/daily/answer-writing", icon: "✍️" },
    ]
  },
  {
    title: "Monthly Current Affairs",
    items: [
      { title: "Monthly Compilation", path: "/current-affairs/monthly/compilation", icon: "📚" },
      { title: "Yojana Magazine", path: "/current-affairs/monthly/yojana", icon: "📖" },
      { title: "Kurukshetra Magazine", path: "/current-affairs/monthly/kurukshetra", icon: "📔" },
      { title: "Science Reporter", path: "/current-affairs/monthly/science-reporter", icon: "🔬" },
    ]
  },
  {
    title: "Yearly Current Affairs",
    items: [
      { title: "Union Budget", path: "/current-affairs/yearly/union-budget", icon: "💰" },
      { title: "Economic Survey", path: "/current-affairs/yearly/economic-survey", icon: "📊" },
      { title: "Year End Review", path: "/current-affairs/yearly/year-end-review", icon: "📅" },
    ]
  }
];

export const ITEMS_PER_PAGE = 10;

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  sortBy: 'latest',
  topic: 'all'
}; 