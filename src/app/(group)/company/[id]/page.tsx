import { notFound } from "next/navigation";
import prismaClient from "@/services/prisma";
import DeleteCompany from "@/components/deleteCompany";
import CompanyReviewsAndJobsContainer from "@/components/company-listing-reviews";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, Users, Briefcase, Star } from "lucide-react";

// Make this page dynamic to avoid build-time fetch issues
export const dynamic = 'force-dynamic';

export default async function CompanyIDPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const company = await prismaClient.company.findUnique({
            where: {
                id: id,
            },
            include: {
                owner: true,
                jobs: true
            },
        });

        // Get reviews directly from database
        const reviews = await prismaClient.review.findMany({
            where: {
                company_id: id
            },
            include: {
                user: {
                    select: {
                        email: true
                    }
                }
            }
        });

        if (!company) {
            notFound();
        }

    // Type assertion to help TypeScript understand the included relations
    const companyWithRelations = company as typeof company & {
        owner: { id: string; email: string; password: string; role: string | null; };
        jobs: Array<{ id: string; title: string; description: string; }>;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Navigation */}
                <div className="mb-6">
                    <Link 
                        href="/company"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span className="text-sm font-medium">Back to Companies</span>
                    </Link>
                </div>

                {/* Company Header */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                            {/* Company Avatar */}
                            <div className="flex-shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl sm:text-3xl">
                                {companyWithRelations.name.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                        {companyWithRelations.name}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Mail size={16} />
                                            <span>{companyWithRelations.owner?.email || 'No email available'}</span>
                                        </div>
                                    </div>
                                </div>                                    {/* Action Button */}
                                    <div className="flex-shrink-0">
                                        <DeleteCompany companyId={id} />
                                    </div>
                                </div>

                                {/* Company Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                                            <Briefcase size={16} />
                                        </div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {companyWithRelations.jobs?.length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Active Jobs
                                        </div>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                                            <Star size={16} />
                                        </div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {reviews?.length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Reviews
                                        </div>
                                    </div>
                                    
                                    <div className="text-center sm:block hidden">
                                        <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                                            <Users size={16} />
                                        </div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {companyWithRelations.owner ? 1 : 0}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Owner
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Description */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 size={20} className="text-gray-600" />
                            <h2 className="text-xl font-semibold text-gray-900">
                                About {companyWithRelations.name}
                            </h2>
                        </div>
                        
                        <div className="prose prose-gray max-w-none">
                            {companyWithRelations.description ? (
                                <p className="text-gray-700 leading-relaxed">
                                    {companyWithRelations.description}
                                </p>
                            ) : (
                                <p className="text-gray-500 italic">
                                    No company description available.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Company Reviews and Jobs */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6 sm:p-8">
                        <CompanyReviewsAndJobsContainer reviews={reviews} company={companyWithRelations} />
                    </div>
                </div>
            </div>
        </div>
    );
    } catch (error) {
        console.error('Error loading company:', error);
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Company</h2>
                    <p className="text-gray-600 mb-4">
                        There was an error loading the company information.
                    </p>
                    <Link 
                        href="/company"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Companies
                    </Link>
                </div>
            </div>
        );
    }
}