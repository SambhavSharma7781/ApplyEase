'use client'

import { useState, useEffect, createContext } from "react";
import Header from "@/components/header";
import { ReactNode } from "react";
import { User, JobWithCompany, SavedJobsContextType, UserContextType } from "@/types/index";

export const userContext = createContext<UserContextType | undefined>(undefined);
export const SavedJobsContext = createContext<{ 
    savedJobs: any[], 
    setSavedJobs: (jobs: any[]) => void 
} | undefined>(undefined);

export default function Layout({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [savedJobs, setSavedJobs] = useState<any[]>([]);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/current-user'); 
                const data = await res.json();
                console.log(data.data);
                
                if (data.success) {
                    setUser(data?.data);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        // Load saved jobs from database when user is logged in
        async function fetchSavedJobs() {
            try {
                const res = await fetch("/api/jobs/saved");
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setSavedJobs(data.savedJobs || []);
                        return;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch saved jobs from API:", error);
            }
            
            // Fallback to localStorage if API fails
            const storedJobs = localStorage.getItem("savedJobs");
            if (storedJobs) {
                try {
                    setSavedJobs(JSON.parse(storedJobs));
                } catch (error) {
                    console.error("Error parsing saved jobs:", error);
                    setSavedJobs([]);
                }
            }
        }

        // Only fetch saved jobs if user is logged in
        if (user) {
            fetchSavedJobs();
        } else {
            // Clear saved jobs if user is not logged in
            setSavedJobs([]);
        }
    }, [user]); // Re-run when user changes

    return (
        <userContext.Provider value={{ user }}>
            <SavedJobsContext.Provider value={{ savedJobs, setSavedJobs }}>
                <Header />
                {children}
            </SavedJobsContext.Provider>
        </userContext.Provider>
    );
}