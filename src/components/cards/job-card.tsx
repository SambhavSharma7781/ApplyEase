"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { JobWithCompany } from "@/types/index";
import { formatSalary } from "@/lib/format";
import SaveJobBtn from "../save-job-btn";
import CompanyLogo from "../company-logo";
import JobMetaBadges from "../job-meta-badges";

interface JobCardProps {
  item: JobWithCompany;
  className?: string;
}

export default function JobCard({ item, className }: JobCardProps) {
  const router = useRouter();
  const salaryLabel = formatSalary(item.salary);

  return (
    <div
      onClick={() => router.push(`/job/${item.id}`)}
      className={cn(
        "group relative flex flex-col h-full cursor-pointer",
        "rounded-[14px] border border-[#E4E4E7] bg-white p-5",
        "transition-all duration-200 ease-out",
        "hover:border-[#C4B5FD] hover:-translate-y-1",
        className
      )}
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 20px 48px rgba(79,70,229,0.08), 0 4px 8px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)";
      }}
    >
      {/* ── Company header — light, supporting context ── */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <CompanyLogo name={item.company.name} size="sm" />
          <div className="min-w-0">
            <Link
              href={`/company/${item.company.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block truncate text-[12px] font-medium text-[#71717A] hover:text-[#4F46E5] transition-colors duration-150"
            >
              {item.company.name}
            </Link>
            {item.company.address && (
              <div className="flex items-center gap-1 text-[12px] text-[#A1A1AA] mt-0.5">
                <MapPin className="h-2.5 w-2.5 shrink-0" />
                <span className="truncate">{item.company.address}</span>
              </div>
            )}
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          <SaveJobBtn job={item} />
        </div>
      </div>

      {/* ── Job title — dominant, most scannable ── */}
      <Link
        href={`/job/${item.id}`}
        onClick={(e) => e.stopPropagation()}
        className="mb-3 block"
      >
        <h3 className="text-[17px] font-bold leading-snug tracking-[-0.02em] text-[#09090B] group-hover:text-[#4F46E5] transition-colors duration-150 line-clamp-2">
          {item.title}
        </h3>
      </Link>

      {/* ── Salary — standalone, visually prominent ── */}
      {salaryLabel && (
        <div className="mb-3">
          <span className="inline-flex items-center rounded-[6px] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 text-[13px] font-semibold text-[#15803D]">
            {salaryLabel}
          </span>
        </div>
      )}

      {/* ── Work type / employment badges — secondary info ── */}
      <JobMetaBadges
        employmentType={item.employment_Type}
        jobType={item.job_type}
        className="mb-3"
      />

      {/* ── Description — tertiary, contextual ── */}
      <p className="mb-4 flex-1 line-clamp-2 text-[13px] leading-relaxed text-[#71717A]">
        {item.description}
      </p>

      {/* ── Footer CTA — intentional, button-like ── */}
      <div
        className="flex items-center justify-end border-t border-[#F0F0F0] pt-3.5 mt-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          href={`/job/${item.id}`}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E4E4E7] bg-[#F7F7F8] px-3.5 py-1.5 text-[13px] font-medium text-[#52525B] hover:border-[#4F46E5] hover:bg-[#EEF2FF] hover:text-[#4F46E5] group-hover:border-[#4F46E5] group-hover:bg-[#EEF2FF] group-hover:text-[#4F46E5] transition-all duration-150 active:scale-[0.97]"
        >
          View details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
