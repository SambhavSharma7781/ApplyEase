//@ts-nocheck
import { getUserFromCookies } from "@/helper";
import prismaClient from "@/services/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getUserFromCookies();
        console.log("user" ,user);
        
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            });
        }

        const data = user

        return NextResponse.json({
            success: true,
            data: data,
        });
    } catch (error) {
        console.error(" API error in /api/current-user:", error);

        return NextResponse.json({
            success: false,
            message: "Internal server error",
            error: error?.message || error,
        }, { status: 500 });
    }
}