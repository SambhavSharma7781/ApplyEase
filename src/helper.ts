import { cookies } from "next/headers";
import prismaClient from "./services/prisma";
import { verifyToken } from "./services/jwt";

export async function getUserFromCookies() {
    const userCookies = await cookies();
    const token = decodeURIComponent(userCookies.get("token")?.value || "");
    if (!token) {
        return null;
    }
    const data = verifyToken(token);
    if (!data) return null;
    
    const user = await prismaClient.user.findUnique({
        where: {
            id: data.id,
        },
        include: {
            company: true
        },
        omit: {
            password: true
        }
    });
    
    if (!user) {
        return null;
    }
    return user;
}

