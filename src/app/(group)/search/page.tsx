import JobCard from "@/components/cards/job-card";
import EmptyState from "@/components/empty-state";
import Link from "next/link";
import { Search, X } from "lucide-react";
import prismaClient from "@/services/prisma";

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; jt?: string; et?: string; p?: string }> }) {
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
            },
            skip,
            take: pageSize,
        });

        totalJobs = await prismaClient.openings.count({
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
        <div className="w-full">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            {q ? `Results for "${q}"` : 'All Jobs'}
                        </h1>
                        <p className="mt-1.5 flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex h-5 items-center justify-center rounded-md bg-gray-100 px-2 font-medium text-gray-900">
                                {totalJobs}
                            </span>
                            job{totalJobs !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    {/* Active filter chips */}
                    {hasFilters && (
                        <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
                            {jt && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[13px] font-medium text-violet-700 shadow-sm transition-colors hover:shadow">
                                    Location: {jt}
                                </span>
                            )}
                            {et && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[13px] font-medium text-blue-700 shadow-sm transition-colors hover:shadow">
                                    Type: {et}
                                </span>
                            )}
                            <Link
                                href={clearFiltersHref}
                                className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-500 transition-colors hover:text-blue-600"
                            >
                                <X size={14} />
                                Clear
                            </Link>
                        </div>
                    )}
                </div>

                {jobs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                            q
                                ? `We couldn't find jobs matching "${q}". Try different keywords or remove filters.`
                                : 'There are no job listings yet. Check back soon.'
                        }
                        actionText="Browse All Jobs"
                        actionHref="/"
                    />
                )}

            {totalJobs > pageSize && (
                <div className="mt-10 mb-8 flex justify-center gap-2 items-center">
                    {page > 1 ? (
                        <Link 
                            href={`/search?${new URLSearchParams({ ...params, p: (page - 1).toString() }).toString()}`}
                            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                        >
                            Previous
                        </Link>
                    ) : (
                        <span className="inline-flex items-center justify-center rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                            Previous
                        </span>
                    )}
                    
                    <span className="px-4 text-sm font-medium text-gray-600">
                        Page {page} of {Math.ceil(totalJobs / pageSize)}
                    </span>
                    
                    {page < Math.ceil(totalJobs / pageSize) ? (
                        <Link 
                            href={`/search?${new URLSearchParams({ ...params, p: (page + 1).toString() }).toString()}`}
                            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                        >
                            Next
                        </Link>
                    ) : (
                        <span className="inline-flex items-center justify-center rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                            Next
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
