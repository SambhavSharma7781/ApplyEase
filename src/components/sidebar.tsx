"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterPanelContent from "@/components/filter-panel-content";

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [jobType, setJobType] = useState(searchParams.get("jt") || "");
  const [employmentType, setEmploymentType] = useState(
    searchParams.get("et") || ""
  );

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
    <aside className="lg:sticky lg:top-24">
      <div
        className="rounded-[14px] border border-[#E4E4E7] bg-white"
        style={{
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E4E4E7] px-5 py-5">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-[#4F46E5]" />
            <h2 className="text-[16px] font-bold text-[#09090B]">Filters</h2>
          </div>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-full bg-[#F7F7F8] px-3 py-1.5 text-xs font-semibold text-[#71717A] transition-colors hover:bg-[#EEF2FF] hover:text-[#4F46E5]"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Filter groups */}
        <div className="space-y-6 px-5 py-5">
          <FilterPanelContent
            jobType={jobType}
            employmentType={employmentType}
            onJobTypeChange={setJobType}
            onEmploymentTypeChange={setEmploymentType}
          />

          <Button
            onClick={handleFilter}
            className="w-full gap-2 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] hover:-translate-y-0.5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </div>
    </aside>
  );
}
