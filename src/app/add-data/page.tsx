//@ts-nocheck
import data from "@/data";
import prismaClient from "@/services/prisma";
export default function AddDataPage() {
    async function addData() {
        'use server'
        const newData = data.data.map((elem) => {
            return {
                title: elem.job_title,
                description: elem.job_description,
                location: elem.job_location,
                salary: 200000,
            }
        })
        try {
            await prismaClient.openings.createMany({
                data: newData
            })
            return {
                success: true,
                message: "Data added successfully"
            }
        }
        catch (error) {
            return {
                success: false,
                message: "Failed to add data"
            }
        }
    }
    return (
        <button onClick={addData}>Add Data</button>
    )

}
