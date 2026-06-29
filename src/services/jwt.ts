import { SignJWT, jwtVerify } from "jose";

interface TokenData {
    id: string;
}

// jose works in both the Node.js and the Edge runtime (used by middleware),
// unlike `jsonwebtoken`, which depends on Node's crypto module.
function getSecret(): Uint8Array {
    return new TextEncoder().encode(process.env.JWT_KEY as string);
}

export async function generateToken(data: TokenData): Promise<string> {
    return await new SignJWT({ id: data.id })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(getSecret());
}

export async function verifyToken(token: string): Promise<TokenData | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        if (typeof payload.id !== "string") return null;
        return { id: payload.id };
    } catch {
        return null;
    }
}
