// @ts-nocheck
'use client'

import { useContext, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { userContext } from '@/components/client-providers';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';

export default function EditBtn({ job }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(job?.title || '');
    const [description, setDescription] = useState(job?.description || '');
    const [loading, setLoading] = useState(false);
    const context = useContext(userContext);

    if (!context || !job) return null;
    const { user } = context;
    if (!user || user?.company?.id !== job?.company?.id) return null;

    async function handleUpdate() {
        setLoading(true);
        try {
            const res = await fetch("/api/job/" + job.id, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Job updated successfully");
                setOpen(false);
                window.location.reload();
            } else {
                toast.error("Something went wrong: " + (data.message || ""));
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.97]"
            >
                <Pencil size={16} />
                Edit Job
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                <Pencil className="h-5 w-5 text-blue-600" />
                            </div>
                            <DialogTitle>Edit Job Details</DialogTitle>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-title">Job Title</Label>
                            <Input
                                id="edit-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter the job title"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-desc">Description</Label>
                            <Textarea
                                id="edit-desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter the job description"
                                rows={5}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleUpdate} disabled={loading}>
                            {loading ? "Saving…" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
