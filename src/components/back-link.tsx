import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
    href: string;
    label: string;
}

/** Consistent "← Back to …" navigation used across detail pages. */
export default function BackLink({ href, label }: BackLinkProps) {
    return (
        <Link
            href={href}
            className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-150 hover:text-blue-600"
        >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {label}
        </Link>
    );
}
