/**
 * One-time migration endpoint: hash all plaintext passwords.
 *
 * SECURITY CHECKLIST (follow before and after use):
 *  1. Add MIGRATION_SECRET to Vercel environment variables.
 *  2. Add '/api/admin/migrate-passwords' to PUBLIC_API_PATHS in src/middleware.ts.
 *  3. Deploy, run the migration (see instructions below), verify summary.
 *  4. Delete this file, remove the PUBLIC_API_PATHS entry, remove MIGRATION_SECRET.
 *  5. Redeploy.
 *
 * Trigger:
 *   curl -X POST https://<your-domain>/api/admin/migrate-passwords \
 *     -H "x-migration-secret: <MIGRATION_SECRET value>"
 */
import bcrypt from "bcryptjs";
import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

// Vercel Pro allows up to 300 s; Hobby plan is hard-capped at 60 s.
export const maxDuration = 300;

const BCRYPT_PREFIX = /^\$2[aby]\$/;
const SALT_ROUNDS = 10;

export async function POST(request: NextRequest) {
    const provided = request.headers.get("x-migration-secret");
    const expected = process.env.MIGRATION_SECRET;

    if (!expected || provided !== expected) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prismaClient.user.findMany({
            select: { id: true, email: true, password: true },
        });

        let migrated = 0;
        let skipped = 0;
        let failed = 0;
        const errors: string[] = [];

        for (const user of users) {
            if (BCRYPT_PREFIX.test(user.password)) {
                skipped++;
                continue;
            }

            try {
                const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
                await prismaClient.user.update({
                    where: { id: user.id },
                    data: { password: hash },
                });
                migrated++;
            } catch (err) {
                const msg = err instanceof Error ? err.message : "unknown error";
                errors.push(`${user.email}: ${msg}`);
                failed++;
            }
        }

        return NextResponse.json({
            success: failed === 0,
            summary: { total: users.length, migrated, skipped, failed },
            ...(errors.length > 0 && { errors }),
        });
    } catch (err) {
        console.error("[migrate-passwords] Fatal error:", err);
        return NextResponse.json(
            { success: false, message: "Migration encountered a fatal error" },
            { status: 500 }
        );
    }
}
