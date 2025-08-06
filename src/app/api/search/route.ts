//@ts-nocheck
import data from "@/data";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || "";
    const jt = searchParams.get('jt') || "";
    const et = searchParams.get('et') || "";
    
    // Build where condition
    const whereCondition = {
        AND: []
    };

    // Add search query filter
    if (q) {
        whereCondition.AND.push({
            OR: [
                {
                    title: {
                        contains: q,
                        mode: 'insensitive'
                    }
                },
                {
                    company: {
                        name: {
                            contains: q,
                            mode: "insensitive"
                        }
                    }
                }
            ]
        });
    }

    // Add job type filter (work location)
    if (jt) {
        whereCondition.AND.push({
            job_type: jt
        });
    }

    // Add employment type filter
    if (et) {
        whereCondition.AND.push({
            employment_Type: et
        });
    }

    const jobs = await prismaClient.openings.findMany({
        where: whereCondition.AND.length > 0 ? whereCondition : {},
        include: {
            company: true
        }
    });

    if (jobs.length === 0) {
        return NextResponse.json({
            success: false,
            message: "No job found",
            jobs: [],
        });
    }

    return NextResponse.json({
        success: true,
        message: "Jobs fetched successfully",
        jobs,
    });
}