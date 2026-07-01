"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Container } from "@/components/ui/container";
import { User } from "@/types/index";
import { toast } from "sonner";

const productLinks = [
  { label: "Browse Jobs", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Saved Jobs", href: "/saved" },
  { label: "Applied Jobs", href: "/applied-jobs" },
];

const resourceLinks = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string; onClick?: (e: React.MouseEvent) => void }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
        {heading}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              onClick={link.onClick}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-150"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ user }: { user?: User | null }) {
  const companyLinks = [
    { label: "Post a Job", href: "/addJob" },
    {
      label: "My Company",
      href: user?.company?.id ? `/company/${user.company.id}` : "#",
      onClick: (e: React.MouseEvent) => {
        if (!user?.company?.id) {
          e.preventDefault();
          toast("No company found", {
            description: "You don't have a company yet. Create one to access your company dashboard."
          });
        }
      }
    },
    { label: "All Companies", href: "/company" },
  ];

  return (
    <footer className="bg-[#09090B] border-t border-white/[0.06]">
      <Container className="py-16 lg:py-20">
        {/* Main grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-4 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#4F46E5] group-hover:bg-[#4338CA] transition-colors duration-150">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">
                ApplyEase
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-[220px]">
              Where your next role begins.
            </p>
          </div>

          <FooterColumn heading="Product" links={productLinks} />
          <FooterColumn heading="Companies" links={companyLinks} />
          <FooterColumn heading="Resources" links={resourceLinks} />
        </div>

        {/* Bottom bar — copyright only, links live in columns above */}
        <div className="mt-14 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} ApplyEase. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
