import React, { JSX } from 'react';

interface ContactInfoItem {
  icon: JSX.Element;
  title: string;
  value: string;
  href?: string;
}

const ContactMap: React.FC = () => {
  const contactInfo: Record<string, ContactInfoItem> = {
    email: {
      icon: (
        <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      value: 'Info@99notes.in',
      href: 'mailto:Info@99notes.in'
    },
    address: {
      icon: (
        <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Address',
      value: '5B, Pusa Rd, opp. to Metro Pillar no. 110, near Karol Bagh Metro, New Delhi-110060',
      href: 'https://maps.google.com/?q=99Notes+Head+Office+5B+Pusa+Road+Karol+Bagh+New+Delhi+110060'
    },
    phone: {
      icon: (
        <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      value: '+91-9654638994',
      href: 'tel:+91-9654638994'
    }
  };

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.values(contactInfo).map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-[var(--border-light)] shadow-md p-6 flex items-start space-x-4 
                          hover:shadow-2xl hover:shadow-[var(--tertiary)] hover:border-[var(--quaternary)] transform hover:scale-105 hover:-translate-y-2 
                          transition-all duration-300 ease-in-out cursor-pointer"
              >
                <div className="flex-shrink-0 p-3 bg-[var(--tertiary)] rounded-full">
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--surface-darker)] mb-2">
                    {info.title}
                  </h3>
                  <p className="text-[var(--text-strong)]">
                    <a 
                      href={info.href} 
                      target={info.title === 'Address' ? "_blank" : undefined}
                      rel={info.title === 'Address' ? "noopener noreferrer" : undefined}
                      className="hover:text-[var(--primary)] transition-colors duration-300 relative group inline-block"
                    >
                      {info.value}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[var(--primary)] 
                                     group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <div className="lg:col-span-3 h-[500px] rounded-lg overflow-hidden shadow-lg border border-[var(--border-light)]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7003.347428505327!2d77.18153009347897!3d28.639539652643215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03e216d2cca9%3A0x61c92a5509fc5a9c!2s99Notes%20Head%20Office%20-Best%20IAS%20Coaching%20Institute!5e0!3m2!1sen!2sin!4v1741270613524!5m2!1sen!2sin" 
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="99Notes Location Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
