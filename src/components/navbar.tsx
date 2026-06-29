import Link from "next/link";
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
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16 gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0 group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 group-hover:bg-blue-700 transition-colors">
                            <Briefcase className="h-4 w-4 text-white" />
                        </div>
                        <span className="hidden sm:block text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            ApplyEase
                        </span>
                    </Link>

                    {/* Search — client component */}
                    <NavbarSearch />

                    {/* Desktop nav actions */}
                    <nav className="hidden md:flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/saved" className="gap-1.5">
                                <Bookmark className="h-4 w-4" />
                                Saved
                            </Link>
                        </Button>

                        {user?.company && (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/company/${user.company.id}`} className="gap-1.5">
                                        <Building className="h-4 w-4" />
                                        My Company
                                    </Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/addJob" className="gap-1.5">
                                        <Plus className="h-4 w-4" />
                                        Post a Job
                                    </Link>
                                </Button>
                            </>
                        )}

                        {!user?.company && (
                            <AddCompany />
                        )}
                    </nav>

                    {/* User menu — client component (desktop) */}
                    <div className="hidden md:block shrink-0">
                        <NavbarUserMenu user={user} />
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
