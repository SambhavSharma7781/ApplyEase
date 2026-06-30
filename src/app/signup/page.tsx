'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("candidate");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill all fields.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                body: JSON.stringify({ email, password, role }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Account created! Welcome to ApplyEase.");
                router.refresh();
                setTimeout(() => {
                    router.push("/");
                }, 300);
            } else {
                setError(data.message || "Failed to create account.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left brand panel */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-12 lg:flex lg:w-[45%]">
                {/* Decorative background shapes */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-800/40 blur-3xl"></div>
                <div className="absolute left-1/2 top-1/2 h-full w-full -translate-y-1/2 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                        <Briefcase size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">ApplyEase</span>
                </div>
                <div>
                    <h2 className="mb-4 text-4xl font-bold leading-tight text-white">
                        Join thousands of job seekers.
                    </h2>
                    <p className="text-lg text-blue-100">
                        Create your free account and discover opportunities tailored to your skills and goals.
                    </p>
                </div>
                <p className="text-sm text-blue-200">© 2026 ApplyEase. All rights reserved.</p>
            </div>

            {/* Right form panel */}
            <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
                <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-both">
                    {/* Mobile logo */}
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                            <Briefcase size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-gray-900">ApplyEase</span>
                    </div>

                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">Create account</h1>
                    <p className="mb-8 text-gray-500">Start your journey with ApplyEase today</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Account Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label
                                    className={`flex cursor-pointer items-center justify-center rounded-lg border py-2.5 text-sm font-medium transition-all ${
                                        role === "candidate"
                                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]"
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="candidate"
                                        checked={role === "candidate"}
                                        onChange={() => setRole("candidate")}
                                        className="sr-only"
                                    />
                                    Job Seeker
                                </label>
                                <label
                                    className={`flex cursor-pointer items-center justify-center rounded-lg border py-2.5 text-sm font-medium transition-all ${
                                        role === "employer"
                                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)]"
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="employer"
                                        checked={role === "employer"}
                                        onChange={() => setRole("employer")}
                                        className="sr-only"
                                    />
                                    Employer
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-10 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
