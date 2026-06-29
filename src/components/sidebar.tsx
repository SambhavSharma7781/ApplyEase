"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, Briefcase, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const jobTypes = [
  { value: "", label: "All Locations" },
  { value: "remote", label: "Remote" },
  { value: "on-site", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
];

const employmentTypes = [
  { value: "", label: "All Types" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

function RadioRow({
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
    <label className="group flex cursor-pointer items-center gap-3">
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
          "flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all",
          checked ? "border-blue-600 bg-blue-600" : "border-gray-300 group-hover:border-blue-400"
        )}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      <span
        className={cn(
          "text-sm transition-colors",
          checked ? "font-medium text-gray-900" : "text-gray-600 group-hover:text-gray-900"
        )}
      >
        {option.label}
      </span>
    </label>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [jobType, setJobType] = useState(searchParams.get("jt") || "");
  const [employmentType, setEmploymentType] = useState(searchParams.get("et") || "");

  function handleFilter() {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (jobType) params.set("jt", jobType);
    if (employmentType) params.set("et", employmentType);
    router.push(`/search?${params.toString()}`);
  }

  function clearAll() {
    setJobType("");
    setEmploymentType("");
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.push(`/search?${params.toString()}`);
  }

  const hasFilters = jobType !== "" || employmentType !== "";

  return (
    <aside className="w-full lg:sticky lg:top-20 lg:w-72">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Filters</h2>
          </div>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-blue-600"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        <div className="space-y-6 px-5 py-5">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-900">Employment Type</h3>
            </div>
            <div className="space-y-3 pl-1">
              {employmentTypes.map((type) => (
                <RadioRow
                  key={type.value}
                  name="employment-type"
                  option={type}
                  checked={employmentType === type.value}
                  onChange={setEmploymentType}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-900">Work Location</h3>
            </div>
            <div className="space-y-3 pl-1">
              {jobTypes.map((type) => (
                <RadioRow
                  key={type.value}
                  name="job-type"
                  option={type}
                  checked={jobType === type.value}
                  onChange={setJobType}
                />
              ))}
            </div>
          </div>

          <Button onClick={handleFilter} className="w-full gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </div>
    </aside>
  );
}
