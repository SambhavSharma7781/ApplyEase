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

export default async function JobPage({params}){
    const { id } = params;
    const res = await fetch(`http://localhost:3000/api/job/${id}`);
    const data = await res.json();

    if(!data?.success){
        notFound() 
    }

    const job = data.job;

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
                                {job.title}
                            </h1>
                            
                            {/* Company Info */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium">
                                        {job.company?.name?.charAt(0)?.toUpperCase() || 'C'}
                                    </div>
                                    <div>
                                        <Link 
                                            href={`/company/${job.company?.id}`}
                                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                        >
                                            {job.company?.name || 'Company Name'}
                                        </Link>
                                        {job.company?.address && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <MapPin size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-600">{job.company.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Job Meta Information */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                {job.jobType && (
                                    <Badge variant="soft" color="blue" className="px-3 py-1">
                                        <Building2 size={14} className="mr-1" />
                                        {job.jobType}
                                    </Badge>
                                )}
                                {job.employmentType && (
                                    <Badge variant="soft" color="green" className="px-3 py-1">
                                        <Clock size={14} className="mr-1" />
                                        {job.employmentType}
                                    </Badge>
                                )}
                                {job.salary && (
                                    <Badge variant="soft" color="orange" className="px-3 py-1">
                                        <span className="mr-1">₹</span>
                                        {job.salary}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t border-gray-100 pt-6">
                            <Flex gap="3" wrap="wrap" className="justify-start">
                                <JobApplyButton job={job} />
                                <ViewJobApplicants job={job} />
                                <EditBtn job={job} />
                                <DeleteBtn job={job} />
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
                                    {job.description || 'No description available for this position.'}
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
                                    <span className="text-gray-900 font-medium">{job.id}</span>
                                </div>
                                {job.createdAt && (
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        <span className="text-gray-600">Posted:</span>
                                        <span className="text-gray-900 font-medium">
                                            {new Date(job.createdAt).toLocaleDateString()}
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
                    <p className="text-gray-600 mb-4">
                        Apply now to join the team at {job.company?.name || 'this company'}
                    </p>
                    <JobApplyButton job={job} />
                </div>
            </div>
        </div>
    );
}