//@ts-nocheck
"use client";
import { userContext } from "@/app/(group)/layout";
import { Company, Review } from "@/generated/prisma";
import { Tabs, Text, Box, Button, Card, Badge } from "@radix-ui/themes";
import { useContext, useState } from "react";
import { Briefcase, Star, MessageSquare } from "lucide-react";

export default function CompanyReviewsAndJobsContainer({ company, reviews } : {
    company  : Company,
    reviews : Review[]
} ) {
  const [review, setReview] = useState<String>("");
  const [reviewList, setReviewList] = useState<Review[]>(reviews);
  const [activeTab, setActiveTab] = useState<'jobs' | 'reviews'>('jobs');
  const {user} = useContext(userContext);

  async function handleCreateReview() {

    try{

        const reviewToSave = {
          content: review,
          company_id:  company.id,
        }

        const finalReview = {
            ...reviewToSave,
            user
        }
    
        const res = await fetch("/api/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewToSave),
        });
    
        const data = await res.json();
    
        if (data.success) {
          setReviewList([finalReview , ...reviewList]); 
        } else {
          alert("Failed to add");
        }
    }  catch(err){
        alert("Something went wrong in the code")
    }
  }

  return (
    <div className="w-full">
      {/* Custom Tab Header */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'jobs'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Briefcase size={16} />
            Listed Jobs
          </div>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reviews'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <MessageSquare size={16} />
            Reviews
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Latest Listed Jobs</h3>
          </div>
          
          {company.jobs && company.jobs.length > 0 ? (
            <div className="space-y-4">
              {company.jobs.map((job) => (
                <div key={job.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h4>
                  <p className="text-gray-700 leading-relaxed line-clamp-3">{job.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Full-time
                      </span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No jobs posted yet</p>
              <p className="text-gray-500 text-sm">This company hasn't posted any job openings.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Add Review Section */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={20} className="text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Share Your Experience</h3>
            </div>
            
            <div className="space-y-4">
              <textarea
                placeholder="Write your review about this company..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-gray-900 placeholder-gray-500"
              />
              <button 
                onClick={handleCreateReview}
                disabled={!review.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Submit Review
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star size={20} className="text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Company Reviews ({reviewList.length})
              </h3>
            </div>
            
            {reviewList && reviewList.length > 0 ? (
              <div className="space-y-4">
                {reviewList.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {review.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{review.user?.email || 'Anonymous'}</p>
                          <p className="text-xs text-gray-500">Verified Employee</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No reviews yet</p>
                <p className="text-gray-500 text-sm">Be the first to share your experience with this company.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}