import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const user = await getUserFromCookies();
    const body = await request.json();

    if (!user) {
        return NextResponse.json({
            success: false,
            message: "User is not authenticated"
        });
    }

    const savedJobToSave = {
        user_id: user?.id,
        job_id: body.jobId
    };

    try {
        const savedJob = await prismaClient.savedJobs.create({
            data: savedJobToSave
        });

        return NextResponse.json({
            success: true,
            data: savedJob
        });

    } catch (err: any) {
        console.log(err.message);
        return NextResponse.json({
            success: false,
            data: {
                message: "Failed to save job"
            }
        });
    }
}
