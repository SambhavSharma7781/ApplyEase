"use client";

import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const jobTypes = [
  { value: "", label: "All Locations" },
  { value: "remote", label: "Remote" },
  { value: "on-site", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
];

export const employmentTypes = [
  { value: "", label: "All Types" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

export function RadioRow({
  name,
  option,
  checked,
  onChange,
}: {
  name: string;
  option: { value: string; label: string };
  checked: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-100 hover:bg-indigo-50/50">
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 shrink-0",
          checked
            ? "border-[#4F46E5] bg-[#4F46E5]"
            : "border-[#D4D4D8] group-hover:border-[#A5B4FC]"
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
      <span
        className={cn(
          "text-sm transition-colors",
          checked
            ? "font-medium text-[#09090B]"
            : "text-[#52525B] group-hover:text-[#09090B]"
        )}
      >
        {option.label}
      </span>
    </label>
  );
}

interface FilterPanelContentProps {
  jobType: string;
  employmentType: string;
  onJobTypeChange: (v: string) => void;
  onEmploymentTypeChange: (v: string) => void;
}

/** Shared filter group UI — used by both Sidebar and MobileFilterDrawer. */
export default function FilterPanelContent({
  jobType,
  employmentType,
  onJobTypeChange,
  onEmploymentTypeChange,
}: FilterPanelContentProps) {
  return (
    <>
      {/* Employment Type */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#A1A1AA]" />
          <h3 className="text-sm font-medium text-[#09090B]">Employment Type</h3>
        </div>
        <div className="space-y-1 pl-1">
          {employmentTypes.map((type) => (
            <RadioRow
              key={type.value}
              name="employment-type"
              option={type}
              checked={employmentType === type.value}
              onChange={onEmploymentTypeChange}
            />
          ))}
        </div>
      </div>

      {/* Work Location */}
      <div className="border-t border-[#E4E4E7] pt-5">
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#A1A1AA]" />
          <h3 className="text-sm font-medium text-[#09090B]">Work Location</h3>
        </div>
        <div className="space-y-1 pl-1">
          {jobTypes.map((type) => (
            <RadioRow
              key={type.value}
              name="job-type"
              option={type}
              checked={jobType === type.value}
              onChange={onJobTypeChange}
            />
          ))}
        </div>
      </div>
    </>
  );
}
