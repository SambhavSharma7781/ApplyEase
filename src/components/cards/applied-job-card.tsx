import Link from 'next/link';
import { CheckCircle2, MapPin, ArrowRight, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CompanyLogo from '../company-logo';
import { formatSalary } from '@/lib/format';

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
  const companyName = job.company?.name ?? 'Company';
  const salaryLabel = formatSalary(job.salary);

  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 will-change-transform hover:-translate-y-0.5 hover:border-blue-200/60 hover:shadow-md sm:p-6">
      {/* Header: company + status */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyLogo name={companyName} size="md" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">{companyName}</p>
            {job.location && (
              <div className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
            )}
          </div>
        </div>
        <Badge className="gap-1.5 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Applied
        </Badge>
      </div>

      {/* Title */}
      <Link href={`/job/${job.id}`} className="mb-2 block">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors duration-150 group-hover:text-blue-600">
          {job.title}
        </h3>
      </Link>

      {salaryLabel && (
        <p className="mb-3 text-sm font-medium text-emerald-700">{salaryLabel}</p>
      )}

      <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-600">
        {job.description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
        <Link
          href={`/job/${job.id}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.97]"
        >
          View Job
          <ArrowRight className="h-4 w-4" />
        </Link>
        {job.company && (
          <Link
            href={`/company/${job.company.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.97]"
          >
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Company</span>
          </Link>
        )}
      </div>
    </div>
  );
}
