//@ts-nocheck
'use client';
import * as React from 'react';
import { Job } from '@/generated/prisma';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Plus, Briefcase, MapPin, DollarSign, Clock, Building2, ArrowLeft, IndianRupee } from 'lucide-react';
import { userContext } from '../layout';
import Link from 'next/link';

export default function AddJobPage() {
  const [jobTitle, setJobTitle] = React.useState('');
  const [jobDescription, setJobDescription] = React.useState('');
  const [jobLocation, setJobLocation] = React.useState('');
  const [jobSalary, setJobSalary] = React.useState('');
  const [employmentType, setEmploymentType] = React.useState('Full-time');
  const [jobType, setJobType] = React.useState('on-site');
  const [loading, setLoading] = React.useState(false);
  const { user } = React.useContext(userContext);

  // Check if user has a company
  if (!user?.company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-md">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Required</h2>
          <p className="text-gray-600 mb-6">
            You need to create a company first before you can post jobs. 
            Only company owners can add job listings.
          </p>
          <div className="space-y-3">
            <Link 
              href="/company" 
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Building2 size={16} />
              Create Company
            </Link>
            <Link 
              href="/" 
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const salaryNum = Number.parseFloat(jobSalary);
      const data: Job = {
        title: jobTitle,
        description: jobDescription,
        location: jobLocation,
        salary: salaryNum,
        employment_Type: employmentType,
        job_type: jobType,
        companyId: user?.company?.id
      };

      console.log('Submitting job data:', data);

      const res = await fetch("/api/jobs", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', res.status);
      const resData = await res.json();
      console.log('Response data:', resData);

      if (resData.success) {
        alert("Job added successfully!");
        // Reset form
        setJobTitle('');
        setJobDescription('');
        setJobLocation('');
        setJobSalary('');
        setEmploymentType('Full-time');
        setJobType('on-site');
      } else {
        alert(`Failed to add job: ${resData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting job:', error);
      alert('Failed to add job. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Post a New Job
              </h1>
              <p className="text-gray-600 mt-1">
                Fill out the details below to create a new job listing
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label.Root htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                  <Briefcase size={16} className="text-gray-600" />
                  Job Title
                </Label.Root>
                <input
                  id="title"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors placeholder-gray-500 text-gray-900"
                  placeholder="e.g. Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <Label.Root htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                  <Building2 size={16} className="text-gray-600" />
                  Job Description
                </Label.Root>
                <textarea
                  id="description"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors placeholder-gray-500 resize-none text-gray-900"
                  placeholder="Describe the role, responsibilities, requirements, and benefits..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  required
                />
                <div className="text-xs text-gray-500">
                  {jobDescription.length}/1000 characters
                </div>
              </div>

              {/* Job Location */}
              <div className="space-y-2">
                <Label.Root htmlFor="location" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                  <MapPin size={16} className="text-gray-600" />
                  Job Location
                </Label.Root>
                <input
                  id="location"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors placeholder-gray-500 text-gray-900"
                  placeholder="e.g. New York, NY or Remote"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  required
                />
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label.Root htmlFor="salary" className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                  <IndianRupee size={16} className="text-gray-600" />
                  Annual Salary (RUPPEES)
                </Label.Root>
                <input
                  id="salary"
                  type="number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors placeholder-gray-500 text-gray-900"
                  placeholder="e.g. 75000"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  min="0"
                  step="1000"
                  required
                />
              </div>

              {/* Form Grid for Select Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Employment Type */}
                <div className="space-y-2">
                  <Label.Root className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                    <Clock size={16} className="text-gray-600" />
                    Employment Type
                  </Label.Root>
                  <Select.Root value={employmentType} onValueChange={setEmploymentType}>
                    <Select.Trigger className="w-full inline-flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors text-gray-900">
                      <Select.Value placeholder="Select employment type" />
                      <Select.Icon>
                        <ChevronDownIcon className="text-gray-400" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Content className="border border-gray-200 rounded-lg shadow-lg bg-white z-50">
                      <Select.ScrollUpButton className="flex items-center justify-center h-6">
                        <ChevronUpIcon className="text-gray-400" />
                      </Select.ScrollUpButton>
                      <Select.Viewport className="p-2">
                        <Select.Item value="Full-time" className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 outline-none text-gray-900">
                          <Select.ItemText>Full-time</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="Part-time" className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 outline-none text-gray-900">
                          <Select.ItemText>Part-time</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="Contract" className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 outline-none text-gray-900">
                          <Select.ItemText>Contract</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="Internship" className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 outline-none text-gray-900">
                          <Select.ItemText>Internship</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                      <Select.ScrollDownButton className="flex items-center justify-center h-6">
                        <ChevronDownIcon className="text-gray-400" />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Root>
                </div>

                {/* Job Type */}
                <div className="space-y-2">
                  <Label.Root className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                    <Building2 size={16} className="text-gray-600" />
                    Work Location
                  </Label.Root>
                  <Select.Root value={jobType} onValueChange={setJobType}>
                    <Select.Trigger className="w-full inline-flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors text-gray-900">
                      <Select.Value placeholder="Select work type" />
                      <Select.Icon>
                        <ChevronDownIcon className="text-gray-400" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Content className="border border-gray-200 rounded-lg shadow-lg bg-white z-50">
                      <Select.Viewport className="p-2">
                        <Select.Item value="on-site" className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 outline-none text-gray-900">
                          <Select.ItemText>On-site</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="remote" className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 outline-none text-gray-900">
                          <Select.ItemText>Remote</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="hybrid" className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 outline-none text-gray-900">
                          <Select.ItemText>Hybrid</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading || !jobTitle.trim() || !jobDescription.trim() || !jobLocation.trim() || !jobSalary.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Job...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Job Listing
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Once created, your job listing will be visible to all job seekers on the platform.
          </p>
        </div>
      </div>
    </div>
  );
}