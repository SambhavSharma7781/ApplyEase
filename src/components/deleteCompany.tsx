//@ts-nocheck
'use client'
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function DeleteCompany({ companyId }) {
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this company? All jobs and data will be removed.')) return;

        try {
            const res = await fetch(`/api/company/${companyId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Server returned error response");
            const data = await res.json();
            if (data.success) {
                toast.success("Company deleted successfully");
                window.location.href = '/company';
            } else {
                toast.error(data.message || "Deletion failed");
            }
        } catch {
            toast.error("Something went wrong while deleting the company");
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
        >
            <Trash2 size={16} />
            Delete Company
        </button>
    );
}
