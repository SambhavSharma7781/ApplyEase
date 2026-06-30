'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JobWithCompany } from '@/types/index';
import { MapPin, Building2, ArrowRight } from 'lucide-react';
import SaveJobBtn from '../save-job-btn';
import CompanyLogo from '../company-logo';
import JobMetaBadges from '../job-meta-badges';

interface JobCardProps {
  item: JobWithCompany;
}

export default function JobCard({ item }: JobCardProps) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/job/${item.id}`)}
      className="group relative flex h-full cursor-pointer flex-col rounded-2xl border border-transparent bg-white p-5 shadow-lg shadow-gray-200/40 transition-all duration-300 will-change-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 sm:p-5"
    >
      {/* Header: company + save */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyLogo name={item.company.name} size="md" />
          <div className="min-w-0">
            <Link
              href={`/company/${item.company.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block truncate font-semibold text-gray-900 transition-colors duration-150 hover:text-blue-600"
            >
              {item.company.name}
            </Link>
            {item.company.address && (
              <div className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{item.company.address}</span>
              </div>
            )}
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <SaveJobBtn job={item} />
        </div>
      </div>

      {/* Title */}
      <Link href={`/job/${item.id}`} onClick={(e) => e.stopPropagation()} className="mb-2 block mt-1">
        <h3 className="line-clamp-2 text-[1.1rem] font-bold leading-snug text-gray-900 transition-colors duration-150 group-hover:text-indigo-600">
          {item.title}
        </h3>
      </Link>

      {/* Meta badges */}
      <JobMetaBadges
        employmentType={item.employment_Type}
        jobType={item.job_type}
        salary={item.salary}
        className="mb-4"
      />

      {/* Description */}
      <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500">
        {item.description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-gray-100 pt-3.5 mt-auto" onClick={(e) => e.stopPropagation()}>
        <Link
          href={`/job/${item.id}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2.5 text-[13px] font-semibold text-indigo-700 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-500/25 active:scale-[0.97]"
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href={`/company/${item.company.id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2.5 text-[13px] font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.97]"
        >
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">Company</span>
        </Link>
      </div>
    </div>
  );
}
