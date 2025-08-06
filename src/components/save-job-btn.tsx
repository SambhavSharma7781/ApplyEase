"use client"
import React, { useEffect, useContext, useState } from 'react'
import { SavedJobsContext } from '@/app/(group)/layout'
import { Bookmark, BookmarkCheck } from 'lucide-react'

interface SaveJobBtnProps {
    job: any; // Using any to handle different job structures
}

export default function SaveJobBtn({ job }: SaveJobBtnProps) {
    const context = useContext(SavedJobsContext);
    const [isSaved, setIsSaved] = useState(false);

    if (!context) {
        return null;
    }

    const { savedJobs, setSavedJobs } = context;

    useEffect(() => {
        if (savedJobs && job) {
            const isJobSaved = savedJobs.find((elem) => elem.id === job.id);
            setIsSaved(!!isJobSaved);
        }
    }, [savedJobs, job]);

    async function handleSave() {
        if (!job) return;
        
        try {
            const res = await fetch("/api/jobs/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ jobId: job.id })
            });
            
            const data = await res.json();
            
            if (data.success) {
                // Refresh saved jobs by refetching from API
                const refreshRes = await fetch("/api/jobs/saved");
                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    if (refreshData.success) {
                        setSavedJobs(refreshData.savedJobs || []);
                    }
                }
                setIsSaved(true);
                alert("Job saved successfully!");
            } else {
                alert("Failed to save job");
            }
        } catch (error) {
            alert("Something went wrong");
        }
    }

    async function handleUnsave() {
        if (!job) return;
        
        try {
            const res = await fetch("/api/jobs/unsave", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ jobId: job.id })
            });
            
            const data = await res.json();
            
            if (data.success) {
                const updatedArray = savedJobs.filter((elem) => elem.id !== job.id);
                setSavedJobs(updatedArray);
                setIsSaved(false);
                alert("Job removed from saved jobs!");
            } else {
                alert("Failed to unsave job");
            }
        } catch (error) {
            alert("Something went wrong");
        }
    }

    return (
        <button
            onClick={isSaved ? handleUnsave : handleSave}
            className={`
                flex-shrink-0 p-2 rounded-lg transition-colors
                ${isSaved 
                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                }
            `}
            aria-label={isSaved ? "Unsave job" : "Save job"}
        >
            {isSaved ? (
                <BookmarkCheck size={18} />
            ) : (
                <Bookmark size={18} />
            )}
        </button>
    );
}