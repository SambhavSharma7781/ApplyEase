//@ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully"
        });
        
        response.cookies.set("token", "");
        return response;
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to logout"
        });
    }
}
