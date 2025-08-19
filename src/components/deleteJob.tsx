//@ts-nocheck
'use client'
import { userContext } from "@/app/(group)/layout";
import { Button, Flex } from "@radix-ui/themes";
import { useContext } from "react";

export default function DeleteBtn({job}){
    const {user}= useContext(userContext)

    async function handleDelete(){
        if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            return;
        }

        try{
            console.log('Deleting job:', job.id);
            
            const res = await fetch("/api/job/" + job.id, {
                method: "DELETE"
            });
            
            console.log('Delete response status:', res.status);
            const data = await res.json();
            console.log('Delete response data:', data);
            
            if(data.success){
                alert("Job deleted successfully!");
                // Refresh the page to update the job list
                window.location.reload();
            } else {
                alert(`Failed to delete job: ${data.message || 'Unknown error'}`);
            }
        } catch (error){
            console.error('Error deleting job:', error);
            alert("Network error occurred while deleting job");
        }
    }   

    if(user?.company?.id === job?.company?.id){
        return(
            <div className="flex gap-2.5">
                <Button color="red" onClick={handleDelete}>Delete</Button>
            </div>
        )
    } else{
        return null;
    }
}