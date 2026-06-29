"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Suggestion {
    id: string;
    title: string;
}

export default function NavbarSearch() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            setOpen(false);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search/suggestion?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (data.success && data.suggestions.length > 0) {
                    setSuggestions(data.suggestions);
                    setOpen(true);
                } else {
                    setSuggestions([]);
                    setOpen(false);
                }
            } catch {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            setOpen(false);
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    }

    return (
        <div ref={containerRef} className="relative flex-1 max-w-md">
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search jobs, companies..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => suggestions.length > 0 && setOpen(true)}
                        className="pl-9 pr-4 h-9 bg-gray-50 border-gray-200 focus:bg-white text-sm"
                        autoComplete="off"
                    />
                </div>
            </form>

            {open && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                    <ul className="max-h-56 overflow-y-auto py-1">
                        {suggestions.map((s) => (
                            <li key={s.id}>
                                <Link
                                    href={`/search?q=${encodeURIComponent(s.title)}`}
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        setQuery(s.title);
                                        setOpen(false);
                                    }}
                                >
                                    <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                    {s.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
