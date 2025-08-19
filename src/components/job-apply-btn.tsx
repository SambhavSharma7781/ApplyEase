'use client'
import { useState, useEffect } from "react";
import { SendIcon, CheckCircle, Loader2 } from "lucide-react";
import { Job } from '@/types/index';

interface JobApplyButtonProps {
    job: Job & { userHasApplied?: boolean };
    showDeleteButton?: boolean;
}

export default function JobApplyButton({ job, showDeleteButton = false }: JobApplyButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    // Use server's userHasApplied field instead of localStorage
    useEffect(() => {
        console.log('🔍 Job data received:', { jobId: job?.id, userHasApplied: job?.userHasApplied });
        if (job?.userHasApplied !== undefined) {
            setIsApplied(job.userHasApplied);
            console.log('✅ Setting isApplied to:', job.userHasApplied);
        }
    }, [job?.userHasApplied]);

    async function handleSubmit() {
        if (isLoading || isApplied) return;
        
        setIsLoading(true);
        try {
            const res = await fetch("/api/job/apply/" + job?.id);
            const data = await res.json();
            
            if (data.success) {
                setIsApplied(true);
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

    async function handleDeleteApplication() {
        if (isLoading || !isApplied) return;
        
        setIsLoading(true);
        try {
            const res = await fetch("/api/job/apply/" + job?.id, {
                method: "DELETE"
            });
            const data = await res.json();
            
            if (data.success) {
                setIsApplied(false);
                alert("Application deleted successfully!");
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
        <div className="flex gap-2">
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

            {/* Delete Application Button - Only show if user has applied AND showDeleteButton is true */}
            {isApplied && showDeleteButton && (
                <button
                    onClick={handleDeleteApplication}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                    <span className="text-white">Delete Application</span>
                </button>
            )}
        </div>
    );
}