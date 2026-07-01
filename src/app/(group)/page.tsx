import Link from "next/link";
import { Plus, Briefcase, ChevronRight } from "lucide-react";
import prismaClient from "@/services/prisma";
import { getUserFromCookies } from "@/helper";
import { Container } from "@/components/ui/container";
import JobCard from "@/components/cards/job-card";
import EmptyState from "@/components/empty-state";
import CompanyLogo from "@/components/company-logo";
import HeroSearch from "@/components/hero-search";

export const dynamic = "force-dynamic";

const FALLBACK_FILTERS = [
  "Full-time",
  "Part-time",
  "Remote",
  "On-site",
  "Hybrid",
  "Contract",
];

export default async function Home() {
  const user = await getUserFromCookies();

  try {
    const [totalJobsCount, companyCount, jobs, allJobTypeData] =
      await Promise.all([
        prismaClient.openings.count(),
        prismaClient.company.count({ where: { jobs: { some: {} } } }),
        prismaClient.openings.findMany({
          take: 6,
          orderBy: { id: "desc" },
          include: {
            company: { select: { id: true, name: true, description: true } },
          },
        }),
        // Full scan for accurate counts — lightweight (two strings per row)
        prismaClient.openings.findMany({
          select: { employment_Type: true, job_type: true },
        }),
      ]);

    // Build accurate count map from entire dataset
    const typeCountMap = new Map<string, number>();
    allJobTypeData.forEach((j) => {
      if (j.employment_Type) {
        typeCountMap.set(
          j.employment_Type,
          (typeCountMap.get(j.employment_Type) ?? 0) + 1
        );
      }
      if (j.job_type) {
        typeCountMap.set(
          j.job_type,
          (typeCountMap.get(j.job_type) ?? 0) + 1
        );
      }
    });

    // Derive filter chips from real DB — sorted by frequency descending
    const dbTypes = Array.from(typeCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type)
      .slice(0, 8);
    const filterChips = dbTypes.length >= 2 ? dbTypes : FALLBACK_FILTERS;

    // Normalize jobs for JobCard (address = location)
    const formattedJobs = jobs.map((job) => ({
      ...job,
      company: { id: job.company.id, name: job.company.name, address: job.location },
    }));

    // Companies — include description for richer cards
    const companiesMap = new Map(
      jobs.map((j) => [
        j.company.id,
        {
          id: j.company.id,
          name: j.company.name,
          description: j.company.description,
        },
      ])
    );
    const featuredCompanies = Array.from(companiesMap.values());
    const showFeaturedCompanies = featuredCompanies.length >= 3;

    return (
      <>
        {/* ════════════════════════════════════════
            HERO — ~60vh, search as visual center
        ════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white min-h-[60vh] flex flex-col">
          {/* Dot grid — pure CSS */}
          <div
            className="absolute inset-0 opacity-[0.45] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #D4D4D8 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {/* Soft indigo tint — top only */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(238,242,255,0.70), transparent)",
            }}
          />

          <Container className="relative z-10 flex-1 flex items-center justify-center">
            <div className="w-full max-w-[560px] mx-auto text-center py-16">
              {/* Live badge */}
              {totalJobsCount > 0 && (
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E0E7FF] bg-[#EEF2FF] px-4 py-1.5 text-[13px] font-medium text-[#4F46E5] mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F46E5] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4F46E5]" />
                  </span>
                  {totalJobsCount.toLocaleString()} open{" "}
                  {totalJobsCount === 1 ? "role" : "roles"} available
                </div>
              )}

              {/* Headline */}
              <h1 className="mb-3 text-[44px] font-bold leading-[1.1] tracking-[-0.025em] text-[#09090B]">
                Find your next role.
              </h1>
              <p className="mb-8 text-[17px] leading-relaxed text-[#71717A]">
                Discover opportunities from teams building the future.
              </p>

              {/* Unified search control */}
              <div className="mb-4">
                <HeroSearch />
              </div>

              {/* Quick-filter chips */}
              {filterChips.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5">
                  <span className="text-[12px] text-[#C0C0C8] self-center mr-0.5">
                    Try:
                  </span>
                  {filterChips.slice(0, 6).map((chip) => (
                    <Link
                      key={chip}
                      href={`/search?q=${encodeURIComponent(chip)}`}
                      className="rounded-full border border-[#E4E4E7] bg-white px-3 py-1 text-[12px] text-[#71717A] hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#EEF2FF] transition-all duration-150 active:scale-[0.97]"
                    >
                      {chip}
                    </Link>
                  ))}
                </div>
              )}

              {/* Trust indicators */}
              {totalJobsCount > 0 && companyCount > 0 && (
                <p className="mt-5 text-[12px] text-[#C0C0C8]">
                  {totalJobsCount.toLocaleString()} open{" "}
                  {totalJobsCount === 1 ? "role" : "roles"}
                  <span className="mx-2">·</span>
                  {companyCount.toLocaleString()}{" "}
                  {companyCount === 1 ? "company" : "companies"} hiring
                </p>
              )}

              {/* Employer CTA */}
              {user?.role === "employer" && (
                <div className="mt-5">
                  <Link
                    href="/addJob"
                    className="inline-flex items-center gap-2 rounded-[10px] bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors duration-150 active:scale-[0.97]"
                  >
                    <Plus size={16} />
                    Post a Job
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* ════════════════════════════════════════
            LATEST OPPORTUNITIES
        ════════════════════════════════════════ */}
        <section className="py-12 lg:py-16 bg-[#F7F7F8] border-t border-[#E4E4E7]">
          <Container>
            {formattedJobs.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-7">
                  <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-[#09090B]">
                    Latest opportunities
                  </h2>
                  <Link
                    href="/search"
                    className="flex items-center gap-0.5 text-[13px] font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors duration-150"
                  >
                    Browse all
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {formattedJobs.map((job, idx) => (
                    <div
                      key={job.id}
                      className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both"
                      style={{
                        animationDelay: `${idx * 55}ms`,
                        animationDuration: "380ms",
                      }}
                    >
                      <JobCard item={job} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                icon={<Briefcase size={32} />}
                title="No Jobs Available"
                description="We're currently updating our job listings. Check back soon for new opportunities."
                {...(user?.role === "employer"
                  ? { actionText: "Post a Job", actionHref: "/addJob" }
                  : {})}
              />
            )}
          </Container>
        </section>

        {/* ════════════════════════════════════════
            COMPANIES ACTIVELY HIRING
            Only shown when >= 3 distinct companies.
            Enriched with description for real value.
        ════════════════════════════════════════ */}
        {showFeaturedCompanies && (
          <section className="py-12 lg:py-16 bg-white border-t border-[#E4E4E7]">
            <Container>
              <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-[#09090B] mb-7">
                Companies actively hiring
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredCompanies.map((company) => {
                  const openRoles = jobs.filter(
                    (j) => j.company.id === company.id
                  ).length;
                  return (
                    <Link
                      key={company.id}
                      href={`/company/${company.id}`}
                      className="group flex flex-col rounded-[14px] border border-[#E4E4E7] bg-white p-5 hover:border-[#C7C7CC] hover:-translate-y-0.5 transition-all duration-200"
                      style={{
                        boxShadow:
                          "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                      }}
                    >
                      {/* Header row */}
                      <div className="flex items-center justify-between mb-3">
                        <CompanyLogo name={company.name} size="md" />
                        <span className="text-[12px] font-medium text-[#A1A1AA] bg-[#F7F7F8] border border-[#E4E4E7] rounded-full px-2.5 py-1">
                          {openRoles} open {openRoles === 1 ? "role" : "roles"}
                        </span>
                      </div>
                      {/* Company name */}
                      <p className="text-[14px] font-semibold text-[#09090B] group-hover:text-[#4F46E5] transition-colors duration-150 mb-1">
                        {company.name}
                      </p>
                      {/* Description — real data, truncated */}
                      {company.description && (
                        <p className="text-[12px] text-[#A1A1AA] leading-relaxed line-clamp-2 flex-1 mb-3">
                          {company.description}
                        </p>
                      )}
                      {/* CTA */}
                      <div className="flex items-center gap-1 text-[12px] font-medium text-[#4F46E5] mt-auto">
                        View company
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Container>
          </section>
        )}

        {/* ════════════════════════════════════════
            BROWSE BY WORK TYPE
            Chips show accurate job counts from DB.
        ════════════════════════════════════════ */}
        {filterChips.length > 0 && (
          <section className="py-12 lg:py-16 bg-[#F7F7F8] border-t border-[#E4E4E7]">
            <Container>
              <div className="mb-7">
                <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-[#09090B]">
                  Browse by work type
                </h2>
                <p className="mt-1 text-[13px] text-[#A1A1AA]">
                  Filter opportunities by the arrangement that works for you.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {filterChips.map((chip) => {
                  const count = typeCountMap.get(chip);
                  return (
                    <Link
                      key={chip}
                      href={`/search?q=${encodeURIComponent(chip)}`}
                      className="group inline-flex items-center gap-2 rounded-[10px] border border-[#E4E4E7] bg-white px-4 py-2.5 text-[13px] font-medium text-[#52525B] hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#EEF2FF] transition-all duration-150 active:scale-[0.97]"
                      style={{
                        boxShadow:
                          "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
                      }}
                    >
                      {chip}
                      {count !== undefined && (
                        <span className="text-[11px] font-normal text-[#A1A1AA] group-hover:text-[#4F46E5] transition-colors duration-150">
                          ({count})
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </Container>
          </section>
        )}
      </>
    );
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return (
      <section className="bg-white min-h-[50vh] flex items-center">
        <Container className="text-center py-20">
          <h1 className="mb-3 text-[36px] font-bold tracking-[-0.02em] text-[#09090B]">
            Find your next role.
          </h1>
          <p className="text-[#71717A]">
            We&apos;re loading job opportunities. Please refresh the page.
          </p>
        </Container>
      </section>
    );
  }
}
