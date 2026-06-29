import bcrypt from "bcryptjs";
import { generateToken } from "@/services/jwt";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server"

const SALT_ROUNDS = 10;

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.email || !body.password) {
        return NextResponse.json({
            success: false,
            message: "Email and password are required"
        }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

    const userToCreate = {
        email: body.email,
        password: hashedPassword,
    }

    try {
        const user = await prismaClient.user.create({
            data: userToCreate,
        });

        const token = generateToken({ id: user.id });

        const res = NextResponse.json({
            success: true,
            message: "User created successfully",
            user: { id: user.id, email: user.email }
        });
        res.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        });

        return res;

    } catch (error: unknown) {
        console.error("Error creating user:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to create user"
        }, { status: 500 });
    }
}
