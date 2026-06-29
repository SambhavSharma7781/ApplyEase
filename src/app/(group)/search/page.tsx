import JobCard from "@/components/cards/job-card";
import EmptyState from "@/components/empty-state";
import Link from "next/link";
import { Search, X } from "lucide-react";
import prismaClient from "@/services/prisma";

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; jt?: string; et?: string }> }) {
    const { q = "", jt = "", et = "" } = await searchParams;

    let jobs: Array<{
        id: string; title: string; description: string; location: string;
        salary: number; job_type: string; employment_Type: string;
        companyId: string;
        company: { id: string; name: string; address?: string };
    }> = [];

    try {
        const rawJobs = await prismaClient.openings.findMany({
            where: {
                ...(q && {
                    OR: [
                        { title: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } },
                        { location: { contains: q, mode: 'insensitive' } }
                    ]
                }),
                ...(jt && { job_type: jt }),
                ...(et && { employment_Type: et })
            },
            include: {
                company: { select: { id: true, name: true, description: true } }
            }
        });
        jobs = rawJobs.map(job => ({
            ...job,
            company: { id: job.company.id, name: job.company.name, address: job.location }
        }));
    } catch (error) {
        console.error('Error searching jobs:', error);
    }

    const hasFilters = jt || et;
    const clearFiltersHref = q ? `/search?q=${encodeURIComponent(q)}` : '/search';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            {q ? `Results for "${q}"` : 'All Jobs'}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {jobs.length > 0
                                ? `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found`
                                : 'No jobs found'}
                        </p>
                    </div>

                    {/* Active filter chips */}
                    {hasFilters && (
                        <div className="flex flex-wrap items-center gap-2">
                            {jt && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                                    Location: {jt}
                                </span>
                            )}
                            {et && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                    Type: {et}
                                </span>
                            )}
                            <Link
                                href={clearFiltersHref}
                                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-blue-600"
                            >
                                <X size={12} />
                                Clear filters
                            </Link>
                        </div>
                    )}
                </div>

                {jobs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard key={job.id} item={job} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<Search size={32} />}
                        title="No jobs found"
                        description={
                            q
                                ? `We couldn't find jobs matching "${q}". Try different keywords or remove filters.`
                                : 'There are no job listings yet. Check back soon.'
                        }
                        actionText="Browse All Jobs"
                        actionHref="/"
                    />
                )}
            </div>
        </div>
    );
}
