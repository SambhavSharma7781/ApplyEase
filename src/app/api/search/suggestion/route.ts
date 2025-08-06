import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";
import { title } from "process";

export async function GET(request: NextRequest) {
    const sp = request.nextUrl.searchParams;
    const query = sp.get("q") || "";
    console.log("Search query:", query);
    if (!query) {
        return NextResponse.json({
            success: true,
            suggestions: []
        });
    }

    const sugg = await prismaClient.openings.findMany({
        where: {
            title: {
                contains: query,
                mode: "insensitive"
            }
        },
        select: {
            id: true,
            title: true
        },
        take: 10,
    });
    console.log("Query:", query);
// console.log("Matching jobs:", sugg);

    return NextResponse.json({
        success: true,
        suggestions: sugg
    });
}