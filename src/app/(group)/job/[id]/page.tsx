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
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <BackLink href="/" label="Back to Jobs" />

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Header card */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <div className="mb-5 flex items-start gap-4">
                                    <CompanyLogo name={jobWithStatus.company?.name ?? 'Company'} size="lg" />
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={`/company/${jobWithStatus.company?.id}`}
                                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                        >
                                            {jobWithStatus.company?.name ?? 'Company'}
                                        </Link>
                                        <h1 className="mt-1 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
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

                                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-5">
                                    <JobApplyButton job={jobWithStatus} showDeleteButton={true} />
                                    <ViewJobApplicants job={jobWithStatus} />
                                    <EditBtn job={jobWithStatus} />
                                    <DeleteBtn job={jobWithStatus} />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900">Job Description</h2>
                                <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
                                    {jobWithStatus.description || 'No description available.'}
                                </div>
                            </div>
                        </div>

                        {/* Sticky sidebar */}
                        <div className="lg:sticky lg:top-20 lg:self-start">
                            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                                <h3 className="mb-2 font-semibold text-gray-900">Interested in this role?</h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    Apply now to join the team at{' '}
                                    <span className="font-medium text-gray-900">
                                        {jobWithStatus.company?.name ?? 'this company'}
                                    </span>.
                                </p>
                                <JobApplyButton job={jobWithStatus} />
                                {jobWithStatus.company && (
                                    <Link
                                        href={`/company/${jobWithStatus.company.id}`}
                                        className="mt-3 flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }
}
