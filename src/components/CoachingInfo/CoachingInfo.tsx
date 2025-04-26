import React from 'react';
import ContactForm from '../common/ContactForm/ContactForm';
import AccordionItem from '../Accordion/AccordionItem';

const CoachingInfo = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-medium tracking-wider text-sm uppercase font-opensans">Expert Guidance</span>
          <h2 className="text-3xl font-semibold text-gray-900 mt-3 mb-4 leading-tight font-opensans">
            BEST UPSC COACHING INSTITUTE IN DELHI
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
          <p className="text-lg font-normal text-gray-600 max-w-3xl mx-auto font-opensans">
            With Affordable Course Fees & Finest Quality UPSC Notes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Accordion */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-sm shadow-lg border border-gray-100 h-[530px] overflow-y-auto">
              <div className="space-y-6">
                <AccordionItem title="About 99notes IAS Institute">
                  <div className="text-gray-600 space-y-4 px-1">
                    <p className="text-base font-normal text-gray-600 leading-relaxed font-opensans">
                      99notes IAS Institute is one of the leading UPSC coaching institutes in Delhi, 
                      dedicated to providing quality education at affordable prices. Our institute 
                      focuses on a comprehensive approach to UPSC preparation.
                    </p>
                    <p className="text-base font-normal text-gray-600 leading-relaxed font-opensans">
                      We believe in making quality education accessible to all aspirants, 
                      regardless of their financial background. Our team of experienced 
                      faculty members ensures that every student receives personalized attention 
                      and guidance throughout their preparation journey.
                    </p>
                  </div>
                </AccordionItem>

                <AccordionItem title="Best IAS Coaching in Delhi (Our Vision & Mission)">
                  <div className="text-gray-600 space-y-4 px-1">
                    <p className="text-base font-normal text-gray-600 leading-relaxed font-opensans">
                      Our vision is to become the most trusted name in UPSC preparation by 
                      providing high-quality education and comprehensive study materials at 
                      affordable prices.
                    </p>
                    <h4 className="font-semibold text-gray-800 text-lg mt-5 mb-2 font-opensans">Our Mission:</h4>
                    <ul className="list-none pl-0 space-y-3">
                      {[
                        "Make quality UPSC coaching accessible to all",
                        "Provide comprehensive study materials and notes",
                        "Offer personalized guidance to every aspirant",
                        "Maintain high success rate in UPSC examinations",
                        "Create a supportive learning environment"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo-600 mr-2 mt-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          <span className="font-opensans">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionItem>

                <AccordionItem title="Why Choose 99notes for UPSC Preparation?">
                  <div className="text-gray-600 space-y-4 px-1">
                    <ul className="list-none pl-0 space-y-3 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                      {[
                        "Experienced faculty with proven track record",
                        "Comprehensive study materials and notes",
                        "Regular mock tests and evaluations",
                        "Affordable fee structure",
                        "Personal mentoring and guidance",
                        "Updated study material and current affairs",
                        "Focus on conceptual learning",
                        "Strategic approach to UPSC preparation"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo-600 mr-2 mt-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          <span className="font-opensans">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionItem>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-sm shadow-lg border border-gray-100">
              <div className="max-h-[550px] overflow-y-auto">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoachingInfo; 