"use client";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContactForm from "@/components/common/ContactForm/ContactForm";
import StudyMaterials from "@/components/StudyMaterials/Studymaterials";
import CurrentAffairs from "@/components/CurrentAffairs/CurrentAffairs";
import CoachingInfo from "@/components/CoachingInfo/CoachingInfo";
import FAQ from "@/components/common/FAQ/FAQ";
import Reason99notes from "@/components/CoachingInfo/Reason99notes";
import { api } from '@/config/api/route';
import Hero from '@/components/hero/hero';
const ContactMap = dynamic(
  () => import('@/components/common/Contact/ContactMap'),
  { 
    ssr: false, // Disable server-side rendering if not needed
    loading: () => <p>Loading map...</p> // Optional loading component
  }
);
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
  const [coreMemberImages, setCoreMemberImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersResponse = await api.get('/about-99-notes/coreMembers') as { data: any[] };
        const homeResponse = await api.get('/about-99-notes/home') as { data: any };
        
        setCoreMemberImages(membersResponse.data);
        const pageData = homeResponse.data;
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
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section with Contact Form */}
      <section className="md:mt-0">
            <Hero></Hero>
      </section>
    </div>
   
  );
}