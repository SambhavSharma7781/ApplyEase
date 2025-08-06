// Common types used across the application

export interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    salary: number;
    employment_Type: string;
    job_type: string;
    companyId?: string;
    company?: Company;
}

export interface JobWithCompany {
    id: string;
    title: string;
    description: string;
    location: string;
    salary: number;
    employment_Type: string;
    job_type: string;
    companyId: string;
    company: {
        id: string;
        name: string;
        address?: string;
    };
}

export interface Company {
    id: string;
    name: string;
    description: string;
    ownerId: string;
}

export interface User {
    id: string;
    email: string;
    role?: string;
    company?: Company | null;
}

export interface SavedJobsContextType {
    savedJobs: JobWithCompany[];
    setSavedJobs: (jobs: JobWithCompany[]) => void;
}

export interface UserContextType {
    user: User | null;
}
