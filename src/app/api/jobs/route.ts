
import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const user = await getUserFromCookies()
    const body = await request.json();

    // const dataToSave = {
    //     ...body,
    //     companyId: user?.company?.id
    // }
    try {
        const data = await prismaClient.openings.create({
            data: body
        })
        return NextResponse.json({
            success: true,
            message: "Job added successfully",
            job: data
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to add job"
        })
    }
}
