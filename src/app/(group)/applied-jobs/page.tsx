import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import EmptyState from "@/components/empty-state";
import AppliedJobCard from "@/components/cards/applied-job-card";

export default async function AppliedJobsPage() {
    const user = await getUserFromCookies();

    if(!user){
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Navigation */}
                    <div className="mb-6">
                        <Link 
                            href="/"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-sm font-medium">Back to Jobs</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center justify-center">
                        <div className="max-w-md mx-auto text-center bg-white rounded-xl border border-gray-200 p-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Authentication Required
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Please log in to view your job applications.
                            </p>
                            <Link 
                                href="/login"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    const applications = await prismaClient.applications.findMany({
        where: {
            user_id: user.id
        },
        include: {
            job: {
                include: {
                    company: true
                }
            }
        },
    });
    
    if(!applications.length){
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Navigation */}
                    <div className="mb-6">
                        <Link 
                            href="/"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-sm font-medium">Back to Jobs</span>
                        </Link>
                    </div>
                    
                    <PageHeader 
                        icon={<CheckCircle size={24} className="text-blue-600" />}
                        title="Applied Jobs"
                        subtitle="Track your job applications"
                    />
                    <EmptyState 
                        icon={<CheckCircle size={32} className="text-gray-400" />}
                        title="No Applications Yet"
                        description="You haven't applied to any jobs yet. Start exploring opportunities and apply to your dream job!"
                        actionText="Browse Jobs"
                        actionHref="/search"
                    />
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Navigation */}
                <div className="mb-6">
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span className="text-sm font-medium">Back to Jobs</span>
                    </Link>
                </div>
                
                <PageHeader 
                    icon={<CheckCircle size={24} className="text-blue-600" />}
                    title="Applied Jobs"
                    subtitle={`${applications.length} application${applications.length !== 1 ? 's' : ''} submitted`}
                />

                {/* Applications Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {applications.map((application) => (
                        <AppliedJobCard 
                            key={application.id} 
                            application={application} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}