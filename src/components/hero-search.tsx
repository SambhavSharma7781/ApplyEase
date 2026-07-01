"use client";

import { useJobSearch } from "@/hooks/use-job-search";
import SearchInput from "@/components/search-input";

/**
 * Hero search — expanded (52px), with a submit button.
 * Thin wrapper: no logic, only visual configuration.
 */
export default function HeroSearch() {
  const search = useJobSearch();
  return (
    <SearchInput
      {...search}
      size="lg"
      showButton
      placeholder="Job title, company, or keyword..."
    />
  );
}
