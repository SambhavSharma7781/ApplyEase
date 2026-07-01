import JobCard from "@/components/cards/job-card";
import EmptyState from "@/components/empty-state";
import InPageSearch from "@/components/in-page-search";
import MobileFilterDrawer from "@/components/mobile-filter-drawer";
import Link from "next/link";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import prismaClient from "@/services/prisma";

export const dynamic = 'force-dynamic';

function capitalize(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildPageHref(q: string, jt: string, et: string, page: number): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (jt) params.set("jt", jt);
  if (et) params.set("et", et);
  params.set("p", page.toString());
  return `/search?${params.toString()}`;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; jt?: string; et?: string; p?: string }>;
}) {
  const params = await searchParams;
  const { q = "", jt = "", et = "", p = "1" } = params;

  const page = parseInt(p) || 1;
  const pageSize = 12;
  const skip = (page - 1) * pageSize;
  let totalJobs = 0;

  let jobs: Array<{
    id: string; title: string; description: string; location: string;
    salary: number; job_type: string; employment_Type: string;
    companyId: string;
    company: { id: string; name: string; address?: string };
  }> = [];

  try {
    const where = {
      ...(q && {
        OR: [
          { title: { contains: q, mode: 'insensitive' as const } },
          { description: { contains: q, mode: 'insensitive' as const } },
          { location: { contains: q, mode: 'insensitive' as const } },
        ],
      }),
      ...(jt && { job_type: jt }),
      ...(et && { employment_Type: et }),
    };

    const [rawJobs, count] = await Promise.all([
      prismaClient.openings.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, description: true } },
        },
        skip,
        take: pageSize,
      }),
      prismaClient.openings.count({ where }),
    ]);

    totalJobs = count;
    jobs = rawJobs.map((job) => ({
      ...job,
      company: { id: job.company.id, name: job.company.name, address: job.location },
    }));
  } catch (error) {
    console.error('Error searching jobs:', error);
  }

  const hasFilters = !!(jt || et);
  const totalPages = Math.ceil(totalJobs / pageSize);

  // URLs for individual chip removal
  const removeJt = new URLSearchParams();
  if (q) removeJt.set("q", q);
  if (et) removeJt.set("et", et);
  const removeJtHref = `/search?${removeJt.toString()}`;

  const removeEt = new URLSearchParams();
  if (q) removeEt.set("q", q);
  if (jt) removeEt.set("jt", jt);
  const removeEtHref = `/search?${removeEt.toString()}`;

  const clearFiltersHref = q ? `/search?q=${encodeURIComponent(q)}` : '/search';

  return (
    <div className="flex flex-col gap-8">

      {/* ── Search section ── */}
      <div className="flex flex-col gap-3">

        {/* Section identity — eyebrow label + supporting context */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A1A1AA]">
            {q ? 'Refine Results' : 'Explore Jobs'}
          </p>
          <p className="mt-0.5 text-[13px] text-[#71717A]">
            {q
              ? `${totalJobs} ${totalJobs === 1 ? 'role' : 'roles'} matching "${q}"`
              : `${totalJobs} open ${totalJobs === 1 ? 'role' : 'roles'} from companies actively hiring`
            }
          </p>
        </div>

        {/* In-page search bar — key forces remount when query changes */}
        <InPageSearch key={q} initialQuery={q} jt={jt} et={et} />

        {/* Active filter chips — anchored directly below search bar */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {jt && (
              <Link
                href={removeJtHref}
                aria-label="Remove Work Location filter"
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[13px] font-medium text-violet-700 transition-colors duration-150 hover:bg-violet-100"
              >
                Work Location: {capitalize(jt)}
                <X className="h-3 w-3 shrink-0" />
              </Link>
            )}
            {et && (
              <Link
                href={removeEtHref}
                aria-label="Remove Employment Type filter"
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[13px] font-medium text-blue-700 transition-colors duration-150 hover:bg-blue-100"
              >
                {et}
                <X className="h-3 w-3 shrink-0" />
              </Link>
            )}
            <Link
              href={clearFiltersHref}
              className="text-[13px] font-medium text-[#71717A] transition-colors duration-150 hover:text-[#4F46E5]"
            >
              Clear all
            </Link>
          </div>
        )}
      </div>

      {/* ── Results section ── */}
      <div className="flex flex-col gap-5">

        {/* Results header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[#09090B]">
            {q ? `"${q}"` : 'All Opportunities'}
          </h1>
          {/* Mobile filter trigger — hidden on desktop */}
          <div className="shrink-0 lg:hidden">
            <MobileFilterDrawer q={q} jt={jt} et={et} />
          </div>
        </div>

        {/* Results grid or empty state */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job, idx) => (
              <div
                key={job.id}
                className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                style={{ animationDelay: `${idx * 50}ms`, animationDuration: '400ms' }}
              >
                <JobCard item={job} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Search size={32} />}
            title="No jobs found"
            description={
              q && hasFilters
                ? `No results for "${q}" with the selected filters. Try different keywords or remove a filter.`
                : q
                ? `No results for "${q}". Try different keywords or browse all jobs.`
                : hasFilters
                ? 'No jobs match the selected filters. Try adjusting or clearing them.'
                : 'There are no job listings yet. Check back soon.'
            }
            actionText={hasFilters ? 'Clear filters' : 'Browse all jobs'}
            actionHref={hasFilters ? clearFiltersHref : '/search'}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-2 mb-4 flex flex-col items-center gap-3">
            <p className="text-[12px] text-[#A1A1AA]">
              Showing {skip + 1}–{Math.min(skip + pageSize, totalJobs)} of {totalJobs} jobs
            </p>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={buildPageHref(q, jt, et, page - 1)}
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E4E4E7] bg-white px-4 py-2 text-[13px] font-medium text-[#52525B] transition-all hover:border-[#C7C7CC] hover:bg-[#F7F7F8] active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              ) : (
                <button
                  disabled
                  aria-disabled="true"
                  tabIndex={-1}
                  className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-[8px] border border-[#E4E4E7] bg-[#F7F7F8] px-4 py-2 text-[13px] font-medium text-[#A1A1AA] opacity-60"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
              )}

              <span className="px-3 text-[13px] font-medium text-[#52525B]">
                {page} / {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={buildPageHref(q, jt, et, page + 1)}
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E4E4E7] bg-white px-4 py-2 text-[13px] font-medium text-[#52525B] transition-all hover:border-[#C7C7CC] hover:bg-[#F7F7F8] active:scale-95"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  disabled
                  aria-disabled="true"
                  tabIndex={-1}
                  className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-[8px] border border-[#E4E4E7] bg-[#F7F7F8] px-4 py-2 text-[13px] font-medium text-[#A1A1AA] opacity-60"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
