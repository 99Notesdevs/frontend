"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { env } from '@/config/env';
import ContactForm from "@/components/common/ContactForm/ContactForm";
import StudyMaterials from "@/components/StudyMaterials/Studymaterials";
import CurrentAffairs from "@/components/CurrentAffairs/CurrentAffairs";
import CoachingInfo from "@/components/CoachingInfo/CoachingInfo";
import FAQ from "@/components/common/FAQ/FAQ";
import ContactMap from "@/components/common/Contact/ContactMap";
import Reason99notes from "@/components/CoachingInfo/Reason99notes";
import Slider from "@/components/About/Slider";

interface HomeProps {
  Hero:{
    title: string;
    description: string;
  },
 StudyMaterials:{
  title: string;
  description: string;
 },
 CurrentAffairs:{
  title: string;
  description: string;
 },
 CoachingInfo:{
  title: string;
  description: string;
  faqs: {
   question: string;
   answer: string | React.ReactNode; // Allows JSX or plain text
  }[];
 },
 FAQ:{
  title: string;
  description: string;
  faqData: {
   question: string;
   answer: string | React.ReactNode; // Allows JSX or plain text
   number?: number;
  }[];
 },
 Reason99notes:{
  title: string;
  description: string;
  footer: string;
  reasons: {
   title: string;
   content: string;
  }[];
 }
}

export default function Home() {
  const [homeData, setHomeData] = useState<HomeProps | null>(null);
  const [coreMemberImages, setCoreMemberImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersResponse, homeResponse] = await Promise.all([
          axios.get(`${env.API}/about-99-notes/coreMembers`),
          axios.get(`${env.API}/about-99-notes/home`)
        ]);
        
        setCoreMemberImages(membersResponse.data.data);
        const pageData = homeResponse.data.data;
        setHomeData(JSON.parse(pageData.content));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !homeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section with Contact Form */}
      <section className="container w-full max-w-[2000px] px-6 lg:px-18 mt-8 md:mt-0">
          <div className="md:flex justify-evenly items-center gap-20">
            {/* Left Column - Text Content */}
            <motion.div 
              className="space-y-7 max-w-lg md:max-w-[320px] lg:max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="space-y-4 overflow-hidden">
                <motion.h1 
                  className="text-4xl font-semibold text-[var(--surface-dark)] leading-relaxed font-opensans"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                >
                  <motion.span 
                    className="block" 
                    dangerouslySetInnerHTML={{ __html: homeData.Hero.title }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  />
                </motion.h1>
              </div>
              <motion.p 
                className="text-base font-semibold text-[var(--text-strong)] leading-relaxed font-opensans"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              >
                {homeData.Hero.description}
              </motion.p>
            </motion.div>

            {/* Right Column - Contact Form */}
            <div className="mt-12 mb-5 w-full max-w-lg md:max-w-[320px] lg:max-w-lg lg:ml-7">
              <ContactForm />
            </div>
          </div>
      </section>

      {/* Other Sections */}
      <StudyMaterials 
        title={homeData.StudyMaterials.title} 
        description={homeData.StudyMaterials.description} 
      />
      <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
        <Slider images={coreMemberImages} />
      </div>
      <CurrentAffairs title={homeData.CurrentAffairs.title} description={homeData.CurrentAffairs.description} />
      <CoachingInfo title={homeData.CoachingInfo.title} description={homeData.CoachingInfo.description} faqs={homeData.CoachingInfo.faqs} />
      <FAQ 
        title={homeData.FAQ.title} 
        description={homeData.FAQ.description}
        faqData={homeData.FAQ.faqData}
      />
      <Reason99notes title={homeData.Reason99notes.title} description={homeData.Reason99notes.description} footer={homeData.Reason99notes.footer} reasons={homeData.Reason99notes.reasons} />
      <ContactMap />
    </div>
   
  );
}