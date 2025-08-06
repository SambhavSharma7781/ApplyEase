'use client'
import { useState, useEffect } from "react";
import { SendIcon, CheckCircle, Loader2 } from "lucide-react";
import { Job } from '@/types/index';

interface JobApplyButtonProps {
    job: Job;
}

export default function JobApplyButton({ job }: JobApplyButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    // Check if user has already applied on component mount
    useEffect(() => {
        if (job?.id) {
            const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
            const hasApplied = appliedJobs.includes(job.id);
            setIsApplied(hasApplied);
        }
    }, [job?.id]);

    async function handleSubmit() {
        if (isLoading || isApplied) return;
        
        setIsLoading(true);
        try {
            const res = await fetch("/api/job/apply/" + job?.id);
            const data = await res.json();
            
            if (data.success) {
                setIsApplied(true);
                
                // Save to localStorage to persist across page refreshes
                const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
                if (!appliedJobs.includes(job.id)) {
                    appliedJobs.push(job.id);
                    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
                }
                
                // Show success alert
                alert("Applied for job successfully!");
            } else {
                alert("Something went wrong");
            }
        } catch (err) {
            alert("Something went wrong in the code");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            onClick={handleSubmit}
            disabled={isLoading || isApplied}
            className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${isLoading 
                    ? 'bg-blue-400 text-white cursor-not-allowed' 
                    : isApplied 
                        ? 'bg-green-100 text-green-700 border border-green-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                }
            `}
        >
            {isLoading ? (
                <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    <span className="text-white">Applying...</span>
                </>
            ) : isApplied ? (
                <>
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-green-700">Applied!</span>
                </>
            ) : (
                <>
                    <SendIcon size={16} className="text-white" />
                    <span className="text-white">Apply Now</span>
                </>
            )}
        </button>
    );
}