//@ts-nocheck
'use client'
import { userContext } from "@/app/(group)/layout";
import { Button, Flex } from "@radix-ui/themes";
import { useContext } from "react";

export default function DeleteBtn({job}){
    const {user}= useContext(userContext)

    async function handleDelete(){
        try{
            const res = await fetch("/api/job/" + job.id , {
                method: "DELETE"
            }
            )
            const data = await res.json()
            if(data.success){
                alert("Job deleted successfully")
            } else{
                alert("Something went wrong")
            }
        } catch (err){
            alert("Something went wrong in code")
        }
    }   

    if(user?.company.id == job?.company.id){
        return(
            <div className="flex gap-2.5">
                <Button color="red" onClick={handleDelete}>Delete</Button>
            </div>
        )
    } else{
        return null;
    }
}