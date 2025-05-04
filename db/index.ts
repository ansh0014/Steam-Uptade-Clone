
import { Pool } from 'pg'; // Import Pool from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'; // Import drizzle from 'drizzle-orm/node-postgres'
import * as schema from "@shared/schema";
import * as dotenv from 'dotenv';

dotenv.config();

// Remove Neon-specific configuration
// neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in environment variables");
}

// Use Pool from 'pg'
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Use drizzle from 'drizzle-orm/node-postgres'
export const db = drizzle(pool, { schema }); // Pass pool directly
