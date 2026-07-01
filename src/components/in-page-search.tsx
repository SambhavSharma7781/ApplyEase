"use client";

import { useRouter } from "next/navigation";
import { useJobSearch } from "@/hooks/use-job-search";
import SearchInput from "@/components/search-input";

interface InPageSearchProps {
  initialQuery: string;
  jt: string;
  et: string;
}

/**
 * In-page search refinement bar — pre-populated with the current query,
 * preserves active filters (jt/et) when submitting or selecting suggestions.
 *
 * Follows the same thin-wrapper pattern as HeroSearch and NavbarSearch.
 */
export default function InPageSearch({ initialQuery, jt, et }: InPageSearchProps) {
  const router = useRouter();

  const search = useJobSearch({
    initialQuery,
    onSubmit: (q) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (jt) params.set("jt", jt);
      if (et) params.set("et", et);
      router.push(`/search?${params.toString()}`);
    },
  });

  return (
    <SearchInput
      {...search}
      size="md"
      showClear
      placeholder="Refine your search..."
      getSuggestionHref={(title) => {
        const params = new URLSearchParams();
        params.set("q", title);
        if (jt) params.set("jt", jt);
        if (et) params.set("et", et);
        return `/search?${params.toString()}`;
      }}
    />
  );
}
