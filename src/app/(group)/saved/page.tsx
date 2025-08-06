"use client"
import React, { useContext } from 'react'
import { SavedJobsContext } from '../layout'
import JobCard from '@/components/cards/job-card'
import { Bookmark, Heart } from 'lucide-react'

export default function Saved() {
  const context = useContext(SavedJobsContext);
  
  if (!context) {
    return <div>Loading...</div>;
  }
  
  const { savedJobs } = context;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bookmark size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Saved Jobs
              </h1>
              <p className="text-gray-600 mt-1">
                {savedJobs?.length > 0 
                  ? `You have ${savedJobs.length} saved job${savedJobs.length !== 1 ? 's' : ''}`
                  : 'No saved jobs yet'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {savedJobs && savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {savedJobs.map(job => (
              <JobCard key={job.id} item={job} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No saved jobs yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start browsing jobs and save the ones you're interested in. They'll appear here for easy access.
              </p>
              <div className="space-y-3 text-sm text-gray-500">
                <p className="font-medium">Get started:</p>
                <ul className="space-y-1 text-left">
                  <li>• Browse available job listings</li>
                  <li>• Click the bookmark icon to save jobs</li>
                  <li>• Come back here to review your saved jobs</li>
                </ul>
              </div>
              
              {/* Call to Action */}
              <div className="mt-8">
                <a 
                  href="/" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <Bookmark size={16} />
                  Browse Jobs
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}