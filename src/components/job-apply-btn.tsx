'use client'
import { useState, useEffect, useContext } from "react";
import { SendIcon, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Job } from '@/types/index';
import { useRouter } from "next/navigation";
import { userContext } from "@/components/client-providers";

interface JobApplyButtonProps {
    job: Job & { userHasApplied?: boolean };
    showDeleteButton?: boolean;
}

export default function JobApplyButton({ job, showDeleteButton = false }: JobApplyButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const router = useRouter();
    
    const uContext = useContext(userContext);

    useEffect(() => {
        if (job?.userHasApplied !== undefined) {
            setIsApplied(job.userHasApplied);
        }
    }, [job?.userHasApplied]);

    if (uContext?.user?.role === 'employer') return null;

    async function handleSubmit() {
        if (isLoading || isApplied) return;
        
        toast.dismiss(); // Instantly dismiss any existing toast
        setIsLoading(true);
        try {
            const res = await fetch("/api/job/apply/" + job?.id);
            const data = await res.json();
            if (data.success) {
                setIsApplied(true);
                toast.success("Applied successfully!");
                router.refresh();
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteApplication() {
        if (isLoading || !isApplied) return;
        
        toast.dismiss(); // Instantly dismiss any existing toast
        setIsLoading(true);
        try {
            const res = await fetch("/api/job/apply/" + job?.id, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setIsApplied(false);
                toast.success("Application withdrawn");
                router.refresh();
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex gap-2">
            <button
                onClick={handleSubmit}
                disabled={isLoading || isApplied}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium text-sm transition-all duration-200
                    ${isLoading
                        ? 'bg-blue-400 text-white cursor-not-allowed'
                        : isApplied
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                            : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.97]'
                    }`}
            >
                {isLoading ? (
                    <><Loader2 size={16} className="animate-spin" /><span>Applying…</span></>
                ) : isApplied ? (
                    <><CheckCircle size={16} /><span>Applied!</span></>
                ) : (
                    <><SendIcon size={16} /><span>Apply Now</span></>
                )}
            </button>

            {isApplied && showDeleteButton && (
                <button
                    onClick={handleDeleteApplication}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium text-sm transition-all duration-200 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Withdraw
                </button>
            )}
        </div>
    );
}
