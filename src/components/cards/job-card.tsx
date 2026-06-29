import Link from 'next/link';
import { JobWithCompany } from '@/types/index';
import { MapPin, Building2, ArrowRight } from 'lucide-react';
import SaveJobBtn from '../save-job-btn';
import CompanyLogo from '../company-logo';
import JobMetaBadges from '../job-meta-badges';

interface JobCardProps {
  item: JobWithCompany;
}

export default function JobCard({ item }: JobCardProps) {
  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md sm:p-6">
      {/* Header: company + save */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyLogo name={item.company.name} size="md" />
          <div className="min-w-0">
            <Link
              href={`/company/${item.company.id}`}
              className="block truncate font-semibold text-gray-900 transition-colors hover:text-blue-600"
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
        <SaveJobBtn job={item} />
      </div>

      {/* Title */}
      <Link href={`/job/${item.id}`} className="mb-3 block">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
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
      <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
        {item.description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
        <Link
          href={`/job/${item.id}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={`/company/${item.company.id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">Company</span>
        </Link>
      </div>
    </div>
  );
}
