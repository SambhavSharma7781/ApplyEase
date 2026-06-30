import { cn } from "@/lib/utils";
import { companyColor, initial } from "@/lib/format";

type LogoSize = "sm" | "md" | "lg" | "xl";

const SIZES: Record<LogoSize, string> = {
    sm: "h-9 w-9 rounded-lg text-sm",
    md: "h-11 w-11 rounded-xl text-base",
    lg: "h-14 w-14 rounded-xl text-lg",
    xl: "h-20 w-20 rounded-2xl text-3xl sm:h-24 sm:w-24",
};

interface CompanyLogoProps {
    name: string;
    size?: LogoSize;
    className?: string;
}

/** Deterministic, colorful initials avatar for a company. Server-safe. */
export default function CompanyLogo({ name, size = "md", className }: CompanyLogoProps) {
    const { bg, ring } = companyColor(name);
    return (
        <div
            className={cn(
                "flex shrink-0 items-center justify-center font-semibold text-white ring-2",
                bg,
                ring,
                SIZES[size],
                className
            )}
            aria-hidden
        >
            {initial(name)}
        </div>
    );
}
