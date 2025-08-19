//@ts-nocheck
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }) {

    const { id } = await params;

    try {
        const job = await prismaClient.openings.findUnique({
            where: {
                id: id
            },
            include:{
                company: true
            }
        });

        if (!job) {
            return NextResponse.json({
                success: false,
                message: "Job not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            job: job
        });
    }
    catch (error) {
        console.error("🔥 API error in /api/job/[id]:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            error: error?.message || error,
        }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest, { params }) {
    try {
        const { id: jobId } = await params;
        
        console.log('Attempting to delete job with ID:', jobId);

        // First check if job exists
        const existingJob = await prismaClient.openings.findUnique({
            where: { id: jobId }
        });

        if (!existingJob) {
            return NextResponse.json({
                success: false,
                message: "Job not found"
            }, { status: 404 });
        }

        // Delete related applications first (if any)
        await prismaClient.applications.deleteMany({
            where: { job_id: jobId }
        });

        // Delete related saved jobs (if any)
        await prismaClient.savedJobs.deleteMany({
            where: { job_id: jobId }
        });

        // Now delete the job
        const deletedJob = await prismaClient.openings.delete({
            where: { id: jobId }
        });

        console.log('Job deleted successfully:', deletedJob);

        return NextResponse.json({
            success: true,
            message: "Job deleted successfully",
            data: deletedJob
        });

    } catch (error) {
        console.error('Error deleting job:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete job",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }) {
    try {
        const { id: jobId } = await params;
        const body = await req.json();
        
        console.log('Updating job with ID:', jobId, 'Data:', body);

        const updatedJob = await prismaClient.openings.update({
            where: { id: jobId },
            data: body
        });

        return NextResponse.json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob
        });
    } catch (error) {
        console.error('Error updating job:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to update job",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}