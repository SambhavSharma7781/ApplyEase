import { Container } from "@/components/ui/container";
import { Briefcase, Building2, LineChart, ArrowRight, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — ApplyEase",
  description: "Learn more about ApplyEase, how we help job seekers find roles and companies hire talent.",
};

export default function AboutPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24">
      <Container>
        {/* Hero Section */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 mb-6">
            Find jobs, track applications, and manage hiring in one place.
          </h1>
          <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
            ApplyEase is an India-based platform built to connect job seekers with employers. Whether you are looking for your next role or trying to build a team, we provide the tools to make the process straightforward and organized.
          </p>
        </div>

        {/* Our Focus & Background */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-4">What We Do</h2>
            <p className="text-zinc-600 leading-relaxed text-sm md:text-base">
              We help candidates find relevant job openings and research potential employers before applying. Once you apply, ApplyEase acts as a central hub where you can track the status of your applications and manage your job search effectively.
            </p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-4">For Employers</h2>
            <p className="text-zinc-600 leading-relaxed text-sm md:text-base">
              Hiring can be complicated, so we designed features specifically for recruiters and companies. You can post job openings, receive applications directly on the platform, and manage candidates as they move through your hiring pipeline.
            </p>
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-16 md:mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">Platform Features</h2>
            <p className="text-zinc-600 text-sm md:text-base">Everything you need to search for jobs or hire candidates.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <FeatureCard
              icon={<Briefcase className="h-6 w-6 text-[#4F46E5]" />}
              title="Discover Jobs"
              description="Search for open roles that match your skill set and location preferences."
            />
            <FeatureCard
              icon={<Building2 className="h-6 w-6 text-[#4F46E5]" />}
              title="Explore Companies"
              description="Read about company details and office locations before submitting an application."
            />
            <FeatureCard
              icon={<ClipboardList className="h-6 w-6 text-[#4F46E5]" />}
              title="Track Applications"
              description="Keep your job search organized. See all your saved jobs and active applications."
            />
            <FeatureCard
              icon={<LineChart className="h-6 w-6 text-[#4F46E5]" />}
              title="Post & Manage"
              description="Employers can list new openings and review candidate profiles directly."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#4F46E5] rounded-3xl p-8 md:p-12 lg:p-16 text-center text-white shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-indigo-100 text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
            Create an account today to begin searching for jobs or posting open roles for your company.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-[#4F46E5] px-6 py-3 rounded-xl font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-sm md:text-base"
          >
            Explore Jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5 md:mb-6 shrink-0">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">{title}</h3>
      <p className="text-zinc-600 text-xs md:text-sm leading-relaxed">{description}</p>
    </div>
  );
}
