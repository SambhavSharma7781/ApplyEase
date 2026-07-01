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
    <div className="min-h-screen bg-background relative">
      {/* Subtle indigo tint — top only, consistent with homepage */}
      <div className="absolute top-0 left-0 w-full h-[360px] bg-gradient-to-b from-indigo-50/60 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop sidebar — hidden on mobile, mobile uses drawer in page */}
          <div className="hidden lg:block lg:w-60 shrink-0">
            <Suspense
              fallback={
                <div className="h-[360px] shimmer rounded-[14px] border border-[#E4E4E7]" />
              }
            >
              <Sidebar />
            </Suspense>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
