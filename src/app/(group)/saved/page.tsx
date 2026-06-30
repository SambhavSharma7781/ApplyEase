"use client"
import React, { useContext } from 'react'
import { SavedJobsContext } from '@/components/client-providers'
import JobCard from '@/components/cards/job-card'
import PageHeader from '@/components/page-header'
import EmptyState from '@/components/empty-state'
import { Bookmark } from 'lucide-react'

export default function Saved() {
  const context = useContext(SavedJobsContext);

  if (!context) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const { savedJobs } = context;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          icon={<Bookmark size={24} />}
          title="Saved Jobs"
          subtitle={
            savedJobs?.length > 0
              ? `${savedJobs.length} saved job${savedJobs.length !== 1 ? 's' : ''}`
              : 'Jobs you bookmark will appear here'
          }
        />

        {savedJobs && savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {savedJobs.map((job, idx) => (
              <div 
                key={job.id}
                className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                style={{ animationDelay: `${idx * 50}ms`, animationDuration: '400ms' }}
              >
                <JobCard item={job} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Bookmark size={32} />}
            title="No saved jobs yet"
            description="Browse jobs and click the bookmark icon to save them here for easy access."
            actionText="Browse Jobs"
            actionHref="/search"
          />
        )}
      </div>
    </div>
  );
}
