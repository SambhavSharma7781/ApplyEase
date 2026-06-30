// @ts-nocheck
import DeleteBtn from "@/components/deleteJob";
import EditBtn from "@/components/editJob";
import JobApplyButton from "@/components/job-apply-btn";
import ViewJobApplicants from "@/components/view-job-applicants";
import CompanyLogo from "@/components/company-logo";
import JobMetaBadges from "@/components/job-meta-badges";
import BackLink from "@/components/back-link";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";

export const dynamic = 'force-dynamic';

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const job = await prismaClient.openings.findUnique({
            where: { id },
            include: {
                company: {
                    select: { id: true, name: true, description: true }
                }
            }
        });

        if (!job) notFound();

        const user = await getUserFromCookies();
        let userHasApplied = false;

        if (user) {
            const application = await prismaClient.applications.findMany({
                where: { job_id: id, user_id: user.id }
            });
            if (application.length > 0) userHasApplied = true;
        }

        const jobWithStatus = { ...job, userHasApplied };

        return (
            <div className="min-h-screen bg-slate-50 relative">
                {/* Background ambient light */}
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none"></div>

                <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                    <BackLink href="/" label="Back to Jobs" />

                    <div className="grid gap-8 lg:grid-cols-3 mt-6">
                        {/* Main content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Header card */}
                            <div className="relative overflow-hidden rounded-3xl border border-transparent bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/50">
                                {/* Subtle card mesh background */}
                                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-50/80 blur-3xl"></div>
                                <div className="mb-5 flex items-start gap-4">
                                    <CompanyLogo name={jobWithStatus.company?.name ?? 'Company'} size="lg" />
                                    <div className="min-w-0 flex-1 z-10">
                                        <Link
                                            href={`/company/${jobWithStatus.company?.id}`}
                                            className="inline-block text-sm font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            {jobWithStatus.company?.name ?? 'Company'}
                                        </Link>
                                        <h1 className="mt-2 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
                                            {jobWithStatus.title}
                                        </h1>
                                    </div>
                                </div>

                                <JobMetaBadges
                                    employmentType={jobWithStatus.employment_Type}
                                    jobType={jobWithStatus.job_type}
                                    salary={jobWithStatus.salary}
                                    location={jobWithStatus.location}
                                    className="mb-6"
                                />

                                <div className="relative z-10 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
                                    <JobApplyButton job={jobWithStatus} showDeleteButton={true} />
                                    <ViewJobApplicants job={jobWithStatus} />
                                    <EditBtn job={jobWithStatus} />
                                    <DeleteBtn job={jobWithStatus} />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="rounded-3xl border border-transparent bg-white p-8 sm:p-10 shadow-xl shadow-gray-200/50">
                                <h2 className="mb-6 text-2xl font-bold text-gray-900">About the Role</h2>
                                <div className="prose prose-indigo max-w-none whitespace-pre-wrap leading-relaxed text-gray-600 text-lg">
                                    {jobWithStatus.description || 'No description available.'}
                                </div>
                            </div>
                        </div>

                        {/* Sticky sidebar */}
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            <div className="rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50 to-white p-8 shadow-xl shadow-indigo-900/5 transition-all hover:shadow-2xl hover:shadow-indigo-900/10">
                                <h3 className="mb-3 text-xl font-bold text-gray-900">Interested in this role?</h3>
                                <p className="mb-6 text-gray-600 leading-relaxed">
                                    Apply now to join the team at{' '}
                                    <span className="font-semibold text-indigo-700">
                                        {jobWithStatus.company?.name ?? 'this company'}
                                    </span>.
                                </p>
                                {jobWithStatus.company && (
                                    <Link
                                        href={`/company/${jobWithStatus.company.id}`}
                                        className="flex w-full items-center justify-center rounded-xl border border-indigo-200 bg-white px-5 py-3 font-semibold text-indigo-700 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md active:scale-95"
                                    >
                                        View Company
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading job:', error);
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">Error Loading Job</h2>
                    <p className="mb-4 text-gray-600">There was an error loading the job details.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
                    >
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }
}
