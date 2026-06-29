"use client"
import Link from "next/link"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Loader2, Briefcase } from "lucide-react"
import { toast } from "sonner"

export default function Signin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success("Welcome back!")
        router.push("/")
      } else {
        setError(data.message || "Login failed.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left brand panel */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-600 to-blue-800 p-12 lg:flex lg:w-[45%]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Briefcase size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">ApplyEase</span>
        </div>
        <div>
          <h2 className="mb-4 text-4xl font-bold leading-tight text-white">
            Your career journey starts here.
          </h2>
          <p className="text-lg text-blue-100">
            Discover thousands of opportunities and take the next step in your professional life.
          </p>
        </div>
        <p className="text-sm text-blue-200">© 2025 ApplyEase. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">ApplyEase</span>
          </div>

          <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
          <p className="mb-8 text-gray-500">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-700">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
