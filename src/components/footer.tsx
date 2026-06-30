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
        <footer className="bg-white border-t border-gray-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-200 shadow-sm">
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
                        <ul className="space-y-3">
                            {jobSeekerLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-150"
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
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-150"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 sm:my-10" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <p>© 2026 ApplyEase. All rights reserved.</p>
                    <p className="text-xs">Built with 💙 and a lot of late nights!</p>
                </div>
            </div>
        </footer>
    );
}
