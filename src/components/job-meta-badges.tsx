import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, Wallet } from "lucide-react";
import { formatSalary } from "@/lib/format";
import { cn } from "@/lib/utils";

interface JobMetaBadgesProps {
    employmentType?: string | null; // employment_Type
    jobType?: string | null; // job_type (work location: remote/on-site/hybrid)
    salary?: number | null;
    location?: string | null;
    className?: string;
}

const base = "gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium";

/** Single source of truth for the job metadata chip row. Server-safe. */
export default function JobMetaBadges({
    employmentType,
    jobType,
    salary,
    location,
    className,
}: JobMetaBadgesProps) {
    const salaryLabel = formatSalary(salary);

    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
            {employmentType && (
                <Badge variant="outline" className={cn(base, "border-blue-200 bg-blue-50 text-blue-700")}>
                    <Clock className="h-3.5 w-3.5" />
                    {employmentType}
                </Badge>
            )}
            {jobType && (
                <Badge variant="outline" className={cn(base, "border-violet-200 bg-violet-50 text-violet-700")}>
                    <Briefcase className="h-3.5 w-3.5" />
                    {jobType}
                </Badge>
            )}
            {salaryLabel && (
                <Badge variant="outline" className={cn(base, "border-emerald-200 bg-emerald-50 text-emerald-700")}>
                    <Wallet className="h-3.5 w-3.5" />
                    {salaryLabel}
                </Badge>
            )}
            {location && (
                <Badge variant="outline" className={cn(base, "border-gray-200 bg-gray-50 text-gray-600")}>
                    <MapPin className="h-3.5 w-3.5" />
                    {location}
                </Badge>
            )}
        </div>
    );
}
