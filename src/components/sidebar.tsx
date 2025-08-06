//@ts-nocheck
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Filter, Briefcase, Clock } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const jt = searchParams.get("jt") || "";
  const et = searchParams.get("et") || "";

  const [jobType, setJobType] = useState(jt || "");
  const [employmentType, setEmploymentType] = useState(et || "");

  function handleFilter() {
    const url = `/search?q=${query}&jt=${jobType}&et=${employmentType}`;
    router.push(url);
  }

  const jobTypes = [
    { value: "", label: "All Locations" },
    { value: "remote", label: "Remote" },
    { value: "on-site", label: "On-site" },
    { value: "hybrid", label: "Hybrid" }
  ];

  const employmentTypes = [
    { value: "", label: "All Types" },
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" }
  ];

  return (
    <aside className="w-full lg:w-72 space-y-6">
      {/* Filter Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Filter size={16} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      {/* Employment Type Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Employment Type</h3>
        </div>
        <div className="space-y-3">
          {employmentTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name="employment-type"
                  value={type.value}
                  checked={employmentType === type.value}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                  employmentType === type.value
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300 group-hover:border-blue-400"
                }`}>
                  {employmentType === type.value && (
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>
              <span className={`text-sm transition-colors ${
                employmentType === type.value ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"
              }`}>
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Job Type Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase size={18} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Work Location</h3>
        </div>
        <div className="space-y-3">
          {jobTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name="job-type"
                  value={type.value}
                  checked={jobType === type.value}
                  onChange={(e) => setJobType(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                  jobType === type.value
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300 group-hover:border-blue-400"
                }`}>
                  {jobType === type.value && (
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>
              <span className={`text-sm transition-colors ${
                jobType === type.value ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"
              }`}>
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={handleFilter}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Filter size={16} />
        Apply Filters
      </button>

      {/* Clear Filters */}
      {(jobType !== "" || employmentType !== "") && (
        <button
          onClick={() => {
            setJobType("");
            setEmploymentType("");
            const url = `/search?q=${query}`;
            router.push(url);
          }}
          className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium py-2 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}