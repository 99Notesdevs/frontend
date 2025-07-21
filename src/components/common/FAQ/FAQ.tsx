import React from "react";
import FAQItem from "./FAQItem";

// Define the type for FAQ items
interface FAQData {
  question: string;
  answer: string | React.ReactNode; // Allows JSX or plain text
  number?: number;
}
interface FAQProps {
  title: string;
  description: string;
  faqData: FAQData[];
}

const FAQ: React.FC<FAQProps> = ({ title, description, faqData }) => {
  // Split the FAQ data into two columns
  const midpoint = Math.ceil(faqData.length / 2);
  const leftColumnFaqs = faqData.slice(0, midpoint);
  const rightColumnFaqs = faqData.slice(midpoint);

  return (
    <section className="py-5 bg-gradient-to-b from-[var(--bg-main)] to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-[var(--primary)] font-medium tracking-wider text-sm uppercase font-opensans">
            Common Questions
          </span>
          <h2 className="text-3xl font-semibold text-[var(--surface-darker)] dark:text-white mt-3 mb-4 leading-tight font-opensans">
            {title}
          </h2>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto mb-6"></div>
          <p className="text-lg font-normal text-[var(--text-strong)] dark:text-gray-300 max-w-3xl mx-auto font-opensans">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
          {/* Left Column */}
          <div className="space-y-6">
            {leftColumnFaqs.map((faq, index) => (
              <FAQItem
                key={`left-${index}`}
                question={faq.question}
                answer={faq.answer}
                number={faq.number || index + 1}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {rightColumnFaqs.map((faq, index) => (
              <FAQItem
                key={`right-${index}`}
                question={faq.question}
                answer={faq.answer}
                number={faq.number || index + midpoint + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
