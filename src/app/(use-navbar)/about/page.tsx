import Head from "next/head"
import ClientImage from "@/components/About/CientImage"
import SliderWrapper from "@/components/About/SliderWrapper"
import { api } from "@/config/api/route"

interface Content {
  heroImage: string
  heroText: string
  whatWeDo: {
    title: string
    description: string
    items: string[]
    image: string
  }
  mission: {
    title: string
    description: string
  }
  founder: {
    name: string
    title: string
    quote: string
    description: string[]
    image: string
  }
  cofounder: {
    name: string
    title: string
    quote: string
    description: string[]
    image: string
  }
  veterans: {
    title: string
    description: string
    images: { src: string; alt: string; info: string }[]
  }
  coreMembers: {
    title: string
    description: string
    images: { src: string; alt: string; info: string }[]
  }
}

async function fetchContent(): Promise<{ title: string; content: Content }> {
  const res = await api.get(`/about-99-notes`) as { success: boolean, data: { title: string; content: string } }

  if (!res.success) {
    throw new Error("Failed to fetch content")
  }

  const title = res.data.title
  const content: Content = JSON.parse(res.data.content)

  return { title, content }
}

const About = async () => {
  let data: { title: string; content: Content }

  try {
    data = await fetchContent()
  } catch (error) {
    console.error("Error fetching content:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <p className="text-red-500 text-lg">Failed to load content. Please try again later.</p>
      </div>
    )
  }

  const { title, content } = data
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
      <main className="w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-amber-50/30 dark:from-slate-900 dark:to-slate-800/70 relative">
        {/* Hero Section with asymmetric design */}
        <div className="absolute top-0 right-0 w-1/2 sm:w-1/3 h-40 sm:h-96 bg-amber-50/40 dark:bg-slate-800/30 rounded-bl-[60px] sm:rounded-bl-[120px] transform rotate-6 z-0 max-w-full hidden xs:block"></div>
        <div className="absolute bottom-0 left-0 w-1/2 sm:w-1/4 h-32 sm:h-80 bg-amber-50/40 dark:bg-slate-800/30 rounded-tr-[50px] sm:rounded-tr-[100px] transform -rotate-6 z-0 max-w-full hidden xs:block"></div>
        <section className="w-full max-w-7xl mx-auto px-2 lg:px-4 py-6 md:py-12 relative mt-2">
          <div className="absolute -top-6 left-1/4 w-10 h-10 bg-amber-100/50 rounded-full animate-pulse hidden md:block"></div>
          <div className="absolute bottom-6 right-10 w-16 h-16 bg-amber-50/50 rounded-full animate-pulse delay-300 hidden md:block"></div>
          <div className="absolute top-20 right-20 w-8 h-8 bg-amber-100/40 rounded-full animate-pulse delay-700 hidden md:block"></div>

          {/* Asymmetric layout with offset elements */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16 relative">
            <div className="w-full md:w-1/2 relative group transform transition-all duration-500 hover:scale-105">
              <div className="relative h-48 xs:h-60 sm:h-[350px] md:h-[450px] overflow-hidden rounded-tl-2xl sm:rounded-tl-3xl rounded-br-2xl sm:rounded-br-3xl rounded-tr-xl rounded-bl-xl shadow-xl">
                {/* Decorative corners */}
                <div className="absolute -top-2 -left-2 w-8 h-8 sm:w-16 sm:h-16 border-t-4 border-l-4 border-amber-400/60 rounded-tl-xl z-20"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-16 sm:h-16 border-b-4 border-r-4 border-amber-400/60 rounded-br-xl z-20"></div>

                <ClientImage
                  src={content.heroImage}
                  alt="About 99 Notes"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative z-10 mt-6 md:mt-0">
              <div className="space-y-4 xs:space-y-8">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--surface-darker)] dark:text-white leading-tight relative">
                  About{" "}
                  <span className="text-[var(--nav-primary)]">
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
                        <linearGradient id="paint0_linear" x1="0" y1="3" x2="200" y2="3" gradientUnits="userSpaceOnUse">
                          <stop stopColor="var(--nav-primary)" />
                          <stop offset="1" stopColor="var(--nav-secondary)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>
                <p className="text-base xs:text-lg sm:text-xl leading-relaxed text-[var(--text-strong)] dark:text-gray-300 pl-2 xs:pl-4 border-l-2 xs:border-l-4 border-[var(--nav-primary)]">
                  {content.heroText}
                </p>
                {/* Decorative element */}
                <div className="flex items-center space-x-1 xs:space-x-2">
                  <div className="w-4 xs:w-8 h-1 bg-[var(--nav-secondary)] rounded-full"></div>
                  <div className="w-2 xs:w-4 h-1 bg-[var(--nav-primary)] rounded-full"></div>
                  <div className="w-1 xs:w-2 h-1 bg-amber-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section with modern layout */}
        <section className="w-full max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-24 relative">
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-amber-200/20 rounded-full blur-2xl hidden md:block"></div>
          <div className="absolute bottom-0 left-0 w-40 sm:w-80 h-40 sm:h-80 bg-amber-200/20 rounded-full blur-2xl hidden md:block"></div>

          <div className="text-center mb-8 sm:mb-12 md:mb-16 relative">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--surface-darker)] relative z-10">{content.whatWeDo.title}</h2>
            <div className="w-12 sm:w-24 h-1.5 bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)] rounded-full mx-auto mt-4"></div>
            <p className="text-[var(--text-strong)] mt-6 max-w-2xl mx-auto text-lg ">{content.whatWeDo.description}</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 md:gap-16 items-center">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <p className="text-lg sm:text-xl leading-relaxed text-[var(--text-strong)] dark:text-gray-300">{content.whatWeDo.description}</p>
              <ul className="space-y-4 sm:space-y-6">
                {content.whatWeDo.items.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2 sm:space-x-4 group">
                    <span className="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-md bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)] flex items-center justify-center text-white font-bold transform group-hover:scale-110 transition-transform duration-300 rotate-3">
                      {index + 1}
                    </span>
                    <span className="text-lg sm:text-xl text-[var(--text-strong)] dark:text-gray-300 group-hover:text-[var(--nav-secondary)] transition-colors duration-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2 relative group transform transition-all duration-500 hover:scale-105">
              <div className="relative h-48 xs:h-60 sm:h-[350px] md:h-[450px] overflow-hidden rounded-tr-2xl sm:rounded-tr-3xl rounded-bl-2xl sm:rounded-bl-3xl rounded-tl-xl rounded-br-xl shadow-xl">
                {/* Decorative corners */}
                <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-16 sm:h-16 border-t-4 border-r-4 border-amber-400/60 rounded-tr-xl z-20"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 sm:w-16 sm:h-16 border-b-4 border-l-4 border-amber-400/60 rounded-bl-xl z-20"></div>

                <ClientImage
                  src={content.whatWeDo.image}
                  alt="What we do"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-bl from-amber-600/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section with improved aesthetics */}
        <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden bg-white dark:bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-amber-50/50 dark:from-slate-800/50 dark:to-slate-800/50 -z-10"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-100/20 dark:bg-slate-700/30 rounded-l-full -z-10 transform skew-y-6 hidden md:block"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-amber-100/20 dark:bg-slate-700/30 rounded-tr-full -z-10"></div>

          <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
            <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-amber-200 opacity-70 hidden md:block"></div>
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-amber-200 opacity-70 hidden md:block"></div>

            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-[var(--bg-elevated)] dark:border-slate-700 transform hover:scale-[1.01] transition-all duration-700">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center relative">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-200 -mt-4 -ml-4 hidden md:block"></div>
                  <h2 className="text-4xl xs:text-5xl sm:text-6xl font-bold text-[var(--surface-darker)] dark:text-white mb-8 relative">
                    Our{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)] relative">
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
                            <stop stopColor="var(--nav-primary)" />
                            <stop offset="1" stopColor="var(--nav-secondary)" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </h2>
                  <p className="text-lg sm:text-xl leading-relaxed text-[var(--text-strong)] dark:text-gray-300 mb-6 first-letter:text-3xl first-letter:font-bold first-letter:text-[var(--nav-secondary)] first-letter:mr-1 first-letter:float-left">
                    {content.mission.description}
                  </p>
                  <div className="flex items-center space-x-1 sm:space-x-2 mt-4">
                    <div className="w-8 sm:w-12 h-1 bg-[var(--nav-secondary)] rounded-full"></div>
                    <div className="w-4 sm:w-6 h-1 bg-[var(--nav-primary)] rounded-full"></div>
                    <div className="w-2 sm:w-3 h-1 bg-amber-400 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-amber-200 -mb-4 -mr-4 hidden md:block"></div>
                </div>
                <div className="md:w-1/2 bg-gradient-to-br from-amber-400 via-[var(--nav-primary)] to-[var(--nav-secondary)] p-8 sm:p-12 md:p-16 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-md animate-pulse hidden md:block"></div>
                  <div className="absolute -bottom-8 -left-8 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full blur-md hidden md:block"></div>
                  <div className="absolute top-1/2 left-1/2 w-12 sm:w-16 h-12 sm:h-16 bg-amber-400/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-sm animate-pulse hidden md:block"></div>

                  <div className="text-white max-w-md relative z-10">
                    <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-8 relative inline-block">
                      Why Choose Us?
                      <div className="absolute -bottom-3 left-0 w-full h-0.5 bg-gradient-to-r from-white/80 to-white/20"></div>
                    </h3>
                    <ul className="space-y-4 sm:space-y-6">
                      <li className="flex items-start group">
                        <div className="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white/20 flex items-center justify-center mr-2 sm:mr-4 group-hover:bg-white/30 transition-all duration-300">
                          <svg className="h-4 sm:h-5 w-4 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-lg sm:text-xl group-hover:translate-x-1 transition-transform duration-300">
                          Expert team with years of experience
                        </p>
                      </li>
                      <li className="flex items-start group">
                        <div className="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white/20 flex items-center justify-center mr-2 sm:mr-4 group-hover:bg-white/30 transition-all duration-300">
                          <svg className="h-4 sm:h-5 w-4 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-lg sm:text-xl group-hover:translate-x-1 transition-transform duration-300">
                          Innovative solutions for modern challenges
                        </p>
                      </li>
                      <li className="flex items-start group">
                        <div className="flex-shrink-0 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white/20 flex items-center justify-center mr-2 sm:mr-4 group-hover:bg-white/30 transition-all duration-300">
                          <svg className="h-4 sm:h-5 w-4 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-lg sm:text-xl group-hover:translate-x-1 transition-transform duration-300">
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
        <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white to-amber-50/30 dark:from-slate-900/95 dark:to-amber-900/10 -z-10"></div>
          <div className="absolute top-1/4 right-0 w-1/3 h-1/2 bg-amber-50/50 dark:bg-amber-900/10 rounded-l-full opacity-70 dark:opacity-50 -z-10"></div>
          <div className="absolute left-0 bottom-0 w-1/4 h-full bg-amber-50/40 dark:bg-amber-900/10 -z-10 transform -skew-y-6"></div>
          <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl xs:text-5xl sm:text-6xl font-bold text-[var(--surface-darker)] dark:text-[var(--surface-dark)] relative inline-block">
                Meet Our{" "}
                <span className="text-[var(--nav-primary)] bg-clip-text bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)]">
                  Founder
                </span>
                <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent to-amber-200"></div>
              </h2>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 sm:p-12 md:p-16 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 relative border border-gray-100 dark:border-slate-700">
                  <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-amber-200 dark:border-amber-800 -mt-4 -mr-4 hidden md:block"></div>
                  <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[var(--surface-darker)] mb-2">{content.founder.name}</h3>
                  <p className="text-lg sm:text-xl text-[var(--nav-secondary)] mb-6">{content.founder.title}</p>
                  <blockquote className="text-lg sm:text-xl italic text-[var(--text-strong)] border-l-4 border-[var(--nav-primary)] pl-6 py-2 mb-8 relative">
                    <div className="absolute -top-2 -left-2 text-4xl text-amber-200/50 ">"</div>
                    <div className="relative z-10">{content.founder.quote}</div>
                    <div className="absolute -bottom-4 -right-2 text-4xl text-amber-200/50 ">"</div>
                  </blockquote>
                  <div className="space-y-4 sm:space-y-6">
                    {content.founder.description.map((desc, index) => (
                      <p key={index} className="text-[var(--text-strong)] font-poppins leading-relaxed">
                        {desc}
                      </p>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-200 dark:border-amber-800 -mb-4 -ml-4 hidden md:block"></div>
                </div>
              </div>
              <div className="md:w-1/2 order-1 md:order-2 mb-8 sm:mb-12 md:mb-0">
                <div className="relative h-48 xs:h-60 sm:h-[350px] md:h-[450px] overflow-hidden rounded-tl-2xl sm:rounded-tl-3xl rounded-br-2xl sm:rounded-br-3xl rounded-tr-xl rounded-bl-xl shadow-xl group px-2 xs:px-4 sm:px-0">
                  {/* Decorative corners */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 sm:w-16 sm:h-16 border-t-4 border-l-4 border-amber-400/60 rounded-tl-xl z-20"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-16 sm:h-16 border-b-4 border-r-4 border-amber-400/60 rounded-br-xl z-20"></div>

                  <ClientImage
                    src={content.founder.image}
                    alt={content.founder.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Co-Founder Section with asymmetric design */}
        <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50/90 to-amber-50/90 dark:from-slate-900/95 dark:to-amber-900/10 -z-10"></div>
          <div className="absolute bottom-1/4 left-0 w-1/3 h-1/2 bg-amber-50/60 dark:bg-amber-900/10 rounded-r-full opacity-70 dark:opacity-50 -z-10"></div>
          <div className="absolute right-0 top-0 w-1/4 h-full bg-amber-50/40 dark:bg-amber-900/10 -z-10 transform skew-y-6"></div>
          <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl xs:text-5xl sm:text-6xl font-bold text-[var(--surface-darker)]dark:text-[var(--surface-dark)] mb-12 sm:mb-16 text-center relative inline-block">
              Meet Our{" "}
              <span className="text-[var(--nav-primary)] bg-clip-text bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)]">
                Co-Founder
              </span>
              <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent to-amber-200"></div>
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16">
              <div className="md:w-1/2">
                <div className="relative h-48 xs:h-60 sm:h-[350px] md:h-[450px] overflow-hidden rounded-tr-2xl sm:rounded-tr-3xl rounded-bl-2xl sm:rounded-bl-3xl rounded-tl-xl rounded-br-xl shadow-xl group">
                  {/* Decorative corners */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-16 sm:h-16 border-t-4 border-r-4 border-amber-400/60 rounded-tr-xl z-20"></div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 sm:w-16 sm:h-16 border-b-4 border-l-4 border-amber-400/60 rounded-bl-xl z-20"></div>

                  <ClientImage
                    src={content.cofounder.image}
                    alt={content.cofounder.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-bl from-amber-600/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 sm:p-12 md:p-16 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 relative border border-gray-100 dark:border-slate-700">
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-200 dark:border-amber-800 -mt-4 -mr-4 hidden md:block"></div>
                  <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[var(--surface-darker)] mb-2">{content.cofounder.name}</h3>
                  <p className="text-lg sm:text-xl text-[var(--nav-secondary)] mb-6">{content.cofounder.title}</p>
                  <blockquote className="text-lg sm:text-xl italic text-[var(--text-strong)] border-l-4 border-[var(--nav-primary)] pl-6 py-2 mb-8 relative">
                    <div className="absolute -top-2 -left-2 text-4xl text-amber-200/50 ">"</div>
                    <div className="relative z-10">{content.cofounder.quote}</div>
                    <div className="absolute -bottom-4 -right-2 text-4xl text-amber-200/50 ">"</div>
                  </blockquote>
                  <div className="space-y-4 sm:space-y-6">
                    {content.cofounder.description.map((desc, index) => (
                      <p key={index} className="text-[var(--text-strong)] leading-relaxed">
                        {desc}
                      </p>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-200 dark:border-amber-800 -mb-4 -ml-4 hidden md:block"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Battle-Hardened Veterans Section - Redesigned to match Core Members */}
        <section className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8 py-5 bg-gradient-to-r from-amber-50 to-amber-50 dark:from-slate-800/80 dark:to-amber-900/10 rounded-3xl my-8 sm:my-12 md:my-16 relative overflow-hidden border border-amber-100/50 dark:border-slate-700/50">
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-amber-200/20 dark:bg-amber-800/10 rounded-full blur-2xl hidden md:block"></div>
          <div className="absolute bottom-0 left-0 w-40 sm:w-80 h-40 sm:h-80 bg-amber-200/20 dark:bg-amber-800/10 rounded-full blur-2xl hidden md:block"></div>

          <div className="text-center mb-8 sm:mb-12 md:mb-16 relative">
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl text-amber-100/40 dark:text-amber-900/20 font-poppins font-bold">
              Veterans
            </span>
            <h2 className="text-4xl xs:text-5xl sm:text-6xl font-bold text-[var(--surface-darker)] relative">
              Battle-Hardened{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)]">
                Veterans
              </span>
            </h2>
            <div className="w-12 sm:w-24 h-1.5 bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)] rounded-full mx-auto mt-4"></div>
            <p className="text-[var(--text-strong)] mt-6 max-w-2xl mx-auto text-lg font-poppins">{content.veterans.description}</p>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl p-8 sm:p-12 md:p-16 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group border border-amber-100/50 dark:border-slate-700/50">
            {/* Decorative corners */}
            <div className="absolute -top-2 -left-2 w-8 h-8 sm:w-16 sm:h-16 border-t-4 border-l-4 border-amber-400/60 dark:border-amber-600/60 rounded-tl-xl z-20"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-16 sm:h-16 border-b-4 border-r-4 border-amber-400/60 dark:border-amber-600/60 rounded-br-xl z-20"></div>

            <SliderWrapper images={content.veterans.images} />
          </div>
        </section>

        {/* Core Members Section - Enhanced */}
        <section className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8 py-5 bg-gradient-to-r from-amber-50 to-amber-50 dark:from-slate-800/80 dark:to-amber-900/10 rounded-3xl my-8 sm:my-12 md:my-16 relative overflow-hidden border border-amber-100/50 dark:border-slate-700/50">
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-amber-200/20 dark:bg-amber-800/10 rounded-full blur-2xl hidden md:block"></div>
          <div className="absolute bottom-0 left-0 w-40 sm:w-80 h-40 sm:h-80 bg-amber-200/20 dark:bg-amber-800/10 rounded-full blur-2xl hidden md:block"></div>

          <div className="text-center mb-8 sm:mb-12 md:mb-16 relative">
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl text-amber-100/40 dark:text-amber-900/20 font-poppins font-bold">
              Team
            </span>
            <h2 className="text-4xl xs:text-5xl sm:text-6xl font-bold text-[var(--surface-darker)] relative">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)]">
                Core Members
              </span>
            </h2>
            <div className="w-12 sm:w-24 h-1.5 bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)] rounded-full mx-auto mt-4"></div>
            <p className="text-[var(--text-strong)] mt-6 max-w-2xl mx-auto text-lg font-poppins">
              {content.coreMembers.description}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl p-8 sm:p-12 md:p-16 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group border border-amber-100/50 dark:border-slate-700/50">
            {/* Decorative corners */}
            <div className="absolute -top-2 -left-2 w-8 h-8 sm:w-16 sm:h-16 border-t-4 border-l-4 border-amber-400/60 dark:border-amber-600/60 rounded-tl-xl z-20"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-16 sm:h-16 border-b-4 border-r-4 border-amber-400/60 dark:border-amber-600/60 rounded-br-xl z-20"></div>

            <SliderWrapper images={content.coreMembers.images} />
          </div>
        </section>
      </main>
    </>
  )
}

export default About