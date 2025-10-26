import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
}

export default defineConfig({
    schema: "../shared/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        host: "your-db-host",
        port: 5432,
        user: "your-db-user",
        password: "your-db-password",
        database: "your-db-name",
    },
}); 