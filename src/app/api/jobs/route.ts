
import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromCookies()
        const body = await request.json();

        console.log('User:', user);
        console.log('Job data received:', body);

        // Validate required fields
        if (!body.title || !body.description || !body.location || !body.salary) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields"
            }, { status: 400 });
        }

        // Check if user has a company
        if (!user?.company?.id) {
            return NextResponse.json({
                success: false,
                message: "User must have a company to create jobs"
            }, { status: 403 });
        }

        const data = await prismaClient.openings.create({
            data: {
                ...body,
                companyId: user.company.id
            }
        });

        console.log('Job created successfully:', data);

        return NextResponse.json({
            success: true,
            message: "Job added successfully",
            job: data
        });
    } catch (error) {
        console.error('Error creating job:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to add job",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
