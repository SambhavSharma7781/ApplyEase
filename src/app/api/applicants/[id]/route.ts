//@ts-nocheck
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest , {params}){
    const { id: job_id } = await params;

    try {
        const res = await prismaClient.applications.findMany({
            where:{
                job_id
            },
            include : {
                user: true
            }    
        })
        return NextResponse.json({
            success: true,
            data: res
        })
    } catch (err){
        console.log(err.message)
        return NextResponse.json({
            success: false,
            data: {
                message: "Failed to view applications"
            }
        })
    }
}

export async function DELETE (req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: jobId } = await params;

    try {
        const res = await prismaClient.applications.delete({
            where: {
                id
            }
        });

        if (!res) {
            return NextResponse.json({
                success: false,
                message: "Job not found"
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data: res
        });
    } catch(err){
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        })
    }    
}    