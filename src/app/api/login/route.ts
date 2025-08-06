import { generateToken } from "@/services/jwt";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    try {
        const data = await prismaClient.user.findUnique({
            where: {
                email: body.email,
            }
        });

        if (data && data.password == body?.password) {
            const userTokenData = {
                id: data.id
            }
            const token = generateToken(userTokenData)
            const response = NextResponse.json({
                success: true,
                data
            });
            response.cookies.set("token", token);
            return response;
        } else {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to login"
        });
    }
}