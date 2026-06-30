import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import BackLink from "@/components/back-link";
import PageHeader from "@/components/page-header";
import EmptyState from "@/components/empty-state";
import AppliedJobCard from "@/components/cards/applied-job-card";

export default async function AppliedJobsPage() {
    const user = await getUserFromCookies();

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <BackLink href="/" label="Back to Jobs" />
                    <div className="flex items-center justify-center">
                        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                                <CheckCircle size={24} className="text-blue-600" />
                            </div>
                            <h1 className="mb-2 text-2xl font-bold text-gray-900">Sign In Required</h1>
                            <p className="mb-6 text-gray-600">Please log in to view your job applications.</p>
                            <Link
                                href="/login"
                                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
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
        where: { user_id: user.id },
        include: { job: { include: { company: true } } },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <BackLink href="/" label="Back to Jobs" />

                <PageHeader
                    icon={<CheckCircle size={24} />}
                    title="Applied Jobs"
                    subtitle={
                        applications.length > 0
                            ? `${applications.length} application${applications.length !== 1 ? 's' : ''} submitted`
                            : 'Track your job applications'
                    }
                />

                {applications.length === 0 ? (
                    <EmptyState
                        icon={<CheckCircle size={32} />}
                        title="No Applications Yet"
                        description="You haven't applied to any jobs yet. Start exploring opportunities!"
                        actionText="Browse Jobs"
                        actionHref="/search"
                    />
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {applications.map((application, idx) => (
                            <div 
                                key={application.id}
                                className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                                style={{ animationDelay: `${idx * 50}ms`, animationDuration: '400ms' }}
                            >
                                <AppliedJobCard application={application} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
