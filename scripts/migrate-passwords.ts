/**
 * One-time migration: hash all plaintext passwords in MongoDB.
 *
 * Usage (run from the project root):
 *   DATABASE_URL="<prod-connection-string>" npx tsx scripts/migrate-passwords.ts
 *
 * The script is idempotent — already-hashed passwords are left untouched.
 * Safe to re-run if interrupted mid-way.
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient({ log: ["warn", "error"] });

// Matches $2a$, $2b$, $2y$ bcrypt prefixes
const BCRYPT_PREFIX = /^\$2[aby]\$/;
const SALT_ROUNDS = 10;

async function migrate() {
    console.log("=== Password Migration ===\n");

    const users = await prisma.user.findMany({
        select: { id: true, email: true, password: true },
    });

    console.log(`Found ${users.length} user(s) in the database.\n`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const user of users) {
        if (BCRYPT_PREFIX.test(user.password)) {
            console.log(`  SKIP   ${user.email}  (already hashed)`);
            skipped++;
            continue;
        }

        try {
            const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hash },
            });
            console.log(`  OK     ${user.email}`);
            migrated++;
        } catch (err) {
            console.error(`  FAIL   ${user.email}:`, err);
            failed++;
        }
    }

    console.log("\n--- Summary ---");
    console.log(`Total:    ${users.length}`);
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped:  ${skipped}  (already hashed)`);
    console.log(`Failed:   ${failed}`);

    if (failed > 0) {
        console.error("\nSome users failed to migrate. Re-run the script to retry them.");
        process.exitCode = 1;
    } else {
        console.log("\nMigration complete. All users can now log in.");
    }
}

migrate()
    .catch((err) => {
        console.error("\nFatal error during migration:", err);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
