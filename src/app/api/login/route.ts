import bcrypt from "bcryptjs";
import { generateToken } from "@/services/jwt";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    try {
        const user = await prismaClient.user.findUnique({
            where: { email: body.email }
        });

        if (!user || !(await bcrypt.compare(body.password, user.password))) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }

        const token = await generateToken({ id: user.id });
        const response = NextResponse.json({
            success: true,
            data: { id: user.id, email: user.email, role: user.role }
        });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        });
        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to login"
        }, { status: 500 });
    }
}
