//@ts-nocheck
'use client'
import React, { useEffect, useContext, useState } from 'react';
import { Building, CircleUserRound, Plus, Search, Briefcase, Bookmark, LogOut } from 'lucide-react';
import { userContext } from '@/app/(group)/layout';
import AddCompany from './addCompany';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { user } = useContext(userContext);
    const [suggestions, setSuggestions] = React.useState([]);
    const [input, setInput] = React.useState("");
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function getSuggestions() {
            if (!input) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }
            try {
                const res = await fetch(`/api/search/suggestion?q=${input}`);
                const data = await res.json();
                if (data.success) {
                    setSuggestions(data.suggestions);
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
                setSuggestions([]);
            }
        }

        const debounceTimer = setTimeout(() => {
            getSuggestions();
        }, 300); // Debounce API calls

        return () => clearTimeout(debounceTimer);
    }, [input]);

    // Hide suggestions on click outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            // Check if the click is outside the search container
            if (!(e.target as HTMLElement).closest('#search-container')) {
                setShowSuggestions(false);
            }
            // Check if the click is outside the profile dropdown
            if (!(e.target as HTMLElement).closest('#profile-container')) {
                setShowProfileDropdown(false);
            }
        }
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // Logout function
    async function handleLogout() {
        try {
            // Call logout API to clear cookies
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            // Clear localStorage
            localStorage.removeItem('savedJobs');
            localStorage.removeItem('appliedJobs');
            
            // Redirect to login page
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API fails, redirect to login
            router.push('/login');
        }
    }

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-semibold text-sm group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-200">
                            <Briefcase size={18} />
                        </div>
                        <h1 className="hidden sm:block text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            ApplyEase
                        </h1>
                    </Link>
                </div>

                {/* Center: Search */}
                <div id="search-container" className="relative flex-1 max-w-xl mx-4 sm:mx-8">
                    <form action={`/search`} onSubmit={() => setShowSuggestions(false)} className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search jobs, companies..."
                                name="q"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onFocus={() => input && setShowSuggestions(true)}
                                className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-gray-500 text-sm text-gray-900"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors"
                                aria-label="Search"
                            >
                                <Search size={14} />
                            </button>
                        </div>
                    </form>
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg z-50 overflow-hidden">
                            <ul className="max-h-60 overflow-y-auto">
                                {suggestions.map((elem) => (
                                    <li key={elem?.id}>
                                        <Link
                                            href={`/search?q=${encodeURIComponent(elem?.title)}`}
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                            onClick={() => {
                                                setInput(elem?.title);
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Search size={14} className="text-gray-400" />
                                                <span>{elem?.title}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Saved Jobs Link */}
                    <Link 
                        href="/saved"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                        title="View saved jobs"
                    >
                        <Bookmark size={16} />
                        <span className="hidden sm:inline">Saved</span>
                    </Link>

                    {user?.role === "admin" && (
                        <Link 
                            href="/admin/add-job"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">Add Job</span>
                        </Link>
                    )}
                    
                    {!user?.company && user?.role !== "admin" && <AddCompany />}
                    
                    {user?.company && (
                        <Link 
                            href={`/company/${user.company.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors border border-blue-200"
                        >
                            <Building size={16} />
                            <span className="hidden sm:inline">My Company</span>
                        </Link>
                    )}
                    
                    {/* Profile Dropdown */}
                    <div id="profile-container" className="relative">
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Profile menu"
                        >
                            <CircleUserRound size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div className="p-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.email || 'User'}
                                    </p>
                                </div>
                                <div className="p-2">
                                    <Link
                                        href="/applied-jobs"
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                    >
                                        <CircleUserRound size={16} />
                                        View applied jobs  
                                    </Link>


                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}