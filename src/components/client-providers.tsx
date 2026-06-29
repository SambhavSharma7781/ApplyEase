"use client";

import { useState, useEffect, createContext, ReactNode } from "react";
import ThemeComponent from "@/components/context/theme-component";
import { Toaster } from "@/components/ui/sonner";
import { User, JobWithCompany } from "@/types/index";

export const userContext = createContext<{ user: User | null } | undefined>(undefined);
export const SavedJobsContext = createContext<{
    savedJobs: JobWithCompany[];
    setSavedJobs: (jobs: JobWithCompany[]) => void;
} | undefined>(undefined);

interface ClientProvidersProps {
    children: ReactNode;
    initialUser: User | null;
}

export default function ClientProviders({ children, initialUser }: ClientProvidersProps) {
    const [user] = useState<User | null>(initialUser);
    const [savedJobs, setSavedJobs] = useState<JobWithCompany[]>([]);

    useEffect(() => {
        if (!user) {
            setSavedJobs([]);
            return;
        }
        async function fetchSavedJobs() {
            try {
                const res = await fetch("/api/jobs/saved");
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setSavedJobs(data.savedJobs ?? []);
                        return;
                    }
                }
            } catch {
                // silently fall through to empty state
            }
            setSavedJobs([]);
        }
        fetchSavedJobs();
    }, [user]);

    return (
        <userContext.Provider value={{ user }}>
            <SavedJobsContext.Provider value={{ savedJobs, setSavedJobs }}>
                <ThemeComponent>
                    {children}
                    <Toaster richColors position="top-center" />
                </ThemeComponent>
            </SavedJobsContext.Provider>
        </userContext.Provider>
    );
}
