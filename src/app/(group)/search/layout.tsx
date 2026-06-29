import type { Metadata } from "next";
import { Suspense } from "react";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
    title: "Search Jobs — ApplyEase",
    description: "Search and filter jobs by type, location, and employment type.",
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <Suspense fallback={<div className="w-72 animate-pulse bg-gray-100 rounded-xl h-64" />}>
                    <Sidebar />
                </Suspense>
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
