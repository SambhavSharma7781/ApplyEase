import { Jobs } from "@/generated/prisma";
import JobCard from "@/components/cards/job-card";
import Header from "@/components/header";
import Link from "next/link";
import { Plus } from "lucide-react";

// Make this page dynamic to avoid build-time fetch issues
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fix URL for Vercel deployment
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/search`, {
    cache: 'no-store' // Prevent caching issues
  });
  const data = await res.json();
  const jobs: (Jobs & {
    company: {
      id: string;
      name: string;
      address?: string;
    };
  })[] = data.jobs;

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
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/addJob"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium hover:scale-105 active:scale-95"
              >
                <Plus size={18} />
                Post a Job
              </Link>
              <span className="text-sm text-gray-500">
                {jobs.length} active job{jobs.length !== 1 ? 's' : ''} available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {jobs.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Latest Opportunities
                </h2>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Recently updated
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs available</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're currently updating our job listings. Please check back soon for new opportunities.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}