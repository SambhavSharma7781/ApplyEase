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
        <div className="min-h-screen bg-slate-50 relative">
            <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
                <div className="flex flex-col lg:flex-row gap-8">
                    <Suspense fallback={<div className="w-full lg:w-72 h-[450px] shimmer rounded-3xl border border-transparent bg-white shadow-xl shadow-gray-200/50" />}>
                        <Sidebar />
                    </Suspense>
                    <div className="flex-1 min-w-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
