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

export default async function Home() {
  const response = await axios.get(`${env.API}/about-99-notes/coreMembers`);
  const coreMemberImages = response.data.data;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Contact Form */}
      <section className="container mx-auto px-4 md:px-24 lg:px-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center lg:mt-6">
          {/* Left Column - Text Content */}
          <div className="space-y-7 max-w-xl md:pl-9">
            <div className="space-y-4 mt-4 md:mt-0">
              <h1 className="text-4xl font-semibold text-gray-800 leading-relaxed font-opensans">
                <span className="block">The</span>
                <span className="block">Pioneers of Self-Study Ecosystem</span>
              </h1>
            </div>
            <p className="text-base font-normal text-gray-700 leading-relaxed font-opensans">
              Welcome to 99Notes. <br />We are an organization dedicated to students who wish that educational material must not be restricted behind a pay-wall.
              We aim to build a sustainable self-study ecosystem by providing high-quality study material for Government examinations at almost free of cost.
            </p>
          </div>

          {/* Right Column - Contact Form */}
          <div className="mt-4 lg:mt-16 mb-5 w-full max-w-lg">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <StudyMaterials />
      <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
        <Slider images={coreMemberImages} />
      </div>
      <CurrentAffairs />
      <CoachingInfo />
      <FAQ />
      <Reason99notes />
      <ContactMap />
    </div>
  );
}