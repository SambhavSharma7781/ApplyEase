import { NextRequest, NextResponse } from "next/server";
// Make sure to import your prisma client instance
import prismaClient from "@/services/prisma"; 
import { getUserFromCookies } from "@/helper";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: companyId } = await params;

        const company = await prismaClient.company.findUnique({
            where: {
                id: companyId
            },
            include :{
                owner : true
            }
        });

        if (!company) {
            return NextResponse.json({
                success: false,
                message: "Company not found."
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: company
        });

    } catch (error) {
        console.error("[COMPANY_GET_API_ERROR]", error);
        return NextResponse.json({
            success: false,
            message: "An internal server error occurred."
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: companyId } = await params;
    const user = await getUserFromCookies();
    
    if (user?.company?.id == companyId) {
        const res = await prismaClient.company.delete({
            where: {
                id: companyId
            }
        });
        console.log("Company deleted:", res);
        return NextResponse.json({
            success: true,
            res
        })
    }
}