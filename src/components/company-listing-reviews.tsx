//@ts-nocheck
"use client";
import { userContext } from "@/components/client-providers";
import { Company, Review } from "@/generated/prisma";
import { useContext, useState } from "react";
import { Briefcase, Star, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function CompanyReviewsAndJobsContainer({ company, reviews }: {
    company: Company;
    reviews: Review[];
}) {
    const [review, setReview] = useState("");
    const [reviewList, setReviewList] = useState<Review[]>(reviews);
    const [activeTab, setActiveTab] = useState<'jobs' | 'reviews'>('jobs');
    const [submitting, setSubmitting] = useState(false);
    const { user } = useContext(userContext);

    async function handleCreateReview() {
        if (!review.trim()) return;
        setSubmitting(true);
        try {
            const reviewToSave = { content: review, company_id: company.id };
            const res = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reviewToSave),
            });
            const data = await res.json();
            if (data.success) {
                const finalReview = { ...reviewToSave, id: data.id || Date.now().toString(), user };
                setReviewList([finalReview, ...reviewList]);
                setReview("");
                toast.success("Review submitted!");
            } else {
                toast.error("Failed to submit review");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="w-full">
            {/* Tab header */}
            <div className="mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1">
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 px-4 text-sm font-medium transition-colors ${
                        activeTab === 'jobs' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <Briefcase size={16} /> Listed Jobs
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 px-4 text-sm font-medium transition-colors ${
                        activeTab === 'reviews' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <MessageSquare size={16} /> Reviews
                </button>
            </div>

            {activeTab === 'jobs' && (
                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <Briefcase size={20} className="text-blue-600" /> Listed Jobs
                    </h3>
                    {company.jobs && company.jobs.length > 0 ? (
                        <div className="space-y-3">
                            {company.jobs.map((job) => (
                                <div key={job.id} className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition-colors hover:border-gray-300">
                                    <h4 className="mb-1 text-base font-semibold text-gray-900">{job.title}</h4>
                                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">{job.description}</p>
                                    <Link
                                        href={`/job/${job.id}`}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <Briefcase size={40} className="mx-auto mb-3 text-gray-300" />
                            <p className="font-medium text-gray-600">No jobs posted yet</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'reviews' && (
                <div className="space-y-6">
                    {/* Add review */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
                            <MessageSquare size={18} className="text-green-600" /> Share Your Experience
                        </h3>
                        <textarea
                            placeholder="Write your review about this company…"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                            onClick={handleCreateReview}
                            disabled={!review.trim() || submitting}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Send size={14} />
                            {submitting ? "Submitting…" : "Submit Review"}
                        </button>
                    </div>

                    {/* Reviews list */}
                    <div>
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Star size={20} className="text-yellow-500" />
                            Reviews ({reviewList.length})
                        </h3>
                        {reviewList.length > 0 ? (
                            <div className="space-y-4">
                                {reviewList.map((r) => (
                                    <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                                                    {r.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{r.user?.email || 'Anonymous'}</p>
                                                    <p className="text-xs text-gray-500">Verified Employee</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm leading-relaxed text-gray-700">{r.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center">
                                <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
                                <p className="font-medium text-gray-600">No reviews yet</p>
                                <p className="text-sm text-gray-500">Be the first to share your experience.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
