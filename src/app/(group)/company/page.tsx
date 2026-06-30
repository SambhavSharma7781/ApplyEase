import prismaClient from "@/services/prisma"
import Link from "next/link"
import { Building2, Users } from "lucide-react"
import CompanyLogo from "@/components/company-logo"
import EmptyState from "@/components/empty-state"

export const dynamic = 'force-dynamic';

export default async function CompaniesPage() {
    const companies = await prismaClient.company.findMany({
        include: {
            owner: true,
            _count: { select: { jobs: true } }
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Companies</h1>
                    <p className="mt-2 text-gray-500">
                        Discover the {companies.length} compan{companies.length !== 1 ? 'ies' : 'y'} actively hiring on ApplyEase
                    </p>
                </div>

                {companies.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {companies.map((company, idx) => (
                            <div 
                                key={company.id}
                                className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                                style={{ animationDelay: `${idx * 50}ms`, animationDuration: '400ms' }}
                            >
                                <Link
                                    href={`/company/${company.id}`}
                                    className="group flex h-full flex-col rounded-3xl border border-transparent bg-white p-6 sm:p-8 shadow-lg shadow-gray-200/50 transition-all duration-500 will-change-transform hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10"
                                >
                                {/* Header */}
                                <div className="mb-4 flex items-start gap-4">
                                    <CompanyLogo name={company.name} size="lg" />
                                    <div className="min-w-0 flex-1">
                                        <h2 className="line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                                            {company.name}
                                        </h2>
                                        <p className="mt-0.5 text-sm text-gray-500 truncate">{company.owner.email}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className={`flex-1 text-sm leading-relaxed ${company.description ? 'text-gray-600 line-clamp-3' : 'italic text-gray-400'}`}>
                                    {company.description || 'No description available'}
                                </p>

                                {/* Footer */}
                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
                                        <Building2 size={14} />
                                        <span>{company._count?.jobs || 0} open job{company._count?.jobs !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Users size={12} />
                                        <span>Hiring</span>
                                    </div>
                                </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<Building2 size={32} />}
                        title="No companies yet"
                        description="Companies will appear here once they register and start posting jobs."
                    />
                )}
            </div>
        </div>
    );
}
