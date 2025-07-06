import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// Make sure the schema file exists at the specified path or update the path accordingly
import * as schema from "@/db/schema"; // Adjust the path if your schema file is in a different location

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
