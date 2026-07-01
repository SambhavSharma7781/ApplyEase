"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Briefcase, Bookmark, Plus, Building } from "lucide-react";
import NavbarSearch from "@/components/navbar-search";
import NavbarUserMenu from "@/components/navbar-user-menu";
import NavbarMobileMenu from "@/components/navbar-mobile-menu";
import { Button } from "@/components/ui/button";
import { User } from "@/types/index";
import AddCompany from "@/components/addCompany";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 8);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        // Positioning — floating pill
        "sticky top-3 z-50 mx-4 md:mx-auto md:max-w-7xl",
        // Surface — glass morphism
        "glass rounded-2xl",
        // Visible border for elevation clarity against white hero
        "border border-[#E4E4E7]/60",
        // Shadow scales with scroll depth
        scrolled
          ? "shadow-[0_6px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] border-[#E4E4E7]"
          : "shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
        // Slide out on scroll down, slide in on scroll up
        "transition-all duration-300 will-change-transform",
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-[150%] opacity-0 pointer-events-none"
      )}
    >
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-[52px] gap-3">

          {/* ── Logo ── */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-1.5 group">
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#4F46E5] group-hover:bg-[#4338CA] transition-colors duration-150">
                <Briefcase className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="hidden sm:block text-[14px] font-semibold text-[#09090B] tracking-[-0.01em]">
                ApplyEase
              </span>
            </Link>
          </div>

          {/* ── Search — center, capped to avoid stretching on large screens ── */}
          <div className="flex-1 flex justify-center max-w-[380px] sm:max-w-[440px]">
            <NavbarSearch />
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1 shrink-0">
            <nav className="hidden md:flex items-center gap-1">
              {user?.role !== "employer" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="/saved"
                    className={cn(
                      "gap-1.5 text-[13px] font-medium",
                      pathname === "/saved"
                        ? "text-[#4F46E5] bg-[#EEF2FF]"
                        : "text-[#52525B] hover:text-[#09090B] hover:bg-[#F1F1F3]"
                    )}
                  >
                    <Bookmark className="h-4 w-4" />
                    Saved
                  </Link>
                </Button>
              )}

              {user?.role === "employer" && user?.company && (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href={`/company/${user.company.id}`}
                      className={cn(
                        "gap-1.5 text-[13px] font-medium",
                        pathname.startsWith("/company")
                          ? "text-[#4F46E5] bg-[#EEF2FF]"
                          : "text-[#52525B] hover:text-[#09090B] hover:bg-[#F1F1F3]"
                      )}
                    >
                      <Building className="h-4 w-4" />
                      My Company
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[13px] font-medium rounded-[8px] shadow-none"
                  >
                    <Link href="/addJob" className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      Post a Job
                    </Link>
                  </Button>
                </>
              )}

              {user?.role === "employer" && !user?.company && (
                <AddCompany />
              )}
            </nav>

            {/* User menu — desktop */}
            <div className="hidden md:block ml-1">
              <NavbarUserMenu user={user} />
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden ml-auto shrink-0">
            <NavbarMobileMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
