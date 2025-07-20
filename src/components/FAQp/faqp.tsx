import { useState } from 'react';

interface SubQuestion {
  question: string;
  answer: string;
}

interface FAQItem {
  question: string;
  answer: string;
  subQuestions?: SubQuestion[];
}

interface FAQData {
  general: FAQItem[];
}

interface FAQProps {
  data: string;
}

const FAQPage: React.FC<FAQProps> = ({ data }) => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [openSubQuestions, setOpenSubQuestions] = useState<{ [key: number]: number }>({});

  // Parse the incoming string data
  let faqItems: FAQItem[] = [];
  
  try {
    const parsedData: FAQData = JSON.parse(data);
    faqItems = Array.isArray(parsedData?.general) ? parsedData.general : [];
  } catch (error) {
    console.error('Error parsing FAQ data:', error);
  }

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const toggleSubQuestion = (questionIndex: number, subIndex: number) => {
    setOpenSubQuestions(prev => ({
      ...prev,
      [questionIndex]: prev[questionIndex] === subIndex ? -1 : subIndex
    }));
  };

  if (!faqItems || faqItems.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-slate-300">No FAQs available at the moment.</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-5">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">FAQ</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-12">Find answers to commonly asked questions</p>
        
        <div className="space-y-6">
          {faqItems.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-700/50"
            >
              <button
                className="w-full px-8 py-6 text-left focus:outline-none flex justify-between items-center group transition-colors duration-200"
                onClick={() => toggleQuestion(index)}
              >
                <h2 
                  className="text-lg text-gray-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 m-0"
                  dangerouslySetInnerHTML={{ __html: faq.question }}
                />
                <span 
                  className={`transform transition-transform duration-300 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${
                    openQuestion === index ? 'rotate-180' : ''
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openQuestion === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-8 py-6 border-t border-gray-100 dark:border-slate-700">
                  <div 
                    className="text-gray-600 dark:text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                  
                  {faq.subQuestions && faq.subQuestions.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-4">
                        Related Questions
                      </h3>
                      {faq.subQuestions.map((subQ, subIndex) => (
                        <div 
                          key={subIndex} 
                          className="bg-gray-50 dark:bg-slate-700 rounded-lg overflow-hidden"
                        >
                          <button
                            className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center group transition-colors duration-200"
                            onClick={() => toggleSubQuestion(index, subIndex)}
                          >
                            <span 
                              className="text-gray-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200"
                              dangerouslySetInnerHTML={{ __html: subQ.question }}
                            />
                            <span 
                              className={`transform transition-transform duration-300 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${
                                openSubQuestions[index] === subIndex ? 'rotate-180' : ''
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </span>
                          </button>
                          <div 
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              openSubQuestions[index] === subIndex ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div 
                              className="px-6 py-4 text-gray-600 dark:text-slate-300"
                              dangerouslySetInnerHTML={{ __html: subQ.answer }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;