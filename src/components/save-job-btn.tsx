'use client'
import { useEffect, useContext, useState } from 'react'
import { SavedJobsContext, userContext } from '@/components/client-providers'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { JobWithCompany } from '@/types/index'

interface SaveJobBtnProps {
    job: JobWithCompany;
}

export default function SaveJobBtn({ job }: SaveJobBtnProps) {
    const context = useContext(SavedJobsContext);
    const uContext = useContext(userContext);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (context?.savedJobs && job) {
            setIsSaved(context.savedJobs.some((elem) => elem.id === job.id));
        }
    }, [context?.savedJobs, job]);

    if (!context || uContext?.user?.role === 'employer') return null;

    const { savedJobs, setSavedJobs } = context;

    async function handleSave() {
        if (!job) return;
        
        toast.dismiss(); // Instantly dismiss any existing toast

        // Optimistic update
        setIsSaved(true);
        const previousSavedJobs = [...savedJobs];
        setSavedJobs([...savedJobs, job]);

        try {
            const res = await fetch("/api/jobs/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: job.id }),
            });
            const data = await res.json();
            
            if (data.success) {
                toast.success("Job saved");
                // Background refresh to ensure context stays perfectly in sync
                fetch("/api/jobs/saved")
                    .then(r => r.json())
                    .then(d => { if (d.success) setSavedJobs(d.savedJobs || []); })
                    .catch(() => {});
            } else {
                // Revert on failure
                setIsSaved(false);
                setSavedJobs(previousSavedJobs);
                toast.error("Failed to save job");
            }
        } catch {
            setIsSaved(false);
            setSavedJobs(previousSavedJobs);
            toast.error("Something went wrong");
        }
    }

    async function handleUnsave() {
        if (!job) return;
        
        toast.dismiss(); // Instantly dismiss any existing toast

        // Optimistic update
        setIsSaved(false);
        const previousSavedJobs = [...savedJobs];
        setSavedJobs(savedJobs.filter((elem) => elem.id !== job.id));

        try {
            const res = await fetch("/api/jobs/unsave", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: job.id }),
            });
            const data = await res.json();
            
            if (data.success) {
                toast.success("Removed from saved");
            } else {
                // Revert on failure
                setIsSaved(true);
                setSavedJobs(previousSavedJobs);
                toast.error("Failed to remove job");
            }
        } catch {
            setIsSaved(true);
            setSavedJobs(previousSavedJobs);
            toast.error("Something went wrong");
        }
    }

    return (
        <button
            onClick={isSaved ? handleUnsave : handleSave}
            className={cn(
                "flex shrink-0 items-center justify-center rounded-lg p-2 transition-all duration-200 active:scale-90",
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
