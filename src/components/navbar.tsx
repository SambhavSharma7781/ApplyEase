"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Briefcase, Bookmark, Plus, Building } from "lucide-react";
import NavbarSearch from "@/components/navbar-search";
import NavbarUserMenu from "@/components/navbar-user-menu";
import NavbarMobileMenu from "@/components/navbar-mobile-menu";
import { Button } from "@/components/ui/button";
import { User } from "@/types/index";
import AddCompany from "@/components/addCompany";

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== "undefined") {
                const currentScrollY = window.scrollY;
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Scrolling down (past 100px threshold)
                    setIsVisible(false);
                } else {
                    // Scrolling up
                    setIsVisible(true);
                }
                setLastScrollY(currentScrollY);
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("scroll", controlNavbar, { passive: true });
            return () => window.removeEventListener("scroll", controlNavbar);
        }
    }, [lastScrollY]);

    return (
        <header 
            className={`sticky top-4 z-50 mx-4 md:mx-auto max-w-7xl bg-white/75 backdrop-blur-xl border border-white shadow-xl shadow-indigo-900/5 rounded-3xl transition-all duration-500 will-change-transform ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-[150%] opacity-0 pointer-events-none"
            }`}
        >
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Left: Logo */}
                    <div className="flex items-center shrink-0">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 group-hover:shadow-glow group-hover:scale-105 transition-all duration-300 shadow-sm">
                                <Briefcase className="h-4.5 w-4.5 text-white" />
                            </div>
                            <span className="hidden sm:block text-[15px] font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-violet-600 transition-colors duration-300">
                                ApplyEase
                            </span>
                        </Link>
                    </div>

                    {/* Center: Search */}
                    <div className="flex-1 flex justify-center max-w-2xl px-2 sm:px-4">
                        <NavbarSearch />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <nav className="hidden md:flex items-center gap-1.5">
                            {user?.role !== 'employer' && (
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/saved" className="gap-1.5">
                                        <Bookmark className="h-4 w-4" />
                                        Saved
                                    </Link>
                                </Button>
                            )}

                            {user?.role === 'employer' && user?.company && (
                                <>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/company/${user.company.id}`} className="gap-1.5">
                                            <Building className="h-4 w-4" />
                                            My Company
                                        </Link>
                                    </Button>
                                    <Button size="sm" asChild className="shadow-sm">
                                        <Link href="/addJob" className="gap-1.5">
                                            <Plus className="h-4 w-4" />
                                            Post a Job
                                        </Link>
                                    </Button>
                                </>
                            )}

                            {user?.role === 'employer' && !user?.company && (
                                <AddCompany />
                            )}
                        </nav>

                        {/* User menu — desktop */}
                        <div className="hidden md:block">
                            <NavbarUserMenu user={user} />
                        </div>
                    </div>

                    {/* Mobile hamburger — client component */}
                    <div className="md:hidden ml-auto shrink-0">
                        <NavbarMobileMenu user={user} />
                    </div>
                </div>
            </div>
        </header>
    );
}
