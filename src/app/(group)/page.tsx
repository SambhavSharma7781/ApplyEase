import JobCard from "@/components/cards/job-card";
import EmptyState from "@/components/empty-state";
import Link from "next/link";
import { Search, Plus, Briefcase } from "lucide-react";
import prismaClient from "@/services/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    const jobs = await prismaClient.openings.findMany({
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
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero */}
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
                <Briefcase size={14} />
                {formattedJobs.length} open role{formattedJobs.length !== 1 ? 's' : ''} available
              </div>
              <h1 className="mb-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Find Your Next{' '}
                <span className="text-blue-600">Dream Job</span>
              </h1>
              <p className="mb-8 text-lg text-gray-500 sm:text-xl">
                Discover opportunities from top companies and take the next step in your career journey.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
                >
                  <Search size={18} />
                  Search Jobs
                </Link>
                <Link
                  href="/addJob"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                >
                  <Plus size={18} />
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {formattedJobs.length > 0 ? (
              <>
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Latest Job Openings</h2>
                  <Link href="/search" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {formattedJobs.map((job) => (
                    <JobCard key={job.id} item={job} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                icon={<Briefcase size={32} />}
                title="No Jobs Available"
                description="We're currently updating our job listings. Check back soon for new opportunities."
                actionText="Post a Job"
                actionHref="/addJob"
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
