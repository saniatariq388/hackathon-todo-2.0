// frontend\src\lib\auth.ts
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for Neon/Serverless Postgres
        }
    }),
    emailAndPassword: {
        enabled: true
    },
    // Map internal models if they differ from default Better Auth naming (our DB uses user, session, account, verification)
    modelName: {
        user: "user",
        session: "session",
        account: "account",
        verification: "verification"
    }
});
