"use client";
import { useRouter } from 'next/navigation';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import withAuth from '@/lib/withAuth';

const inter = Inter({ subsets: ['latin'] });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

function Dashboard() {
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
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px w-8 bg-slate-200"></div>
                <h2
                  className={`${plusJakarta.className} text-[2rem] font-bold tracking-tight text-slate-800`}
                >
                  Welcome to Your Dashboard
                </h2>
              </div>
              <p className="text-[1rem] leading-6 text-slate-600">
                Select an option from the sidebar to get started
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default withAuth(Dashboard);