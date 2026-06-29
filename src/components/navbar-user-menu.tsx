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
            router.push("/login");
            router.refresh();
        }
    }

    const initials = user?.email?.charAt(0).toUpperCase() ?? "?";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Open profile menu"
                >
                    <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="truncate text-sm font-medium">{user?.email ?? "User"}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/applied-jobs" className="cursor-pointer">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Applied Jobs
                    </Link>
                </DropdownMenuItem>
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
