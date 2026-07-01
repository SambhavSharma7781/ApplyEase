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

type CompanyForRow = {
  id: string;
  name: string;
  description: string | null;
  _count: { jobs: number };
  jobs: { title: string }[];
};

function CompanyDirectoryRow({ company }: { company: CompanyForRow }) {
  return (
    <Link
      href={`/company/${company.id}`}
      className="group flex items-start gap-4 p-5 hover:bg-white/70 transition-colors duration-150 cursor-pointer"
    >
      <CompanyLogo name={company.name} size="md" className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-[#09090B] group-hover:text-[#4F46E5] transition-colors duration-150 leading-snug truncate">
              {company.name}
            </p>
          </div>
          <span className="shrink-0 flex items-center gap-0.5 text-[13px] font-medium text-[#4F46E5] whitespace-nowrap">
            {company._count.jobs} open {company._count.jobs === 1 ? "role" : "roles"}
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
        {company.description && (
          <p className="mt-0.5 text-[12px] text-[#A1A1AA] line-clamp-1 leading-relaxed">
            {company.description}
          </p>
        )}
        {company.jobs.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {company.jobs.map((job, i) => (
              <span
                key={i}
                className="inline-flex text-[11px] text-[#52525B] bg-[#F4F4F5] border border-[#E4E4E7] rounded-full px-2.5 py-0.5 leading-relaxed"
              >
                {job.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default async function Home() {
  const user = await getUserFromCookies();

  try {
    const [totalJobsCount, companyCount, jobs, allJobTypeData, topCompaniesRaw] =
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
        prismaClient.openings.findMany({
          select: { employment_Type: true, job_type: true },
        }),
        prismaClient.company.findMany({
          where: { jobs: { some: {} } },
          select: {
            id: true,
            name: true,
            description: true,
            _count: { select: { jobs: true } },
            jobs: {
              select: { title: true },
              take: 3,
              orderBy: { id: "desc" },
            },
          },
        }),
      ]);

    // ── Filter type maps — split for correct routing ──
    const jtCountMap = new Map<string, number>(); // job_type: Remote, On-site, Hybrid
    const etCountMap = new Map<string, number>(); // employment_Type: Full-time, Part-time, Contract
    allJobTypeData.forEach((j) => {
      if (j.job_type)
        jtCountMap.set(j.job_type, (jtCountMap.get(j.job_type) ?? 0) + 1);
      if (j.employment_Type)
        etCountMap.set(
          j.employment_Type,
          (etCountMap.get(j.employment_Type) ?? 0) + 1
        );
    });

    // Hero quick-filter chips: top 6 combined, sorted by frequency
    type FilterChip = { type: string; count: number; param: "jt" | "et" };
    const heroFilterChips: FilterChip[] = [
      ...Array.from(jtCountMap.entries()).map(
        ([type, count]): FilterChip => ({ type, count, param: "jt" })
      ),
      ...Array.from(etCountMap.entries()).map(
        ([type, count]): FilterChip => ({ type, count, param: "et" })
      ),
    ]
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Browse section: separate chip arrays per group
    const jtChips = Array.from(jtCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));
    const etChips = Array.from(etCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));
    const showBrowseSection = jtChips.length > 0 || etChips.length > 0;

    // Normalize jobs for JobCard
    const formattedJobs = jobs.map((job) => ({
      ...job,
      company: { id: job.company.id, name: job.company.name, address: job.location },
    }));

    // Featured companies: sorted by job count (most active first)
    const featuredCompanies = topCompaniesRaw
      .sort((a, b) => b._count.jobs - a._count.jobs)
      .slice(0, 6);
    const showFeaturedCompanies = featuredCompanies.length >= 2;
    const leftColumn = featuredCompanies.filter((_, i) => i % 2 === 0);
    const rightColumn = featuredCompanies.filter((_, i) => i % 2 !== 0);

    return (
      <>
        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white min-h-[60vh] flex flex-col">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.45] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #D4D4D8 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {/* Soft indigo tint */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(238,242,255,0.70), transparent)",
            }}
          />
          {/* Gradient fade into jobs section */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #F7F7F8)" }}
          />

          <Container className="relative z-10 flex-1 flex items-center justify-center">
            <div className="w-full max-w-[560px] mx-auto text-center pt-16 pb-20 sm:pt-20 sm:pb-24">

              {/* Live badge — job count + company count as trust signal */}
              {totalJobsCount > 0 && (
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E0E7FF] bg-[#EEF2FF] px-4 py-1.5 text-[13px] font-medium text-[#4F46E5] mb-5">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F46E5] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4F46E5]" />
                  </span>
                  {totalJobsCount.toLocaleString()} open{" "}
                  {totalJobsCount === 1 ? "role" : "roles"}
                  {companyCount > 0 && (
                    <>
                      <span className="hidden sm:inline text-[#C4B5FD]">·</span>
                      <span className="hidden sm:inline">
                        {companyCount.toLocaleString()}{" "}
                        {companyCount === 1 ? "company" : "companies"} hiring
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Headline — primary message */}
              <h1 className="mb-4 text-[40px] sm:text-[52px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#09090B]">
                Find your next role.
              </h1>
              <p className="mb-10 text-[17px] leading-relaxed text-[#71717A]">
                Discover opportunities from teams building the future.
              </p>

              {/* Search */}
              <div className="mb-5">
                <HeroSearch />
              </div>

              {/* Quick-filter chips — correctly routed to jt/et params */}
              {heroFilterChips.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5">
                  <span className="text-[12px] text-[#A1A1AA] self-center mr-0.5">
                    Try:
                  </span>
                  {heroFilterChips.map((chip) => (
                    <Link
                      key={chip.type}
                      href={`/search?${chip.param}=${encodeURIComponent(chip.type)}`}
                      className="rounded-full border border-[#E4E4E7] bg-white px-3 py-1 text-[12px] text-[#71717A] hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#EEF2FF] transition-all duration-150 active:scale-[0.97]"
                    >
                      {chip.type}
                    </Link>
                  ))}
                </div>
              )}

              {/* Employer CTA */}
              {user?.role === "employer" && (
                <div className="mt-6">
                  <Link
                    href="/addJob"
                    className="inline-flex items-center gap-2 rounded-[10px] bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4338CA] transition-colors duration-150 active:scale-[0.97]"
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
        <section className="py-14 lg:py-20 bg-[#F7F7F8] border-t border-[#E4E4E7]/60">
          <Container>
            {formattedJobs.length > 0 ? (
              <>
                <div className="flex items-start justify-between mb-7">
                  <div>
                    <h2 className="text-[22px] font-semibold tracking-[-0.015em] text-[#09090B]">
                      Latest opportunities
                    </h2>
                    <p className="mt-1 text-[13px] text-[#A1A1AA]">
                      Freshly posted, updated in real time.
                    </p>
                  </div>
                  <Link
                    href="/search"
                    className="flex items-center gap-0.5 text-[13px] font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors duration-150 mt-1 shrink-0"
                  >
                    Browse all
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {formattedJobs.map((job, idx) => (
                    <div
                      key={job.id}
                      className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                      style={{
                        animationDelay: `${idx * 55}ms`,
                        animationDuration: "420ms",
                      }}
                    >
                      <JobCard item={job} />
                    </div>
                  ))}
                </div>

                {totalJobsCount > 6 && (
                  <div className="flex justify-center mt-8">
                    <Link
                      href="/search"
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-[#52525B] hover:text-[#4F46E5] transition-colors duration-150"
                    >
                      Browse all {totalJobsCount.toLocaleString()} open roles
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
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
            WHO'S HIRING
            Enclosed directory — real DB counts,
            recent job titles per company.
        ════════════════════════════════════════ */}
        {showFeaturedCompanies && (
          <section className="py-14 lg:py-20 bg-[#FAFAFE] border-t border-[#E4E4E7]/60">
            <Container>
              <div className="mb-8">
                <h2 className="text-[22px] font-semibold tracking-[-0.015em] text-[#09090B]">
                  Who&apos;s hiring
                </h2>
                <p className="mt-1 text-[13px] text-[#A1A1AA]">
                  {companyCount.toLocaleString()}{" "}
                  {companyCount === 1 ? "company" : "companies"} &middot;{" "}
                  {totalJobsCount.toLocaleString()} total{" "}
                  {totalJobsCount === 1 ? "role" : "roles"}
                </p>
              </div>

              {/* Company directory container */}
              <div className="rounded-[16px] border border-[#E4E4E7] overflow-hidden">
                {/* Mobile: single column, items in order */}
                <div className="lg:hidden divide-y divide-[#E4E4E7]">
                  {featuredCompanies.map((company) => (
                    <CompanyDirectoryRow key={company.id} company={company} />
                  ))}
                </div>
                {/* Desktop: two-column grid with interior divider */}
                <div className="hidden lg:grid lg:grid-cols-2">
                  <div className="border-r border-[#E4E4E7] divide-y divide-[#E4E4E7]">
                    {leftColumn.map((company) => (
                      <CompanyDirectoryRow key={company.id} company={company} />
                    ))}
                  </div>
                  <div className="divide-y divide-[#E4E4E7]">
                    {rightColumn.map((company) => (
                      <CompanyDirectoryRow key={company.id} company={company} />
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* ════════════════════════════════════════
            BROWSE BY WORK TYPE
            Two groups: work arrangement + contract
            type. Correct ?jt= / ?et= routing.
        ════════════════════════════════════════ */}
        {showBrowseSection && (
          <section className="py-14 lg:py-20 bg-white border-t border-[#E4E4E7]/60">
            <Container>
              <div className="mb-8">
                <h2 className="text-[22px] font-semibold tracking-[-0.015em] text-[#09090B]">
                  Browse by work type
                </h2>
                <p className="mt-1 text-[13px] text-[#A1A1AA]">
                  Find roles that match your preferred arrangement.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
                {jtChips.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#A1A1AA] mb-3">
                      Work arrangement
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {jtChips.map(({ type, count }) => (
                        <Link
                          key={type}
                          href={`/search?jt=${encodeURIComponent(type)}`}
                          className="group inline-flex items-center gap-1.5 rounded-[10px] border border-[#E4E4E7] bg-white px-4 py-2.5 text-[13px] font-medium text-[#52525B] hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#EEF2FF] hover:scale-[1.02] transition-all duration-150 active:scale-[0.97]"
                          style={{
                            boxShadow:
                              "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
                          }}
                        >
                          {type}
                          <span className="text-[10px] font-normal bg-[#F4F4F5] group-hover:bg-[#E0E7FF] border border-[#E4E4E7] group-hover:border-[#C4B5FD] text-[#A1A1AA] group-hover:text-[#4F46E5] px-1.5 py-px rounded-full transition-colors duration-150">
                            {count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {etChips.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#A1A1AA] mb-3">
                      Contract type
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {etChips.map(({ type, count }) => (
                        <Link
                          key={type}
                          href={`/search?et=${encodeURIComponent(type)}`}
                          className="group inline-flex items-center gap-1.5 rounded-[10px] border border-[#E4E4E7] bg-white px-4 py-2.5 text-[13px] font-medium text-[#52525B] hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#EEF2FF] hover:scale-[1.02] transition-all duration-150 active:scale-[0.97]"
                          style={{
                            boxShadow:
                              "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
                          }}
                        >
                          {type}
                          <span className="text-[10px] font-normal bg-[#F4F4F5] group-hover:bg-[#E0E7FF] border border-[#E4E4E7] group-hover:border-[#C4B5FD] text-[#A1A1AA] group-hover:text-[#4F46E5] px-1.5 py-px rounded-full transition-colors duration-150">
                            {count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
