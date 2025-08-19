import React from 'react';
import Link from 'next/link';
import { CheckCircle, MapPin, Building2, DollarSign, IndianRupee } from 'lucide-react';

// Types based on the Prisma schema structure
interface AppliedJobCardProps {
  application: {
    id: string;
    job: {
      id: string;
      title: string;
      description: string;
      location: string;
      salary: number;
      company: {
        id: string;
        name: string;
        description: string;
      } | null;
    };
  };
}

export default function AppliedJobCard({ application }: AppliedJobCardProps) {
  const { job } = application;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 p-5 sm:p-6 h-full flex flex-col">
      {/* Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          <CheckCircle size={14} />
          Applied
        </span>
      </div>

      {/* Job Title */}
      <h3 className="font-semibold text-gray-900 text-lg sm:text-xl leading-tight line-clamp-2 mb-3">
        {job.title}
      </h3>

      {/* Job Details */}
      <div className="space-y-2 mb-4 flex-1">
        {job.company && (
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 size={16} />
            <span className="text-sm">{job.company.name}</span>
          </div>
        )}
        
        {job.location && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">{job.location}</span>
          </div>
        )}
        
        {job.salary && (
          <div className="flex items-center gap-2 text-gray-600">
            <IndianRupee size={16} />
            <span className="text-sm font-medium">{job.salary.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <Link 
          href={`/job/${job.id}`}
          className="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          View Job
        </Link>
        {job.company && (
          <Link 
            href={`/company/${job.company.id}`}
            className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Company
          </Link>
        )}
      </div>
    </div>
  );
}
