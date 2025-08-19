// @ts-nocheck
import JobCard from "@/components/cards/job-card";
import data from "@/data";
import prismaClient from "@/services/prisma";

// Make this page dynamic to avoid build-time fetch issues
export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; jt?: string; et?: string }> }) {
    const searchParamsData = await searchParams;
    const q = searchParamsData.q || "";
    const jt = searchParamsData.jt || ""; 
    const et = searchParamsData.et || ""; 

    let jobss: any[] = [];

    try {
        // Direct database search instead of API call
        const jobs = await prismaClient.openings.findMany({
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
                company: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            }
        });

        jobss = jobs.map(job => ({
            ...job,
            company: {
                id: job.company.id,
                name: job.company.name,
                address: job.location
            }
        }));
    } catch (error) {
        console.error('Error searching jobs:', error);
        jobss = [];
    }

    return (
        <div className="flex-1 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Results Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {q ? `Search Results for "${q}"` : 'All Jobs'}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-2">
                                {jobss.length > 0 
                                    ? `Found ${jobss.length} job${jobss.length !== 1 ? 's' : ''} matching your criteria`
                                    : 'No jobs found matching your criteria'
                                }
                            </p>
                        </div>
                        
                        {/* Active Filters Display */}
                        {(jt || et) && (
                            <div className="flex flex-wrap gap-2">
                                {jt && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Location: {jt}
                                    </span>
                                )}
                                {et && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Type: {et}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Job Results */}
                {jobss.length > 0 ? (
                    <div className="space-y-8">
                        {/* Jobs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {jobss.map((job, index) => (
                                <div key={job.id || index} className="flex">
                                    <JobCard item={job} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                        <div className="text-center py-16 max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No jobs found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {q 
                                    ? `We couldn't find any jobs matching "${q}". Try adjusting your search terms or filters.`
                                    : 'There are currently no job listings available. Please check back later.'
                                }
                            </p>
                            <div className="space-y-3 text-sm text-gray-500">
                                <p className="font-medium">Try:</p>
                                <ul className="space-y-1 text-left">
                                    <li>• Using different keywords</li>
                                    <li>• Removing some filters</li>
                                    <li>• Checking your spelling</li>
                                    <li>• Browsing all available jobs</li>
                                </ul>
                            </div>
                            
                            {/* Call to Action */}
                            <div className="mt-8">
                                <a 
                                    href="/" 
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7 7 4-4 4 4" />
                                    </svg>
                                    Browse All Jobs
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
