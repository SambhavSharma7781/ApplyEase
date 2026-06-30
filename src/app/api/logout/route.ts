//@ts-nocheck
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully"
        });
        
        response.cookies.set("token", "");
        return response;
        
    } catch {
        return NextResponse.json({
            success: false,
            message: "Failed to logout"
        });
    }
}
