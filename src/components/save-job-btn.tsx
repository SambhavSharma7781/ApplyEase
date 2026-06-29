"use client"
import { useEffect, useContext, useState } from 'react'
import { SavedJobsContext } from '@/components/client-providers'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { JobWithCompany } from '@/types/index'

interface SaveJobBtnProps {
    job: JobWithCompany;
}

export default function SaveJobBtn({ job }: SaveJobBtnProps) {
    const context = useContext(SavedJobsContext);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (context?.savedJobs && job) {
            setIsSaved(context.savedJobs.some((elem) => elem.id === job.id));
        }
    }, [context?.savedJobs, job]);

    if (!context) return null;

    const { savedJobs, setSavedJobs } = context;

    async function handleSave() {
        if (!job) return;
        try {
            const res = await fetch("/api/jobs/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: job.id }),
            });
            const data = await res.json();
            if (data.success) {
                const refreshRes = await fetch("/api/jobs/saved");
                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    if (refreshData.success) setSavedJobs(refreshData.savedJobs || []);
                }
                setIsSaved(true);
                toast.success("Job saved");
            } else {
                toast.error("Failed to save job");
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    async function handleUnsave() {
        if (!job) return;
        try {
            const res = await fetch("/api/jobs/unsave", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: job.id }),
            });
            const data = await res.json();
            if (data.success) {
                setSavedJobs(savedJobs.filter((elem) => elem.id !== job.id));
                setIsSaved(false);
                toast.success("Removed from saved");
            } else {
                toast.error("Failed to remove job");
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <button
            onClick={isSaved ? handleUnsave : handleSave}
            className={cn(
                "flex shrink-0 items-center justify-center rounded-lg p-2 transition-colors",
                isSaved
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "text-gray-400 hover:bg-blue-50 hover:text-blue-600"
            )}
            aria-label={isSaved ? "Unsave job" : "Save job"}
            title={isSaved ? "Saved" : "Save job"}
        >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
    );
}
