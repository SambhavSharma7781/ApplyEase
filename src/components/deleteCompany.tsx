//@ts-nocheck
'use client'
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteCompany({ companyId }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-all duration-200 hover:bg-red-100 active:scale-[0.97]"
            >
                <Trash2 size={16} />
                Delete Company
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">Delete Company?</DialogTitle>
                        <DialogDescription className="text-center">
                            This will permanently remove the company and all its job listings. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:justify-center">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={loading}>Cancel</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? "Deleting…" : "Delete Company"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
