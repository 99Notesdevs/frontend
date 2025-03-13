import { navItems } from '@/components/Navbar/navData';
import React from 'react';
import ContactForm from '@/components/common/ContactForm/ContactForm';
import AccordionItem from '@/components/Accordion/AccordionItem';

const UPSCNotesIndex = () => {
  const upscNotes = navItems['UPSC Notes'];

  const faqs = [
    {
      question: "How to prepare for UPSC Civil Services Exam?",
      answer: "Start with NCERT books, follow a systematic study plan, practice answer writing, and stay updated with current affairs."
    },
    {
      question: "What is the best time to start UPSC preparation?",
      answer: "The ideal time to start is at least 12-15 months before the preliminary examination."
    },
    {
      question: "How many hours should I study for UPSC?",
      answer: "Dedicate 6-8 hours daily for effective preparation, including self-study and revision."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="lg:w-1/3 flex flex-col gap-12">
            {/* Navigation Sidebar */}
            <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <nav className="space-y-10">
                {Object.entries(upscNotes).map(([paperCategory, subjects]) => (
                  <div key={paperCategory} className="border-b border-gray-100 pb-8 last:border-0">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-yellow-400 pl-4">
                      <a href={`/upsc-notes/${paperCategory.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`} 
                         className="hover:text-blue-600 transition-colors duration-200">
                        {paperCategory}
                      </a>
                    </h2>
                    <div className="space-y-8">
                      {Object.entries(subjects).map(([subject, topics]) => (
                        <div key={subject}>
                          <h3 className="text-xl font-semibold text-gray-700 mb-3 border-l-4 border-yellow-400 pl-2">
                            <a href={`/upsc-notes/${paperCategory.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}/${subject.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`}
                               className="hover:text-blue-600 transition-colors duration-200">
                              {subject}
                            </a>
                          </h3>
                          {Array.isArray(topics) && (
                            <ul className="space-y-3 ml-6">
                              {topics.map((topic) => (
                                <li key={topic}>
                                  <a
                                    href={`/upsc-notes/${paperCategory.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}/${subject.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}/${topic.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`}
                                    className="text-gray-600 hover:text-blue-600 block py-1 text-base transition-colors duration-200 hover:translate-x-1"
                                  >
                                    {topic}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-yellow-400 pl-4">Contact Us</h2>
              <ContactForm />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-2/3 flex flex-col gap-12">
            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h1 className="text-blue-900 text-5xl font-bold mb-8 bg-gradient-to-r from-black-600 to-black-800 bg-clip-text leading-tight">
                UPSC Notes by Toppers Free PDF
              </h1>
              <hr className="border-t-2 border-yellow-400 mb-8" />
              <div className="prose max-w-none">
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Preparing for UPSC is Tough but not when you can prepare for UPSC Toppers Notes that are handwritten by Top IAS.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  We've created this page for all the UPSC aspirants preparing for UPSC Prelims, Mains or Optional. 
                  You will find all types of Notes here that are written by our team & optimised by UPSC toppers.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  The candidates who are appearing for the UPSC exam or going to appear should take the reference 
                  from the UPSC toppers notes. The main aim for these notes is to provide the audience a better 
                  understanding to make their UPSC exam strategy better.
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-yellow-400 pl-4">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    title={faq.question}
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </AccordionItem>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPSCNotesIndex;
