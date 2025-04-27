import ContactForm from "@/components/common/ContactForm/ContactForm";
import StudyMaterials from "@/components/StudyMaterials/Studymaterials";
import CurrentAffairs from "@/components/CurrentAffairs/CurrentAffairs";
import CoachingInfo from "@/components/CoachingInfo/CoachingInfo";
import FAQ from "@/components/common/FAQ/FAQ";
import ContactMap from "@/components/common/Contact/ContactMap";
import Reason99notes from "@/components/CoachingInfo/Reason99notes";
import Slider from "@/components/About/Slider";
import axios from "axios";
import { env } from "@/config/env";

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
export default async function Home() {
  const response = await axios.get(`${env.API}/about-99-notes/coreMembers`);
  const coreMemberImages = response.data.data;
  
  const data = await axios.get(`${env.API}/about-99-notes/home`);
  const pageData = data.data.data; // Get the nested data object
  const homeData : HomeProps = JSON.parse(pageData.content);
  return (
    <div className="min-h-screen">
      {/* Hero Section with Contact Form */}
      <section className="container mx-auto px-4 md:px-24 lg:px-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center lg:mt-6">
          {/* Left Column - Text Content */}
          <div className="space-y-7 max-w-xl md:pl-9">
            <div className="space-y-4 mt-4 md:mt-0">
              <h1 className="text-4xl font-semibold text-gray-800 leading-relaxed font-opensans">
                {/* <span className="block">The</span> */}
                <span className="block" dangerouslySetInnerHTML={{ __html: homeData.Hero.title }}></span>
              </h1>
            </div>
            <p className="text-base font-semibold text-gray-700 leading-relaxed font-opensans">
              {homeData.Hero.description}
            </p>
          </div>

          {/* Right Column - Contact Form */}
          <div className="mt-4 lg:mt-16 mb-5 w-full max-w-lg">
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