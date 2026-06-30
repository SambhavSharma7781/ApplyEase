'use client';
import * as React from 'react';
import { Plus, Briefcase, MapPin, IndianRupee, Clock, Building2, ArrowLeft } from 'lucide-react';
import { userContext } from '@/components/client-providers';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddJobPage() {
  const [jobTitle, setJobTitle] = React.useState('');
  const [jobDescription, setJobDescription] = React.useState('');
  const [jobLocation, setJobLocation] = React.useState('');
  const [jobSalary, setJobSalary] = React.useState('');
  const [employmentType, setEmploymentType] = React.useState('Full-time');
  const [jobType, setJobType] = React.useState('on-site');
  const [loading, setLoading] = React.useState(false);
  const ctx = React.useContext(userContext);
  const user = ctx?.user;

  if (!user?.company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Building2 className="h-7 w-7 text-gray-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Company Required</h2>
          <p className="mb-6 text-gray-600">
            You need to create a company first before you can post jobs.
          </p>
          <div className="space-y-3">
            <Link
              href="/company"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
            >
              <Building2 size={16} /> Go to Companies
            </Link>
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
            >
              <ArrowLeft size={16} /> Back to Home
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
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobTitle,
          description: jobDescription,
          location: jobLocation,
          salary: Number.parseFloat(jobSalary),
          employment_Type: employmentType,
          job_type: jobType,
          companyId: user?.company?.id,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success("Job listing created successfully!");
        setJobTitle('');
        setJobDescription('');
        setJobLocation('');
        setJobSalary('');
        setEmploymentType('Full-time');
        setJobType('on-site');
      } else {
        toast.error(`Failed to add job: ${resData.message || 'Unknown error'}`);
      }
    } catch {
      toast.error('Failed to add job. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Post a New Job</h1>
          <p className="mt-2 text-gray-500">Fill out the details below to create a new job listing</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="flex items-center gap-1.5">
                  <Briefcase size={14} className="text-gray-500" /> Job Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-gray-500" /> Job Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, requirements, and benefits…"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  required
                />
                <p className="text-xs text-gray-400">{jobDescription.length}/1000 characters</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location" className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-500" /> Job Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Mumbai, India or Remote"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="salary" className="flex items-center gap-1.5">
                  <IndianRupee size={14} className="text-gray-500" /> Annual Salary (₹)
                </Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="e.g. 1200000"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  min="0"
                  step="10000"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-500" /> Employment Type
                  </Label>
                  <Select value={employmentType} onValueChange={setEmploymentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-gray-500" /> Work Location
                  </Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-site">On-site</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <Button
                  type="submit"
                  disabled={loading || !jobTitle.trim() || !jobDescription.trim() || !jobLocation.trim() || !jobSalary.trim()}
                  className="w-full gap-2 shadow-sm transition-all duration-200 active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating…
                    </>
                  ) : (
                    <><Plus size={16} /> Create Job Listing</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Your job listing will be visible to all job seekers on the platform.
        </p>
      </div>
    </div>
  );
}
