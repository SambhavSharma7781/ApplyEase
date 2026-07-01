"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export interface JobSuggestion {
  id: string;
  title: string;
}

export interface UseJobSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  suggestions: JobSuggestion[];
  open: boolean;
  setOpen: (open: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleSubmit: (e: React.FormEvent) => void;
}

export interface UseJobSearchOptions {
  /** Pre-populate the search input on mount. */
  initialQuery?: string;
  /** Override the default navigation to /search?q=... on submit. */
  onSubmit?: (query: string) => void;
}

/**
 * Shared search logic — single source of truth for job search behavior.
 *
 * Used by NavbarSearch (compact), HeroSearch (expanded), and InPageSearch.
 * Handles: query state, debounced suggestion fetch, click-outside,
 * and form submission navigation.
 *
 * Options are optional — existing callers with no arguments are unaffected.
 */
export function useJobSearch(options?: UseJobSearchOptions): UseJobSearchReturn {
  const [query, setQuery] = useState(options?.initialQuery ?? "");
  const [suggestions, setSuggestions] = useState<JobSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Debounced suggestion fetch — 300ms after user stops typing
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggestion?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        if (data.success && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
          setOpen(true);
        } else {
          setSuggestions([]);
          setOpen(false);
        }
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      if (options?.onSubmit) {
        options.onSubmit(query.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  }

  return {
    query,
    setQuery,
    suggestions,
    open,
    setOpen,
    containerRef,
    handleSubmit,
  };
}
