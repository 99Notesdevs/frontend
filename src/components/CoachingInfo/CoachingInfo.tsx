import React from 'react';
import ContactForm from '../common/ContactForm/ContactForm';
import AccordionItem from '../Accordion/AccordionItem';

interface CoachingInfoProps {
  title: string;
  description: string;
  faqs: {
    question: string;
    answer: string | React.ReactNode; // Allows JSX or plain text
  }[];
}

const CoachingInfo = ({ title, description, faqs }: CoachingInfoProps) => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-[var(--bg-main)]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="space-y-8 mb-12">
          <div className="text-center mb-0">
            <span className="text-[var(--primary)] font-medium uppercase">Expert Guidance</span>
            <h2 className="text-3xl font-semibold text-[var(--surface-dark)] mt-2 mb-4">{title}</h2>
          </div>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto mb-6"></div>
          <p className="text-xl text-[var(--text-strong)] text-center max-w-3xl mx-auto">{description}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            {faqs && faqs.length > 0 ? (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} title={faq.question}>
                    <div className="text-[var(--text-strong)] space-y-4 px-1">
                      {typeof faq.answer === 'string' ? (
                        <p className="text-base font-normal text-[var(--text-strong)] leading-relaxed font-opensans">
                          {faq.answer}
                        </p>
                      ) : (
                        faq.answer
                      )}
                    </div>
                  </AccordionItem>
                ))}
              </div>
            ) : (
              <p className="text-center text-[var(--text-tertiary)]">No FAQs available</p>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-[var(--border-light)]">
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