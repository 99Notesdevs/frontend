import React from "react";
import Head from "next/head";
import ClientImage from "@/components/About/CientImage";
import { env } from "@/config/env";
import SliderWrapper from "@/components/About/SliderWrapper";
import { Content } from "next/font/google";

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
  const res = await fetch(`${env.API}/about-99-notes`);

  if (!res.ok) {
    throw new Error("Failed to fetch content");
  }

  const result = await res.json();
  const title = result.data.title;
  const content: Content = JSON.parse(result.data.content);

  return { title, content };
}

const About = async () => {
  let data: { title: string; content: Content };

  try {
    data = await fetchContent();
  } catch (error) {
    console.error("Error fetching content:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          Failed to load content. Please try again later.
        </p>
      </div>
    );
  }

  const { title, content } = data;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Learn more about 99Notes, our mission, and our values."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-blue-50/30">
        {/* Hero Section with asymmetric design */}
        <div className="absolute top-0 right-0 w-1/3 h-96 bg-blue-50/40 rounded-bl-[120px] transform rotate-6 z-0 max-w-full"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-80 bg-indigo-50/40 rounded-tr-[100px] transform -rotate-6 z-0 max-w-full"></div>
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative mt-6 md:mt-10">
          <div className="absolute -top-10 left-1/4 w-20 h-20 bg-blue-100/50 rounded-full animate-pulse hidden md:block"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-indigo-50/50 rounded-full animate-pulse delay-300 hidden md:block"></div>
          <div className="absolute top-40 right-40 w-16 h-16 bg-purple-100/40 rounded-full animate-pulse delay-700 hidden md:block"></div>

          {/* Asymmetric layout with offset elements */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
            <div className="w-full md:w-1/2 relative group transform transition-all duration-500 hover:scale-105">
              <div className="relative h-[300px] sm:h-[350px] md:h-[450px] overflow-hidden rounded-tl-3xl rounded-br-3xl rounded-tr-xl rounded-bl-xl shadow-xl">
                {/* Decorative corners */}
                <div className="absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 border-blue-400/60 rounded-tl-xl z-20"></div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 border-blue-400/60 rounded-br-xl z-20"></div>

                <ClientImage
                  src={content.heroImage}
                  alt="About 99 Notes"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative z-10">
              <div className="space-y-8">
                <h1 className="font-playfair text-6xl font-bold text-gray-900 leading-tight relative">
                  About{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                    99Notes
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      height="6"
                      viewBox="0 0 200 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 3C50 0.5 150 0.5 200 3"
                        stroke="url(#paint0_linear)"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear"
                          x1="0"
                          y1="3"
                          x2="200"
                          y2="3"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#3B82F6" />
                          <stop offset="1" stopColor="#6366F1" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>
                <p className="text-xl leading-relaxed text-gray-700 font-poppins pl-4 border-l-4 border-indigo-200">
                  {content.heroText}
                </p>
                {/* Decorative element */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                  <div className="w-4 h-1 bg-indigo-600 rounded-full"></div>
                  <div className="w-2 h-1 bg-purple-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section with modern layout */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-2xl"></div>

          <div className="text-center mb-12 md:mb-16 relative">
            <h2 className="font-playfair text-6xl font-bold text-gray-900 relative z-10">
              {content.whatWeDo.title}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-4"></div>
            <p className="text-gray-700 mt-6 max-w-2xl mx-auto text-lg font-poppins">
              {content.whatWeDo.description}
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <p className="text-xl leading-relaxed text-gray-700 font-poppins">
                {content.whatWeDo.description}
              </p>
              <ul className="space-y-6">
                {content.whatWeDo.items.map((item, index) => (
                  <li key={index} className="flex items-start space-x-4 group">
                    <span className="flex-shrink-0 w-8 h-8 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold transform group-hover:scale-110 transition-transform duration-300 rotate-3">
                      {index + 1}
                    </span>
                    <span className="text-xl text-gray-700 font-poppins group-hover:text-blue-600 transition-colors duration-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2 relative group transform transition-all duration-500 hover:scale-105">
              <div className="relative h-[300px] sm:h-[350px] md:h-[450px] overflow-hidden rounded-tr-3xl rounded-bl-3xl rounded-tl-xl rounded-br-xl shadow-xl">
                {/* Decorative corners */}
                <div className="absolute -top-4 -right-4 w-16 h-16 border-t-4 border-r-4 border-blue-400/60 rounded-tr-xl z-20"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-4 border-l-4 border-blue-400/60 rounded-bl-xl z-20"></div>

                <ClientImage
                  src={content.whatWeDo.image}
                  alt="What we do"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-bl from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section with improved aesthetics */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 -z-10"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-100/20 rounded-l-full -z-10 transform skew-y-6"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-indigo-100/20 rounded-tr-full -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-blue-200 opacity-70"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-blue-200 opacity-70"></div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-[1.01] transition-all duration-700">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center relative">
                  <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-blue-200 -mt-4 -ml-4"></div>
                  <h2 className="font-playfair text-5xl font-bold text-gray-900 mb-8 relative">
                    Our{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                      Mission
                      <svg
                        className="absolute -bottom-2 left-0 w-full"
                        height="6"
                        viewBox="0 0 200 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 3C50 0.5 150 0.5 200 3"
                          stroke="url(#paint0_linear)"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear"
                            x1="0"
                            y1="3"
                            x2="200"
                            y2="3"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#3B82F6" />
                            <stop offset="1" stopColor="#6366F1" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed font-poppins mb-6 first-letter:text-4xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-1 first-letter:float-left">
                    {content.mission.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-4">
                    <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                    <div className="w-6 h-1 bg-indigo-600 rounded-full"></div>
                    <div className="w-3 h-1 bg-purple-600 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-blue-200 -mb-4 -mr-4"></div>
                </div>
                <div className="md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-12 md:p-16 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-md"></div>
                  <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-md"></div>
                  <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-400/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-sm animate-pulse"></div>

                  <div className="text-white max-w-md relative z-10">
                    <h3 className="text-3xl font-bold font-playfair mb-8 relative inline-block">
                      Why Choose Us?
                      <div className="absolute -bottom-3 left-0 w-full h-0.5 bg-gradient-to-r from-white/80 to-white/20"></div>
                    </h3>
                    <ul className="space-y-6">
                      <li className="flex items-start group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4 group-hover:bg-white/30 transition-all duration-300">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-lg group-hover:translate-x-1 transition-transform duration-300">
                          Expert team with years of experience
                        </p>
                      </li>
                      <li className="flex items-start group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4 group-hover:bg-white/30 transition-all duration-300">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-lg group-hover:translate-x-1 transition-transform duration-300">
                          Innovative solutions for modern challenges
                        </p>
                      </li>
                      <li className="flex items-start group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4 group-hover:bg-white/30 transition-all duration-300">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-lg group-hover:translate-x-1 transition-transform duration-300">
                          Commitment to excellence and quality
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section with enhanced visuals */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-50/30 -z-10"></div>
          <div className="absolute top-1/4 right-0 w-1/3 h-1/2 bg-blue-50/50 rounded-l-full opacity-70 -z-10"></div>
          <div className="absolute left-0 bottom-0 w-1/4 h-full bg-indigo-50/40 -z-10 transform -skew-y-6"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="font-playfair text-5xl font-bold text-gray-900 relative inline-block">
                Meet Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Founder
                </span>
                <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-blue-200 to-transparent"></div>
              </h2>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="bg-white rounded-lg shadow-lg p-10 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 relative">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-200 -mt-4 -ml-4"></div>
                  <h3 className="text-3xl font-playfair font-bold text-gray-900 mb-2">
                    {content.founder.name}
                  </h3>
                  <p className="text-xl font-poppins text-blue-600 mb-6">
                    {content.founder.title}
                  </p>
                  <blockquote className="text-lg italic text-gray-700 border-l-4 border-blue-500 pl-6 py-2 mb-8 relative">
                    <div className="absolute -top-2 -left-2 text-5xl text-blue-200/50 font-serif">
                      "
                    </div>
                    <div className="relative z-10">{content.founder.quote}</div>
                    <div className="absolute -bottom-4 -right-2 text-5xl text-blue-200/50 font-serif">
                      "
                    </div>
                  </blockquote>
                  <div className="space-y-4">
                    {content.founder.description.map((desc, index) => (
                      <p
                        key={index}
                        className="text-gray-700 font-poppins leading-relaxed"
                      >
                        {desc}
                      </p>
                    ))}
                  </div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-200 -mb-4 -mr-4"></div>
                </div>
              </div>
              <div className="md:w-1/2 order-1 md:order-2 mb-10 md:mb-0">
                <div className="relative h-[450px] overflow-hidden rounded-tl-3xl rounded-br-3xl rounded-tr-xl rounded-bl-xl shadow-xl group">
                  {/* Decorative corners */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 border-blue-400/60 rounded-tl-xl z-20"></div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 border-blue-400/60 rounded-br-xl z-20"></div>

                  <ClientImage
                    src={content.founder.image}
                    alt={content.founder.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Co-Founder Section with asymmetric design */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50/90 to-blue-50/90 -z-10"></div>
          <div className="absolute bottom-1/4 left-0 w-1/3 h-1/2 bg-indigo-50/60 rounded-r-full opacity-70 -z-10"></div>
          <div className="absolute right-0 top-0 w-1/4 h-full bg-blue-50/40 -z-10 transform skew-y-6"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-5xl font-bold text-gray-900 mb-16 text-center relative inline-block">
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Co-Founder
              </span>
              <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent to-blue-200"></div>
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="relative h-[450px] overflow-hidden rounded-tr-3xl rounded-bl-3xl rounded-tl-xl rounded-br-xl shadow-xl group">
                  {/* Decorative corners */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 border-t-4 border-r-4 border-blue-400/60 rounded-tr-xl z-20"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-4 border-l-4 border-blue-400/60 rounded-bl-xl z-20"></div>

                  <ClientImage
                    src={content.cofounder.image}
                    alt={content.cofounder.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-bl from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-lg shadow-lg p-10 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 relative">
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-200 -mt-4 -mr-4"></div>
                  <h3 className="text-3xl font-playfair font-bold text-gray-900 mb-2">
                    {content.cofounder.name}
                  </h3>
                  <p className="text-xl font-poppins text-blue-600 mb-6">
                    {content.cofounder.title}
                  </p>
                  <blockquote className="text-lg italic text-gray-700 border-l-4 border-blue-500 pl-6 py-2 mb-8 relative">
                    <div className="absolute -top-2 -left-2 text-5xl text-blue-200/50 font-serif">
                      "
                    </div>
                    <div className="relative z-10">
                      {content.cofounder.quote}
                    </div>
                    <div className="absolute -bottom-4 -right-2 text-5xl text-blue-200/50 font-serif">
                      "
                    </div>
                  </blockquote>
                  <div className="space-y-4">
                    {content.cofounder.description.map((desc, index) => (
                      <p
                        key={index}
                        className="text-gray-700 font-poppins leading-relaxed"
                      >
                        {desc}
                      </p>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-200 -mb-4 -ml-4"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Battle-Hardened Veterans Section - Redesigned to match Core Members */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl my-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-2xl"></div>

          <div className="text-center mb-16 relative">
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-8xl text-blue-100/40 font-playfair font-bold">
              Veterans
            </span>
            <h2 className="font-playfair text-5xl font-bold text-gray-900 relative">
              Battle-Hardened{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Veterans
              </span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-4"></div>
            <p className="text-gray-700 mt-6 max-w-2xl mx-auto text-lg font-poppins">
              {content.veterans.description}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            {/* Decorative corners */}
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 border-blue-400/60 rounded-tl-xl z-20"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 border-blue-400/60 rounded-br-xl z-20"></div>

            <SliderWrapper images={content.veterans.images} />
          </div>
        </section>

        {/* Core Members Section - Enhanced */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl my-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-2xl"></div>

          <div className="text-center mb-16 relative">
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-8xl text-blue-100/40 font-playfair font-bold">
              Team
            </span>
            <h2 className="font-playfair text-5xl font-bold text-gray-900 relative">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Core Members
              </span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-4"></div>
            <p className="text-gray-700 mt-6 max-w-2xl mx-auto text-lg font-poppins">
              {content.coreMembers.description}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            {/* Decorative corners */}
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 border-blue-400/60 rounded-tl-xl z-20"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 border-blue-400/60 rounded-br-xl z-20"></div>

            <SliderWrapper images={content.coreMembers.images} />
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
