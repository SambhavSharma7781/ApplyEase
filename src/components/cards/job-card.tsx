import React from 'react';
import Link from 'next/link';
import { Jobs } from '@/generated/prisma';
import { MapPin, Building2 } from 'lucide-react';
import SaveJobBtn from '../save-job-btn';

// Types
interface JobCardProps {
  item: Jobs & {
    company: {
      id: string;
      name: string;
      address?: string;
    };
  };
}

export default function JobCard({ item }: JobCardProps) {
  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 p-5 sm:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="font-semibold text-gray-900 text-lg sm:text-xl leading-tight line-clamp-2 flex-1">
          {item.title}
        </h3>
        <SaveJobBtn job={item} />
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-4 flex-1">
        {item.description}
      </p>

      {/* Company Info */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium text-sm sm:text-base">
          {item.company.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <Link 
            href={`/company/${item.company.id}`}
            className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 block"
          >
            {item.company.name}
          </Link>
          {item.company.address && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-500 line-clamp-1">
                {item.company.address}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 border-t border-gray-100">
        <Link 
          href={`/job/${item.id}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm text-center transition-colors"
        >
          View Details
        </Link>
        <Link 
          href={`/company/${item.company.id}`}
          className="flex-1 sm:flex-none border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium text-sm text-center transition-colors flex items-center justify-center gap-1.5"
        >
          <Building2 size={16} />
          <span className="hidden sm:inline">Company</span>
          <span className="sm:hidden">View Company</span>
        </Link>
      </div>
    </div>
  );
}
