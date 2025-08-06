//@ts-nocheck
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }) {

    const id = params.id;

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
            job
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


export async function DELETE(request : NextRequest ,{params}){

    try{
        const jobId = params.id;
        const res = await prismaClient.openings.delete({
            where:{
                id: jobId
            }
        })
        return NextResponse.json({
            success: true,
            data : res
        })

    } catch(err){
        console.log(err.message)
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        })
    }

}

export async function POST(req : NextRequest , {params}){
    const jobId = params.id;
    const body = await req.json();
    try {
        const res = await prismaClient.openings.update({
            where:{
                id : jobId
            },
            data : body
        })

        return NextResponse.json({
            success: true,
            data : res
        })
    }
    catch (err){
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        })
    }
}