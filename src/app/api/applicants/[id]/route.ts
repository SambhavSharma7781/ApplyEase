//@ts-nocheck
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest , {params}){
    const job_id = params.id

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