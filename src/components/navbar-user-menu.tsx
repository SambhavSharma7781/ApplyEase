"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Briefcase } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/index";

interface NavbarUserMenuProps {
    user: User | null;
}

export default function NavbarUserMenu({ user }: NavbarUserMenuProps) {
    const router = useRouter();

    async function handleLogout() {
        try {
            await fetch("/api/logout", { method: "POST", credentials: "include" });
        } finally {
            router.refresh();
            setTimeout(() => {
                router.push("/login");
            }, 300);
        }
    }

    const initials = user?.email?.charAt(0).toUpperCase() ?? "?";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="rounded-full ring-2 ring-transparent hover:ring-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
                    aria-label="Open profile menu"
                >
                    <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal px-3 py-2.5">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="truncate text-sm font-medium mt-0.5">{user?.email ?? "User"}</p>
                    {user?.role && (
                        <div className="mt-1.5">
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize">
                                {user.role === 'candidate' ? 'Job Seeker' : 'Employer'}
                            </span>
                        </div>
                    )}
                </DropdownMenuLabel>
                {user?.role !== 'employer' && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/applied-jobs" className="cursor-pointer">
                                <Briefcase className="mr-2 h-4 w-4" />
                                Applied Jobs
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
