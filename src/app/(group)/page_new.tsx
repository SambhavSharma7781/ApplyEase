import { Jobs } from "@/generated/prisma";
import JobCard from "@/components/cards/job-card";
import Header from "@/components/header";
import Link from "next/link";
import { Plus } from "lucide-react";
import prismaClient from "@/services/prisma";

// Make this page dynamic to avoid build-time fetch issues
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Direct database call instead of API fetch to avoid URL issues
  try {
    const jobs = await prismaClient.openings.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    const formattedJobs: (Jobs & {
      company: {
        id: string;
        name: string;
        address?: string;
      };
    })[] = jobs.map(job => ({
      ...job,
      company: {
        id: job.company.id,
        name: job.company.name,
        address: job.location // Use job location as address fallback
      }
    }));

    return (
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Find Your Next 
                <span className="text-blue-600"> Dream Job</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Discover opportunities from top companies and take the next step in your career journey.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/search" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Jobs
                </Link>
                <Link 
                  href="/addJob" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-base"
                >
                  <Plus size={20} />
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {formattedJobs.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Latest Job Openings</h2>
                  <span className="text-sm text-gray-500">{formattedJobs.length} jobs available</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {formattedJobs.map((job) => (
                    <JobCard key={job.id} item={job} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Available</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We&apos;re currently updating our job listings. Please check back soon for new opportunities.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Find Your Next 
                <span className="text-blue-600"> Dream Job</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                We&apos;re currently loading job opportunities. Please refresh the page.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }
}
