//@ts-nocheck
'use client'
import { userContext } from "@/components/client-providers";
import { toast } from "sonner";
import { useContext, useState } from "react";
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

export default function DeleteBtn({ job }) {
    const { user } = useContext(userContext);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        setLoading(true);
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
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    if (user?.company?.id !== job?.company?.id) return null;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-all duration-200 hover:bg-red-100 active:scale-[0.97]"
            >
                <Trash2 size={16} />
                Delete
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">Delete Job?</DialogTitle>
                        <DialogDescription className="text-center">
                            This will permanently remove this job listing. This action cannot be undone.
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
                            {loading ? "Deleting…" : "Delete Job"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
