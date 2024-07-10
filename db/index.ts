import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!, // required,
});

const db = drizzle(pool);

export default db;

// globally export all tables & types
export * from "./tables";
export * from "./types";
