import React from "react";
import Head from "next/head";
import Image from "next/image";
import Slider from "../components/Slider";

const About: React.FC = () => {
  const veteranImages = [
    { src: "/assets/images/sample_image.jpg", alt: "Veteran 1", info: "Information about Veteran 1" },
    { src: "/assets/images/sample_image2.jpg", alt: "Veteran 2", info: "Information about Veteran 2" },
    { src: "/assets/images/sample_image.jpg", alt: "Veteran 3", info: "Information about Veteran 3" },
    { src: "/assets/images/sample_image2.jpg", alt: "Veteran 4", info: "Information about Veteran 4" },
    { src: "/assets/images/sample_image.jpg", alt: "Veteran 5", info: "Information about Veteran 5" },
    { src: "/assets/images/sample_image2.jpg", alt: "Veteran 6", info: "Information about Veteran 6" },
    { src: "/assets/images/sample_image.jpg", alt: "Veteran 7", info: "Information about Veteran 7" },
    { src: "/assets/images/sample_image2.jpg", alt: "Veteran 8", info: "Information about Veteran 8" },
  ];

  const coreMemberImages = [
    { src: "/assets/images/sample_image.jpg", alt: "Core Member 1", info: "Information about Core Member 1" },
    { src: "/assets/images/sample_image2.jpg", alt: "Core Member 2", info: "Information about Core Member 2" },
    { src: "/assets/images/sample_image.jpg", alt: "Core Member 3", info: "Information about Core Member 3" },
    { src: "/assets/images/sample_image2.jpg", alt: "Core Member 4", info: "Information about Core Member 4" },
    { src: "/assets/images/sample_image.jpg", alt: "Core Member 5", info: "Information about Core Member 5" },
    { src: "/assets/images/sample_image2.jpg", alt: "Core Member 6", info: "Information about Core Member 6" },
    { src: "/assets/images/sample_image.jpg", alt: "Core Member 7", info: "Information about Core Member 7" },
    { src: "/assets/images/sample_image2.jpg", alt: "Core Member 8", info: "Information about Core Member 8" },
  ];

  return (
    <>
      <Head>
        <title>About Us - 99Notes</title>
        <meta name="description" content="Learn more about 99Notes, our mission, and our values." />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <main className="w-full bg-gradient-to-b from-white to-gray-50 min-h-screen overflow-hidden">
        {/* Hero Section */}
        <div className="absolute top-0 right-0 w-1/3 h-96 bg-blue-50 rounded-bl-full opacity-50 transform rotate-6"></div>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-indigo-50 rounded-full opacity-50 animate-pulse delay-300"></div>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 p-4 relative group transform transition-all duration-500 hover:scale-105">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-500"></div>
                <Image 
                  src="/assets/images/sample_image.jpg" 
                  alt="About 99 Notes" 
                  width={500} 
                  height={300} 
                  className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover" 
                />
              </div>
            </div>
            <div className="md:w-1/2 p-4">
              <div className="space-y-6">
                <h1 className="font-playfair text-6xl font-bold text-gray-900 leading-tight">
                  About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">99Notes</span>
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <p className="text-xl leading-relaxed text-gray-700 font-poppins">
                  99Notes stands as a beacon of excellence in UPSC preparation, founded with the vision to revolutionize how aspirants approach their civil services journey. We are more than just a platform; we are a community dedicated to nurturing future civil servants.
                </p>
                <p className="text-xl leading-relaxed text-gray-700 font-poppins">
                  Our commitment to quality education and comprehensive preparation has made us one of the most trusted names in UPSC coaching, with thousands of successful aspirants crediting their success to our innovative approach.
                </p>
              </div>
            </div>
          </div>
        </section>

                {/* What We Do Section with enhanced styling */}
                <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-playfair text-6xl font-bold text-gray-900">
                What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Do</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <p className="text-xl leading-relaxed text-gray-700 font-poppins">
                  At 99Notes, we provide comprehensive study materials and resources tailored specifically for UPSC preparation. Our offerings include:
                </p>
                <ul className="space-y-6">
                  {[
                    "Meticulously crafted study notes covering all UPSC subjects",
                    "Daily current affairs analysis and updates",
                    "Expert-guided test series and evaluations",
                    "Personalized mentoring and guidance"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-4 group">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold transform group-hover:scale-110 transition-transform duration-300">
                        {index + 1}
                      </span>
                      <span className="text-xl text-gray-700 font-poppins group-hover:text-blue-600 transition-colors duration-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-75 blur-lg"></div>
                <Image 
                  src="/assets/images/sample_image2.jpg" 
                  alt="What we do" 
                  width={600} 
                  height={400} 
                  className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover transform hover:scale-105 transition-transform duration-500" 
                />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl my-8">
          <h1 className="font-playfair text-5xl font-bold mb-8 text-center text-gray-900">
            Our <span className="text-blue-600">Mission</span>
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl leading-relaxed text-gray-700 font-poppins text-center mb-6">
              Our mission is to democratize UPSC preparation by making high-quality study materials and guidance accessible to every aspirant, regardless of their background or location.
            </p>
            <p className="text-xl leading-relaxed text-gray-700 font-poppins text-center">
              We believe in empowering aspirants with the right tools, knowledge, and support system to help them realize their dreams of serving the nation through civil services.
            </p>
          </div>
        </section>

        {/* Leadership Section - Founder */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 transform -skew-y-6"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-playfair text-6xl font-bold text-gray-900">
                Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Founder</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
              <div className="grid md:grid-cols-2">
                <div className="relative h-[500px]">
                  <Image 
                    src="https://yt3.googleusercontent.com/mSuDBky7EOB_DcaDvsGklym2K9X4LmRInDMEanfQSF0whRMHhogthSMuUi0LSHig3dZtaZin=s160-c-k-c0x00ffffff-no-rj" 
                    alt="Founder" 
                    width={160} 
                    height={160} 
                    className="w-full h-full object-contain bg-gradient-to-br from-blue-50 to-indigo-50 p-8"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-8 text-white z-10">
                    <h3 className="text-4xl font-playfair font-bold mb-2">Pulkit Bharti</h3>
                    <p className="text-xl font-poppins text-blue-200">Founder & CEO</p>
                  </div>
                </div>
                <div className="p-8 flex items-center">
                  <div className="space-y-6">
                    <p className="text-2xl leading-relaxed text-gray-700 font-poppins">
                      "Our vision is to democratize UPSC preparation and make quality education accessible to every aspirant across India."
                    </p>
                    <div className="space-y-4">
                      <p className="text-lg leading-relaxed text-gray-600 font-poppins">
                        With extensive experience in UPSC preparation and a passion for education, our founder established 99Notes with the vision of transforming how aspirants prepare for civil services.
                      </p>
                      <p className="text-lg leading-relaxed text-gray-600 font-poppins">
                        Their dedication to excellence and innovation has been the driving force behind our success, helping thousands of aspirants achieve their dreams.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section - Co-founder */}
        <section className="py-20 relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-playfair text-6xl font-bold text-gray-900">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Co-founder</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
              <div className="grid md:grid-cols-2">
                <div className="p-8 flex items-center order-2 md:order-1">
                  <div className="space-y-6">
                    <p className="text-2xl leading-relaxed text-gray-700 font-poppins">
                      "Innovation in education technology combined with deep subject expertise is key to transforming UPSC preparation."
                    </p>
                    <div className="space-y-4">
                      <p className="text-lg leading-relaxed text-gray-600 font-poppins">
                        Our co-founder brings years of expertise in educational technology and content development, revolutionizing how aspirants learn and prepare.
                      </p>
                      <p className="text-lg leading-relaxed text-gray-600 font-poppins">
                        Their innovative approach to learning and commitment to quality has helped shape 99Notes into a leading platform for UPSC preparation.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative h-[500px] order-1 md:order-2">
                  <Image 
                    src="/assets/images/sample_image2.jpg" 
                    alt="Co-founder" 
                    width={600} 
                    height={500} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h3 className="text-4xl font-playfair font-bold mb-2">Co-founder Name</h3>
                    <p className="text-xl font-poppins text-blue-200">Co-founder & Director</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-4xl font-bold text-gray-900">
              Battle-Hardened <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Veterans</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Meet our experienced veterans who have successfully navigated the UPSC journey
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <Slider images={veteranImages} />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-4xl font-bold text-gray-900">
              Other <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Core Members</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our dedicated team working behind the scenes to support your UPSC preparation
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <Slider images={coreMemberImages} />
          </div>
        </section>
      </main>
      <style jsx global>{`
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default About;
