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
import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";

// Make this page dynamic to avoid build-time fetch issues
export const dynamic = 'force-dynamic';

export default async function JobPage({params}){
    const { id } = await params;
    
    try {
        // Direct database call instead of API fetch
        const job = await prismaClient.openings.findUnique({
            where: { id },
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

        if(!job){
            notFound();
        }
    
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
    } catch (error) {
        console.error('Error loading job:', error);
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Job</h2>
                    <p className="text-gray-600 mb-4">
                        There was an error loading the job details.
                    </p>
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }
}