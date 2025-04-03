"use client";
import React, { useEffect } from "react";
import Head from "next/head";
import ClientImage from "@/components/About/CientImage";
import { env } from "@/config/env";
import SliderWrapper from "@/components/About/SliderWrapper";

interface Content {
  heroImage: string;
  heroText: string;
  whatWeDo: {
    title: string;
    description: string;
    items: string[];
    image: string;
  };
  mission: {
    title: string;
    description: string;
  };
  founder: {
    name: string;
    title: string;
    quote: string;
    description: string[];
    image: string;
  };
  cofounder: {
    name: string;
    title: string;
    quote: string;
    description: string[];
    image: string;
  };
  veterans: {
    title: string;
    description: string;
    images: { src: string; alt: string; info: string }[];
  };
  coreMembers: {
    title: string;
    description: string;
    images: { src: string; alt: string; info: string }[];
  };
}

async function fetchContent(): Promise<{ title: string; content: Content }> {
  const res = await fetch(`${env.API}/about-99-notes`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch content");
  }

  const result = await res.json();
  const title = result.data.title;
  const content: Content = JSON.parse(result.data.content);

  return { title, content };
}

function About() {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState<Content | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { title, content } = await fetchContent();
        setTitle(title);
        setContent(content);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchData();
  }
  , []);


  if(!content) return <div>Loading...</div>;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Learn more about 99Notes, our mission, and our values." />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
                <ClientImage
                  src={content.heroImage}
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
                <p className="text-xl leading-relaxed text-gray-700 font-poppins">{content.heroText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-playfair text-6xl font-bold text-gray-900">
                {content.whatWeDo.title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <p className="text-xl leading-relaxed text-gray-700 font-poppins">{content.whatWeDo.description}</p>
                <ul className="space-y-6">
                  {content.whatWeDo.items.map((item, index) => (
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
                <ClientImage
                  src={content.whatWeDo.image}
                  alt="What we do"
                  width={600}
                  height={400}
                  className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-6xl font-bold text-gray-900">
              {content.mission.title}
            </h2>
            <p className="text-xl leading-relaxed text-gray-700 font-poppins">
              {content.mission.description}
            </p>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-6xl font-bold text-gray-900">
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Founder
              </span>
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <ClientImage
                  src={content.founder.image}
                  alt={content.founder.name}
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-4xl font-playfair font-bold">
                  {content.founder.name}
                </h3>
                <p className="text-xl font-poppins text-gray-700">
                  {content.founder.title}
                </p>
                <blockquote className="text-lg italic text-gray-600">
                  {content.founder.quote}
                </blockquote>
                {content.founder.description.map((desc, index) => (
                  <p key={index} className="text-lg text-gray-700 font-poppins">
                    {desc}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Co-Founder Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-6xl font-bold text-gray-900">
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Co-Founder
              </span>
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <ClientImage
                  src={content.cofounder.image}
                  alt={content.cofounder.name}
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-4xl font-playfair font-bold">
                  {content.cofounder.name}
                </h3>
                <p className="text-xl font-poppins text-gray-700">
                  {content.cofounder.title}
                </p>
                <blockquote className="text-lg italic text-gray-600">
                  {content.cofounder.quote}
                </blockquote>
                {content.cofounder.description.map((desc, index) => (
                  <p key={index} className="text-lg text-gray-700 font-poppins">
                    {desc}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-4xl font-bold text-gray-900">
              Battle-Hardened{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Veterans
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {content.veterans.description}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <SliderWrapper images={content.veterans.images} />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-4xl font-bold text-gray-900">
              Other{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Core Members
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              O{content.coreMembers.description}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <SliderWrapper images={content.coreMembers.images} />
          </div>
        </section>
      </main>
      <style jsx global>{`
        .font-playfair {
          font-family: "Playfair Display", serif;
        }
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};


export default About;
