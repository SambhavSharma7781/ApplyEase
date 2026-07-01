import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Container } from "@/components/ui/container";

const productLinks = [
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

const resourceLinks = [
  { label: "About", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
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

export default function Footer() {
  return (
    <footer className="bg-[#09090B] border-t border-white/[0.06]">
      <Container className="py-14 lg:py-16">
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
              The straightforward way to find your next role.
            </p>
          </div>

          <FooterColumn heading="Product" links={productLinks} />
          <FooterColumn heading="Companies" links={companyLinks} />
          <FooterColumn heading="Resources" links={resourceLinks} />
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} ApplyEase. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-zinc-400 transition-colors duration-150">Privacy</Link>
            <Link href="#" className="hover:text-zinc-400 transition-colors duration-150">Terms</Link>
            <Link href="#" className="hover:text-zinc-400 transition-colors duration-150">Contact</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
