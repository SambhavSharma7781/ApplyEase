//@ts-nocheck
import JobCard from "@/components/cards/job-card";
import DeleteBtn from "@/components/deleteJob";
import EditBtn from "@/components/editJob";
import JobApplyButton from "@/components/job-apply-btn";
import ViewJobApplicants from "@/components/view-job-applicants";
import { Button, Flex, Badge } from "@radix-ui/themes";
import { MapPin, Building2, Clock, DollarSign, Users, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

// Make this page dynamic to avoid build-time fetch issues
export const dynamic = 'force-dynamic';
import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";

export default async function JobPage({params}){
    const { id } = await params;
    
    // Fetch job details
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/job/${id}`);
    const data = await res.json();

    if(!data?.success){
        notFound() 
    }

    const job = data.job;
    
    // Check if user has already applied
    const user = await getUserFromCookies();
    let userHasApplied = false;
    
    if (user) {
        const application = await prismaClient.applications.findMany({
            where: {
                job_id: id,
                user_id: user.id
            }
        });
        
        if(application.length > 0){
            userHasApplied = true;
        }
    }
    
    // Add userHasApplied to job object
    const jobWithApplicationStatus = {
        ...job,
        userHasApplied: userHasApplied
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                {/* Job Header Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
                    <div className="p-6 sm:p-8">
                        {/* Job Title and Company */}
                        <div className="mb-6">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {jobWithApplicationStatus.title}
                            </h1>
                            
                            {/* Company Info */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium">
                                        {jobWithApplicationStatus.company?.name?.charAt(0)?.toUpperCase() || 'C'}
                                    </div>
                                    <div>
                                        <Link 
                                            href={`/company/${jobWithApplicationStatus.company?.id}`}
                                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                        >
                                            {jobWithApplicationStatus.company?.name || 'Company Name'}
                                        </Link>
                                        {jobWithApplicationStatus.company?.address && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <MapPin size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-600">{jobWithApplicationStatus.company.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Job Meta Information */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                {jobWithApplicationStatus.jobType && (
                                    <Badge variant="soft" color="blue" className="px-3 py-1">
                                        <Building2 size={14} className="mr-1" />
                                        {jobWithApplicationStatus.jobType}
                                    </Badge>
                                )}
                                {jobWithApplicationStatus.employmentType && (
                                    <Badge variant="soft" color="green" className="px-3 py-1">
                                        <Clock size={14} className="mr-1" />
                                        {jobWithApplicationStatus.employmentType}
                                    </Badge>
                                )}
                                {jobWithApplicationStatus.salary && (
                                    <Badge variant="soft" color="orange" className="px-3 py-1">
                                        <span className="mr-1">₹</span>
                                        {jobWithApplicationStatus.salary}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t border-gray-100 pt-6">
                            <Flex gap="3" wrap="wrap" className="justify-start">
                                <JobApplyButton job={jobWithApplicationStatus} showDeleteButton={true} />
                                <ViewJobApplicants job={jobWithApplicationStatus} />
                                <EditBtn job={jobWithApplicationStatus} />
                                <DeleteBtn job={jobWithApplicationStatus} />
                            </Flex>
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6 sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Job Description
                            </h2>
                            <div className="prose prose-gray max-w-none">
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {jobWithApplicationStatus.description || 'No description available for this position.'}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Additional Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-gray-400" />
                                    <span className="text-gray-600">Job ID:</span>
                                    <span className="text-gray-900 font-medium">{jobWithApplicationStatus.id}</span>
                                </div>
                                {jobWithApplicationStatus.createdAt && (
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        <span className="text-gray-600">Posted:</span>
                                        <span className="text-gray-900 font-medium">
                                            {new Date(jobWithApplicationStatus.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Apply CTA */}
                <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Interested in this position?
                    </h3>
                    <p className="text-gray-600">
                        Apply now to join the team at {jobWithApplicationStatus.company?.name || 'this company'}
                    </p>
                </div>
            </div>
        </div>
    );
}