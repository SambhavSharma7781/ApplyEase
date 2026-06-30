import { notFound } from "next/navigation";
import Link from "next/link";
import prismaClient from "@/services/prisma";
import DeleteCompany from "@/components/deleteCompany";
import CompanyReviewsAndJobsContainer from "@/components/company-listing-reviews";
import BackLink from "@/components/back-link";
import CompanyLogo from "@/components/company-logo";
import { Briefcase, Mail, Star } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function CompanyIDPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const [company, reviews] = await Promise.all([
            prismaClient.company.findUnique({
                where: { id },
                include: { owner: true, jobs: true },
            }),
            prismaClient.review.findMany({
                where: { company_id: id },
                include: { user: { select: { email: true } } }
            })
        ]);

        const { getUserFromCookies } = await import("@/helper");
        const currentUser = await getUserFromCookies();
        const isOwner = currentUser?.id === company?.ownerId;

        if (!company) notFound();

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <BackLink href="/company" label="Back to Companies" />

                    {/* Company header */}
                    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-5">
                                <CompanyLogo name={company.name} size="xl" />
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{company.name}</h1>
                                    <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                                        <Mail size={14} />
                                        <span>{company.owner?.email}</span>
                                    </div>
                                </div>
                            </div>
                            {isOwner && (
                                <div className="shrink-0">
                                    <DeleteCompany companyId={id} />
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center transition-colors hover:bg-gray-50">
                                <div className="flex justify-center mb-1.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100/50 text-blue-600">
                                        <Briefcase size={16} />
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-gray-900">{company.jobs?.length || 0}</p>
                                <p className="mt-0.5 text-xs font-medium text-gray-500">Active Jobs</p>
                            </div>
                            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center transition-colors hover:bg-gray-50">
                                <div className="flex justify-center mb-1.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100/50 text-yellow-600">
                                        <Star size={16} />
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-gray-900">{reviews?.length || 0}</p>
                                <p className="mt-0.5 text-xs font-medium text-gray-500">Reviews</p>
                            </div>
                            <div className="hidden rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center transition-colors hover:bg-gray-50 sm:block">
                                <div className="flex justify-center mb-1.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100/50 text-purple-600">
                                        <Mail size={16} />
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-gray-900">1</p>
                                <p className="mt-0.5 text-xs font-medium text-gray-500">Owner</p>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    {company.description && (
                        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="mb-3 text-xl font-semibold text-gray-900">About {company.name}</h2>
                            <p className="leading-relaxed text-gray-700">{company.description}</p>
                        </div>
                    )}

                    {/* Reviews and Jobs */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <CompanyReviewsAndJobsContainer reviews={reviews} company={company} />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading company:', error);
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">Error Loading Company</h2>
                    <p className="mb-4 text-gray-600">There was an error loading the company information.</p>
                    <Link
                        href="/company"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
                    >
                        Back to Companies
                    </Link>
                </div>
            </div>
        );
    }
}
