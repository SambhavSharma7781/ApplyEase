import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const user = await getUserFromCookies();

    if (!user) {
        return NextResponse.json({
            success: false,
            message: "User is not authenticated"
        });
    }

    try {
        const savedJobsData = await prismaClient.savedJobs.findMany({
            where: {
                user_id: user?.id
            }
        });

        // Get the actual job details for each saved job
        const jobIds = savedJobsData.map(savedJob => savedJob.job_id);
        
        const jobs = await prismaClient.openings.findMany({
            where: {
                id: {
                    in: jobIds
                }
            },
            include: {
                company: true
            }
        });

        return NextResponse.json({
            success: true,
            savedJobs: jobs
        });

    } catch (err: any) {
        console.log(err.message);
        return NextResponse.json({
            success: false,
            data: {
                message: "Failed to fetch saved jobs"
            }
        });
    }
}
