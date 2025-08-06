import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const user = await getUserFromCookies();
    const body = await request.json();

    if (!user) {
        return NextResponse.json({
            success: false,
            message: "User is not authenticated"
        });
    }

    try {
        const deletedSavedJob = await prismaClient.savedJobs.deleteMany({
            where: {
                user_id: user?.id,
                job_id: body.jobId
            }
        });

        return NextResponse.json({
            success: true,
            data: deletedSavedJob
        });

    } catch (err: any) {
        console.log(err.message);
        return NextResponse.json({
            success: false,
            data: {
                message: "Failed to unsave job"
            }
        });
    }
}
