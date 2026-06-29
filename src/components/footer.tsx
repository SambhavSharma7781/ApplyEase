import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const jobSeekerLinks = [
    { label: "Browse Jobs", href: "/" },
    { label: "Search", href: "/search" },
    { label: "Saved Jobs", href: "/saved" },
    { label: "Applied Jobs", href: "/applied-jobs" },
];

const companyLinks = [
    { label: "Post a Job", href: "/addJob" },
    { label: "My Company", href: "/company" },
    { label: "All Companies", href: "/company" },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 group-hover:bg-blue-700 transition-colors">
                                <Briefcase className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-base font-bold text-gray-900">ApplyEase</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            The simplest way to find your next role. Discover opportunities from
                            top companies and take the next step in your career.
                        </p>
                    </div>

                    {/* For Job Seekers */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                            For Job Seekers
                        </h3>
                        <ul className="space-y-2.5">
                            {jobSeekerLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Companies */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                            For Companies
                        </h3>
                        <ul className="space-y-2.5">
                            {companyLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} ApplyEase. All rights reserved.</p>
                    <p className="text-xs">Built with Next.js · Prisma · MongoDB</p>
                </div>
            </div>
        </footer>
    );
}
