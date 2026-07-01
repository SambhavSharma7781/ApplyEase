"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FilterPanelContent from "@/components/filter-panel-content";

interface MobileFilterDrawerProps {
  q: string;
  jt: string;
  et: string;
}

export default function MobileFilterDrawer({ q, jt, et }: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [jobType, setJobType] = useState(jt);
  const [employmentType, setEmploymentType] = useState(et);

  // activeCount reflects the URL state (what's actually applied)
  const activeCount = [jt, et].filter(Boolean).length;
  // hasFilters reflects the drawer's draft state (for the clear button)
  const hasFilters = jobType !== "" || employmentType !== "";

  function handleApply() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (jobType) params.set("jt", jobType);
    if (employmentType) params.set("et", employmentType);
    setOpen(false);
    router.push(`/search?${params.toString()}`);
  }

  function handleClear() {
    setJobType("");
    setEmploymentType("");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    setOpen(false);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="inline-flex items-center gap-2 rounded-[10px] border border-[#E4E4E7] bg-white px-3.5 py-2 text-[13px] font-medium text-[#52525B] transition-all duration-150 hover:border-[#C7C7CC] hover:text-[#09090B] active:scale-[0.97]"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#4F46E5] px-1.5 text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="gap-0 p-0">
        {/* Header — pr-12 leaves room for the built-in close button */}
        <SheetHeader className="border-b border-[#E4E4E7] px-5 py-[18px] pr-12">
          <SheetTitle className="flex items-center gap-2.5 text-[16px] font-bold text-[#09090B]">
            <SlidersHorizontal className="h-5 w-5 text-[#4F46E5]" />
            Filters
          </SheetTitle>
        </SheetHeader>

        {/* Filter groups */}
        <div className="flex-1 overflow-y-auto space-y-6 px-5 py-5">
          <FilterPanelContent
            jobType={jobType}
            employmentType={employmentType}
            onJobTypeChange={setJobType}
            onEmploymentTypeChange={setEmploymentType}
          />
        </div>

        {/* Footer — Apply + Clear */}
        <div className="border-t border-[#E4E4E7] px-5 py-5 flex flex-col gap-2">
          <Button
            onClick={handleApply}
            className="w-full gap-2 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Apply Filters
          </Button>
          {hasFilters && (
            <button
              onClick={handleClear}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#E4E4E7] bg-white py-2.5 text-[13px] font-medium text-[#52525B] transition-colors hover:bg-[#F7F7F8] hover:text-[#09090B]"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
