import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: companyId } = await params;

    try {
        const reviews = await prismaClient.review.findMany({
            where: {
                company_id: companyId
            },
            include: {
                user: true 
            }
        });
        
        return NextResponse.json({
            success: true,
            data: reviews
        });
    } catch (err: unknown) {
        console.log((err as Error).message);
        return NextResponse.json({
            success: false,
            message: "Something went wrong in the code"
        });
    }
}