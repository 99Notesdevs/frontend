import ContactForm from "@/components/common/ContactForm/ContactForm";
import StudyMaterials from "@/components/StudyMaterials/Studymaterials";
import CurrentAffairs from "@/components/CurrentAffairs/CurrentAffairs";
import CoachingInfo from "@/components/CoachingInfo/CoachingInfo";
import FAQ from "@/components/common/FAQ/FAQ";
import ContactMap from "@/components/common/Contact/ContactMap";
import Reason99notes from "@/components/CoachingInfo/Reason99notes";
import Slider from "@/components/About/Slider";

export default function Home() {
  const coreMemberImages = [
    {
      src: "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      alt: "Core Member 1",
      info: "Information about Core Member 1",
    },
    {
      src: "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      alt: "Core Member 2",
      info: "Information about Core Member 2",
    },
    {
      src: "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      alt: "Core Member 3",
      info: "Information about Core Member 3",
    },
    {
      src: "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      alt: "Core Member 4",
      info: "Information about Core Member 4",
    },
    {
      src: "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      alt: "Core Member 5",
      info: "Information about Core Member 5",
    },
    {
      src: "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      alt: "Core Member 6",
      info: "Information about Core Member 6",
    },
    {
      src: "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      alt: "Core Member 7",
      info: "Information about Core Member 7",
    },
    {
      src: "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
      alt: "Core Member 8",
      info: "Information about Core Member 8",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Contact Form */}
      <section className="container mx-auto px-4 md:px-24 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-2 mt-10 md:mt-0">
              <h1 className="text-4xl md:text-5xl text-gray-900 tracking-tight leading-tight">
                <span className="text-2xl md:text-3xl font-bold block mb-1 tracking-wider">
                  The
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">
                  Pioneers of Self-Study
                </span>
                <span className="block mt-1 font-bold text-gray-900">
                  Ecosystem
                </span>
              </h1>
            </div>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed font-medium tracking-wide">
              <span className="font-semibold">Welcome to 99Notes</span>, we are
              an organization dedicated to students who wish that educational
              material must not be restricted behind a pay-wall.
              <span className="block mt-3">
                We aim to build a{" "}
                <span className="italic font-semibold">
                  sustainable self-study ecosystem
                </span>{" "}
                by providing high-quality study material for Government
                examinations at almost free of cost.
              </span>
            </p>
          </div>

          {/* Right Column - Contact Form */}
          <div className="mt-20 mb-5">
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
