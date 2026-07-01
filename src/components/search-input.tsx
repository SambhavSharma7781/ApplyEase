"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseJobSearchReturn } from "@/hooks/use-job-search";

interface SearchInputProps extends UseJobSearchReturn {
  /** "sm" — navbar compact (36px) | "lg" — hero expanded (52px) */
  size?: "sm" | "lg";
  /** Show an inset submit button (hero only) — makes input + button feel like one control */
  showButton?: boolean;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  query,
  setQuery,
  suggestions,
  open,
  setOpen,
  containerRef,
  handleSubmit,
  size = "sm",
  showButton = false,
  placeholder = "Search jobs, companies...",
  className,
}: SearchInputProps) {
  const isLg = size === "lg";

  // ── Hero: unified container with inset button ──────────────────────────
  if (isLg && showButton) {
    return (
      <div ref={containerRef} className={cn("relative w-full", className)}>
        <form onSubmit={handleSubmit}>
          {/* Single bordered container — input + button feel like one control */}
          <div
            className={cn(
              "flex items-center gap-2 rounded-[12px] bg-white pr-2",
              "border border-[#E4E4E7]",
              "hover:border-[#C7C7CC]",
              "focus-within:border-[#4F46E5] focus-within:ring-[3px] focus-within:ring-[rgba(79,70,229,0.10)]",
              "transition-all duration-150"
            )}
          >
            <Search className="ml-4 h-5 w-5 shrink-0 text-[#A1A1AA] pointer-events-none" />
            <input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setOpen(true)}
              autoComplete="off"
              aria-label="Search jobs"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls="hero-search-listbox"
              role="combobox"
              className="flex-1 h-[52px] bg-transparent border-0 pl-2 pr-1 text-[15px] text-[#09090B] placeholder-[#A1A1AA] focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 my-2 h-[40px] px-5 rounded-[8px] bg-[#4F46E5] text-[14px] font-semibold text-white hover:bg-[#4338CA] transition-colors duration-150 active:scale-[0.97]"
            >
              Search
            </button>
          </div>
        </form>

        {/* Autocomplete dropdown */}
        {open && suggestions.length > 0 && (
          <div
            className="absolute top-full mt-2 left-0 right-0 z-50 overflow-hidden rounded-[14px] border border-[#E4E4E7] bg-white"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}
            role="listbox"
            aria-label="Search suggestions"
          >
            <ul className="max-h-56 overflow-y-auto py-1.5">
              {suggestions.map((s) => (
                <li key={s.id} role="option" aria-selected={false}>
                  <Link
                    href={`/search?q=${encodeURIComponent(s.title)}`}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#52525B] hover:bg-[#F7F7F8] hover:text-[#09090B] transition-colors duration-100"
                    onClick={() => { setQuery(s.title); setOpen(false); }}
                  >
                    <Search className="h-3.5 w-3.5 shrink-0 text-[#A1A1AA]" />
                    <span className="truncate">{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // ── Navbar / compact: standalone input ────────────────────────────────
  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-[#A1A1AA]" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            autoComplete="off"
            aria-label="Search jobs"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="nav-search-listbox"
            role="combobox"
            className={cn(
              "w-full h-9 rounded-[8px] pl-9 pr-4 text-sm",
              "border border-[#E4E4E7] bg-[#F1F1F3] text-[#09090B] placeholder-[#A1A1AA]",
              "hover:border-[#D1D5DB] hover:bg-[#EBEBED]",
              "focus:bg-white focus:border-[#4F46E5] focus:outline-none",
              "focus:ring-[3px] focus:ring-[rgba(79,70,229,0.10)]",
              "transition-all duration-150"
            )}
          />
        </div>
      </form>

      {/* Autocomplete dropdown */}
      {open && suggestions.length > 0 && (
        <div
          className="absolute top-full mt-1.5 left-0 right-0 z-50 overflow-hidden rounded-[12px] border border-[#E4E4E7] bg-white"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}
          role="listbox"
          id="nav-search-listbox"
          aria-label="Search suggestions"
        >
          <ul className="max-h-56 overflow-y-auto py-1">
            {suggestions.map((s) => (
              <li key={s.id} role="option" aria-selected={false}>
                <Link
                  href={`/search?q=${encodeURIComponent(s.title)}`}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#52525B] hover:bg-[#F7F7F8] hover:text-[#09090B] transition-colors duration-100"
                  onClick={() => { setQuery(s.title); setOpen(false); }}
                >
                  <Search className="h-3.5 w-3.5 shrink-0 text-[#A1A1AA]" />
                  <span className="truncate">{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
