'use client'
import { useContext, useEffect, useState } from "react"
import { Dialog, Button, Card, Badge, Spinner, Avatar } from "@radix-ui/themes"
import { Users, Mail, Eye } from "lucide-react"
import { userContext } from "@/app/(group)/layout";

interface Job {
    id: string;
    company: {
        id: string;
    };
}

interface Applicant {
    id: string;
    user: {
        email: string;
    };
}

export default function ViewJobApplicants({ job }: { job: Job }) {
    const context = useContext(userContext)
    const user = context?.user
    const [applicants, setApplicants] = useState<Applicant[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        async function getApplications() {
            setIsLoading(true)
            try {
                const res = await fetch('/api/applicants/' + job.id)
                const data = await res.json()
                if (data?.success) {
                    setApplicants(data?.data)
                }
            } catch (error) {
                console.error('Failed to fetch applicants:', error)
            } finally {
                setIsLoading(false)
            }
        }
        getApplications()
    }, [job.id])

    async function handleDelete(id: string) {  
        try{
            const res = await fetch('/api/applicants/' + id , {
                method: "DELETE"
            }) 
            const data = await res.json();
            if(data.success){
                alert("Application deleted successfully")
            } else{
                alert("Failed")
            }
        } catch(err) {
            console.error("Error deleting application:", err)
        }

    }
    if(user?.company?.id !== job?.company?.id) {
        return null
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button 
                    variant="solid" 
                    color="blue"
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                    <Eye size={16} />
                    View Applicants
                </Button>
            </Dialog.Trigger>

            <Dialog.Content 
                maxWidth="500px" 
                className="max-h-[85vh] overflow-hidden flex flex-col"
            >
                <Dialog.Title className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <span>Job Applicants</span>
                        <div className="text-sm text-gray-500 font-normal">
                            {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </Dialog.Title>

                <Dialog.Description size="2" className="mb-4 text-gray-600">
                    View all applicants who applied for this job position.
                </Dialog.Description>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Spinner size="3" />
                                <span className="text-sm">Loading applicants...</span>
                            </div>
                        </div>
                    ) : applicants.length > 0 ? (
                        <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2">
                            {applicants.map((application, index) => (
                                <Card 
                                    key={application.id}
                                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            size="3"
                                            fallback={application.user.email.charAt(0).toUpperCase()}
                                            className="bg-gradient-to-br from-blue-500 to-blue-600"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Mail size={14} className="text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                    {application.user.email}
                                                    <Button onClick={() => handleDelete(application.id)}>Delete</Button>
                                                </span>
                                            </div>
                                            <Badge variant="soft" color="gray" size="1">
                                                Applicant #{index + 1}
                                            </Badge>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="1"
                                                className="text-gray-400 hover:text-blue-600"
                                            >
                                                <Mail size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Users size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No applicants yet
                            </h3>
                            <p className="text-sm text-gray-500 max-w-xs">
                                When people apply for this job, they'll appear here.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {applicants.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                Total: {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
                            </span>
                            <Dialog.Close>
                                <Button variant="soft" color="gray">
                                    Close
                                </Button>
                            </Dialog.Close>
                        </div>
                    </div>
                )}
            </Dialog.Content>
        </Dialog.Root>
    )
}