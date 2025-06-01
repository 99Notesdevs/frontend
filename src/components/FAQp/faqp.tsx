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
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">No FAQs available at the moment.</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-5">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">FAQ</h1>
        <p className="text-gray-600 text-center mb-12">Find answers to commonly asked questions</p>
        
        <div className="space-y-6">
          {faqItems.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <button
                className="w-full px-8 py-6 text-left focus:outline-none flex justify-between items-center group"
                onClick={() => toggleQuestion(index)}
              >
                <span className="text-lg text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">
                  {faq.question}
                </span>
                <span 
                  className={`transform transition-transform duration-300 text-gray-400 group-hover:text-indigo-600 ${
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
                <div className="px-8 py-6 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  
                  {faq.subQuestions && faq.subQuestions.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                        Related Questions
                      </h3>
                      {faq.subQuestions.map((subQ, subIndex) => (
                        <div 
                          key={subIndex} 
                          className="bg-gray-50 rounded-lg overflow-hidden"
                        >
                          <button
                            className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center group"
                            onClick={() => toggleSubQuestion(index, subIndex)}
                          >
                            <span className="text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                              {subQ.question}
                            </span>
                            <span 
                              className={`transform transition-transform duration-300 text-gray-400 group-hover:text-indigo-600 ${
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
                            <div className="px-6 py-4 text-gray-600">
                              {subQ.answer}
                            </div>
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