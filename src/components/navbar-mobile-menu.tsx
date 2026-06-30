"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Briefcase, Bookmark, ClipboardList, Building, LogOut, Plus } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types/index";

interface NavbarMobileMenuProps {
    user: User | null;
}

export default function NavbarMobileMenu({ user }: NavbarMobileMenuProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    async function handleLogout() {
        setOpen(false);
        try {
            await fetch("/api/logout", { method: "POST", credentials: "include" });
        } finally {
            router.refresh();
            setTimeout(() => {
                router.push("/login");
            }, 300);
        }
    }

    function NavLink({
        href,
        icon: Icon,
        children,
    }: {
        href: string;
        icon: React.ElementType;
        children: React.ReactNode;
    }) {
        return (
            <Link
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50/60 hover:text-blue-700 transition-colors duration-150 min-h-[44px]"
            >
                <Icon className="h-4.5 w-4.5 text-gray-500" />
                {children}
            </Link>
        );
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    aria-label="Open navigation menu"
                    className="rounded-lg p-2.5 text-gray-600 hover:bg-gray-100 transition-colors duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-6">
                <SheetHeader className="px-1 pb-4">
                    <SheetTitle className="flex items-center gap-2.5 text-base">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm">
                            <Briefcase className="h-4 w-4 text-white" />
                        </div>
                        ApplyEase
                    </SheetTitle>
                    {user?.email && (
                        <p className="text-xs text-muted-foreground truncate pt-1">{user.email}</p>
                    )}
                </SheetHeader>

                <Separator />

                <nav className="flex flex-col gap-0.5 py-4">
                    <NavLink href="/" icon={Briefcase}>Browse Jobs</NavLink>
                    {user?.role !== 'employer' && (
                        <>
                            <NavLink href="/saved" icon={Bookmark}>Saved Jobs</NavLink>
                            <NavLink href="/applied-jobs" icon={ClipboardList}>Applied Jobs</NavLink>
                        </>
                    )}

                    {user?.company && (
                        <NavLink href={`/company/${user.company.id}`} icon={Building}>
                            My Company
                        </NavLink>
                    )}
                    {user?.company && (
                        <NavLink href="/addJob" icon={Plus}>Post a Job</NavLink>
                    )}
                </nav>

                <Separator />

                <div className="pt-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150 min-h-[44px]"
                    >
                        <LogOut className="h-4.5 w-4.5" />
                        Logout
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
