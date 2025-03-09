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
      </Head>
      <main className="w-full p-6 text-gray-800 bg-white">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-4 relative group">
              <Image src="/assets/images/sample_image.jpg" alt="About 99 Notes" width={500} height={300} className="rounded-lg shadow-lg w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-lg">
                About 99 Notes
              </div>
            </div>
            <div className="md:w-1/2 p-4">
              <h1 className="text-3xl font-bold mb-4">About 99 Notes</h1>
              <p className="text-lg leading-relaxed">99Notes is dedicated to providing high-quality study materials and resources for UPSC aspirants. Our mission is to make learning accessible and effective for everyone.</p>
            </div>
          </div>
        </section>
        <section className="mb-12">
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="md:w-1/2 p-4 relative group">
              <Image src="/assets/images/sample_image2.jpg" alt="What we do" width={500} height={300} className="rounded-lg shadow-lg w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-lg">
                What we do
              </div>
            </div>
            <div className="md:w-1/2 p-4">
              <h1 className="text-3xl font-bold mb-4">What we do</h1>
              <p className="text-lg leading-relaxed">We provide comprehensive notes, current affairs updates, and other study materials to help aspirants prepare for the UPSC exams effectively.</p>
            </div>
          </div>
        </section>
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Our Mission</h1>
          <p className="text-lg leading-relaxed">Our mission is to empower UPSC aspirants with the best resources and guidance to achieve their goals. We believe in the power of education and strive to make it accessible to everyone.</p>
        </section>
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Our Founders and Team</h1>
          <div className="flex flex-col md:flex-row-reverse items-center mb-8">
            <div className="md:w-1/2 p-4 relative group">
              <Image src="/assets/images/sample_image.jpg" alt="Pulkit Goel" width={500} height={300} className="rounded-lg shadow-lg w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-lg">
                Pulkit Goel
              </div>
            </div>
            <div className="md:w-1/2 p-4">
              <h2 className="text-2xl font-bold mb-2">Pulkit Goel</h2>
              <p className="text-lg leading-relaxed">Pulkit Goel is a co-founder of 99Notes and has a passion for education and helping others succeed.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="md:w-1/2 p-4 relative group">
              <Image src="/assets/images/sample_image2.jpg" alt="Pulkit Bharti" width={500} height={300} className="rounded-lg shadow-lg w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-lg">
                Pulkit Bharti
              </div>
            </div>
            <div className="md:w-1/2 p-4">
              <h2 className="text-2xl font-bold mb-2">Pulkit Bharti</h2>
              <p className="text-lg leading-relaxed">Pulkit Bharti is a co-founder of 99Notes and is dedicated to providing the best resources for UPSC aspirants.</p>
            </div>
          </div>
        </section>
        <section className="mb-12 w-full">
          <h1 className="text-3xl font-bold mb-4">Battle-Hardened Veterans</h1>
          <Slider images={veteranImages} />
        </section>
        <section className="mb-12 w-full">
          <h1 className="text-3xl font-bold mb-4">Other Core Members</h1>
          <Slider images={coreMemberImages} />
        </section>
      </main>
    </>
  );
};

export default About;
