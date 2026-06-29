//@ts-nocheck
'use client'
import { userContext } from "@/components/client-providers";
import { toast } from "sonner";
import { useContext } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteBtn({ job }) {
    const { user } = useContext(userContext);

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

        try {
            const res = await fetch("/api/job/" + job.id, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                toast.success("Job deleted successfully");
                window.location.reload();
            } else {
                toast.error(`Failed to delete job: ${data.message || 'Unknown error'}`);
            }
        } catch {
            toast.error("Network error while deleting job");
        }
    }

    if (user?.company?.id !== job?.company?.id) return null;

    return (
        <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
        >
            <Trash2 size={16} />
            Delete
        </button>
    );
}
