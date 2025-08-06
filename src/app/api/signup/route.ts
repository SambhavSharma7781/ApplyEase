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
        const res = NextResponse.redirect("http://localhost:3000");
        res.cookies.set('token' ,token)

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