import jwt from "jsonwebtoken";

interface TokenData {
    id: string;
}

export function generateToken(data: TokenData): string {
    const token = jwt.sign(data, process.env.JWT_KEY as string);
    return token;
}

export function verifyToken(token: string): TokenData | null {
    try {
        const data = jwt.verify(token, process.env.JWT_KEY as string) as TokenData;
        return data;
    } catch {
        return null;
    }
}