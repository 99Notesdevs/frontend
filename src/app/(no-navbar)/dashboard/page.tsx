"use client";
import { useRouter } from 'next/navigation';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { FaPlus, FaEdit } from 'react-icons/fa';

const inter = Inter({ subsets: ['latin'] });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });


export default function Dashboard() {
  const router = useRouter();

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f8f9ff] relative ${inter.className}`}
    >
      {/*pattern overlay */}
      <div className="absolute inset-0 bg-grid-slate-50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.2))] -z-10" />

      <section className="w-full py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-16 h-0.5 bg-slate-400 rounded-full mb-4" />

            <h1
              className={`${plusJakarta.className} text-[2.75rem] leading-[1.2] font-bold tracking-[-0.02em] text-slate-900 sm:text-5xl xl:text-[4.5rem]`}
            >
              Admin Dashboard
            </h1>
            <p className="max-w-[700px] text-[1.125rem] leading-7 text-slate-600 mx-auto font-medium">
              Welcome to your{" "}
              <span className="text-slate-900">content management hub</span>.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            {/*Article browser*/}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-8 bg-slate-200"></div>
                <h2
                  className={`${plusJakarta.className} text-[2rem] font-bold tracking-tight text-slate-800`}
                >
                  Browse & Edit Articles
                </h2>
              </div>
              <p className="text-[1rem] leading-6 text-slate-600">
                Manage your content collection with ease
              </p>
            </div>

            {/*button grid*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => router.push("/dashboard/add")}
                className="group relative overflow-hidden rounded-xl bg-slate-800 shadow-lg transition-all hover:bg-slate-700"
              >
                <div className="relative flex items-center gap-4 px-8 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                    <FaPlus className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`${plusJakarta.className} text-[1.125rem] font-semibold tracking-wide text-white mb-0.5`}
                    >
                      Add Article
                    </h3>
                    <p className="text-[0.875rem] leading-5 text-slate-300">
                      Create new content
                    </p>
                  </div>
                </div>
              </button>
              {/* Add current-affair button*/}
              <button
                onClick={() => router.push("/dashboard/current-affair")}
                className="group relative overflow-hidden rounded-xl bg-slate-800 shadow-lg transition-all hover:bg-slate-700"
              >
                <div className="relative flex items-center gap-4 px-8 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                    <FaPlus className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`${plusJakarta.className} text-[1.125rem] font-semibold tracking-wide text-white mb-0.5`}
                    >
                      Add Current Affair
                    </h3>
                    <p className="text-[0.875rem] leading-5 text-slate-300">
                      Create new content
                    </p>
                  </div>
                </div>
              </button>

              {/* Edit about button*/}
              <button
                onClick={() => router.push("/dashboard/update-about")}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="relative flex items-center gap-4 px-8 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                    <FaEdit className="h-6 w-6 text-slate-700" />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`${plusJakarta.className} text-[1.125rem] font-semibold tracking-wide text-slate-800 mb-0.5`}
                    >
                      Edit About99
                    </h3>
                    <p className="text-[0.875rem] leading-5 text-slate-600">
                      Modify existing About99Notes Page
                    </p>
                  </div>
                </div>
              </button>

              {/* Edit button*/}
              <button
                onClick={() => router.push("/dashboard/edit")}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="relative flex items-center gap-4 px-8 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                    <FaEdit className="h-6 w-6 text-slate-700" />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`${plusJakarta.className} text-[1.125rem] font-semibold tracking-wide text-slate-800 mb-0.5`}
                    >
                      Edit Articles
                    </h3>
                    <p className="text-[0.875rem] leading-5 text-slate-600">
                      Modify existing content
                    </p>
                  </div>
                </div>
              </button>
              {/* Edit button*/}
              <button
                onClick={() => router.push("/dashboard/editcurrent")}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="relative flex items-center gap-4 px-8 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                    <FaEdit className="h-6 w-6 text-slate-700" />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`${plusJakarta.className} text-[1.125rem] font-semibold tracking-wide text-slate-800 mb-0.5`}
                    >
                      Edit Current Affairs
                    </h3>
                    <p className="text-[0.875rem] leading-5 text-slate-600">
                      Modify existing content
                    </p>
                  </div>
                </div>
              </button>

              {/* Manage Forms button */}
              <button
                onClick={() => router.push("/dashboard/forms")}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="relative flex items-center gap-4 px-8 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                    <FaEdit className="h-6 w-6 text-slate-700" />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`${plusJakarta.className} text-[1.125rem] font-semibold tracking-wide text-slate-800 mb-0.5`}
                    >
                      Manage Forms
                    </h3>
                    <p className="text-[0.875rem] leading-5 text-slate-600">
                      View and manage submitted forms
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
