//@ts-nocheck
import { generateToken } from "@/services/jwt";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    const body = await request.json();
    const userToCreate ={
        email: body.email,
        password: body.password,
    }

    try{
        const user = await prismaClient.user.create({
            data: userToCreate,
        });
        const userTokenData = {
            id: user.id
        }

        const token = generateToken(userTokenData)
        
        // Success response instead of redirect
        const res = NextResponse.json({
            success: true,
            message: "User created successfully",
            user: { id: user.id, email: user.email }
        });
        res.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return res;

    } catch(error) {
        console.error("Error creating user:", error);   
        return NextResponse.json({
            success: false,
            message: "Failed to create user",
            error: error?.message || "Internal server error"
        }, { status: 500 });
    }
}