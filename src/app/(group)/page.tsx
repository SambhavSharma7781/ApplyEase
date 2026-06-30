import JobCard from "@/components/cards/job-card";
import EmptyState from "@/components/empty-state";
import Link from "next/link";
import { Search, Plus, Briefcase } from "lucide-react";
import prismaClient from "@/services/prisma";
import { getUserFromCookies } from "@/helper";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getUserFromCookies();
  try {
    const totalJobsCount = await prismaClient.openings.count();
    
    const jobs = await prismaClient.openings.findMany({
      take: 6,
      orderBy: { id: 'desc' },
      include: {
        company: {
          select: { id: true, name: true, description: true }
        }
      }
    });

    const formattedJobs = jobs.map(job => ({
      ...job,
      company: { id: job.company.id, name: job.company.name, address: job.location }
    }));

    return (
      <main className="min-h-screen bg-white">
        {/* Clean & Premium Hero */}
        <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pb-32 bg-white">
          {/* Subtle Ambient Background */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-600 opacity-20 blur-[100px]"></div>
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 backdrop-blur-sm px-5 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition-transform hover:scale-105">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                {totalJobsCount} open role{totalJobsCount !== 1 ? 's' : ''} available
              </div>
              <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Find Your Next <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Dream Job
                </span>
              </h1>
              <p className="mb-10 text-lg text-gray-500 sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                Discover opportunities from top companies and take the next step in your career journey with ApplyEase.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/search"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 active:scale-95"
                >
                  <Search size={18} className="transition-transform group-hover:scale-110" />
                  Explore Opportunities
                </Link>
                {user?.role === 'employer' && (
                  <Link
                    href="/addJob"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 font-bold text-gray-700 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-gray-50 hover:text-indigo-600 hover:-translate-y-0.5 active:scale-95"
                  >
                    <Plus size={18} />
                    Post a Job
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Jobs */}
        <section className="py-12 sm:py-16 bg-slate-50 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {formattedJobs.length > 0 ? (
              <>
                <div className="mb-10 flex items-center justify-between">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Latest Opportunities</h2>
                  <Link href="/search" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                    View all jobs &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {formattedJobs.map((job, idx) => (
                    <div 
                      key={job.id} 
                      className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                      style={{ animationDelay: `${idx * 100}ms`, animationDuration: '500ms' }}
                    >
                      <JobCard item={job} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                icon={<Briefcase size={32} />}
                title="No Jobs Available"
                description="We're currently updating our job listings. Check back soon for new opportunities."
                {...(user?.role === 'employer' ? {
                  actionText: "Post a Job",
                  actionHref: "/addJob"
                } : {})}
              />
            )}
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:py-20">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Find Your Next <span className="text-blue-600">Dream Job</span>
            </h1>
            <p className="text-gray-500">We&apos;re loading job opportunities. Please refresh the page.</p>
          </div>
        </section>
      </main>
    );
  }
}
