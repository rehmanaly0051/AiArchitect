// db/schema/user.ts
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey().notNull(), // Auto-incrementing integer
  FirstName: text("FirstName"),
  LastName: text("LastName"),
  email: text("email").notNull().unique(), // Email should be unique
  password: text("password").notNull(),
  fullname: text("fullname"),
});
