import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromCookies();
    const { id: jobId } = await params;

    if(!user){
        return NextResponse.json({
            success: false,
            message: "User is not authenticated"
        })
    }

    const applicationsToSave = {
        user_id: user?.id,
        job_id: jobId
    }

    try {
        const applications = await prismaClient.applications.create({
            data: applicationsToSave
        })

        return NextResponse.json({
            success: true ,
            data: applications
        })

    } catch(err: any) {
        console.log(err.message)
        return NextResponse.json({
            success: false,
            data :{
                message: "Failed to create applications"
            }
        })
    }
}