'use client'
import { useContext, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Users, Mail, Eye, Loader2, Trash2 } from "lucide-react"
import { userContext } from "@/components/client-providers"
import { toast } from "sonner"

interface Job {
    id: string;
    company: { id: string };
}

interface Applicant {
    id: string;
    user: { email: string };
}

export default function ViewJobApplicants({ job }: { job: Job }) {
    const context = useContext(userContext)
    const user = context?.user
    const [open, setOpen] = useState(false)
    const [applicants, setApplicants] = useState<Applicant[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!open) return;
        async function getApplications() {
            setIsLoading(true)
            try {
                const res = await fetch('/api/applicants/' + job.id)
                const data = await res.json()
                if (data?.success) setApplicants(data?.data)
            } catch {
                toast.error('Failed to load applicants')
            } finally {
                setIsLoading(false)
            }
        }
        getApplications()
    }, [open, job.id])

    async function handleDelete(id: string) {
        try {
            const res = await fetch('/api/applicants/' + id, { method: "DELETE" })
            const data = await res.json()
            if (data.success) {
                setApplicants(prev => prev.filter(a => a.id !== id))
                toast.success("Application removed")
            } else {
                toast.error("Failed to remove application")
            }
        } catch {
            toast.error("Something went wrong")
        }
    }

    if (user?.company?.id !== job?.company?.id) return null

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
                <Eye size={16} />
                View Applicants
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                <Users size={16} className="text-blue-600" />
                            </div>
                            Job Applicants
                        </DialogTitle>
                        <DialogDescription>
                            {applicants.length} applicant{applicants.length !== 1 ? 's' : ''} for this position
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[50vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12 gap-2 text-gray-500">
                                <Loader2 size={18} className="animate-spin" />
                                <span className="text-sm">Loading…</span>
                            </div>
                        ) : applicants.length > 0 ? (
                            <div className="space-y-2">
                                {applicants.map((application, index) => (
                                    <div
                                        key={application.id}
                                        className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                                            {application.user.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <Mail size={12} className="text-gray-400 shrink-0" />
                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                    {application.user.email}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">Applicant #{index + 1}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(application.id)}
                                            className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                            title="Remove applicant"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-12 text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                    <Users size={20} className="text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">No applicants yet</p>
                                <p className="text-xs text-gray-500">Applications will appear here.</p>
                            </div>
                        )}
                    </div>

                    {applicants.length > 0 && (
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                            <span className="text-sm text-gray-500">Total: {applicants.length}</span>
                            <DialogClose asChild>
                                <Button variant="outline" size="sm">Close</Button>
                            </DialogClose>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
