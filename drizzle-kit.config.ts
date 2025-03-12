// only using this file to config drizzle kit for migrations
// drizzle is configured to directly use neon serverless for actual connections
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { env } from "process";

dotenv.config();

const url = env.POSTGRES_URL ?? "";
if (!url) {
  throw new Error("Cannot migrate - Missing POSTGRES_URL");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
  dbCredentials: {
    url,
  },
  casing: "snake_case",
});
