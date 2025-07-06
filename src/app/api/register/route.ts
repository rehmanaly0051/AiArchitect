import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { registerSchema } from "@/lib/validation/schema";
import { db } from "@/db";
import { usersTable } from "@/db/schema/user";
import bcrypt from "bcrypt";

const saltRounds = 10;

export async function POST(req: NextRequest) {
  try {
    console.log("hello");
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 }
      );
    }
    const parsedData = registerSchema.parse(body);

    // Hashing the password
    const hashPassword = await bcrypt.hash(parsedData.password, saltRounds);

    // Prepare data for inserting into the database, exclude id
    const data = {
      FirstName: parsedData.FirstName,
      LastName: parsedData.LastName,
      email: parsedData.email,
      password: hashPassword,
      fullname: parsedData.fullname,
    };

    // Insert user into the database and return the user object
    const user = await db.insert(usersTable).values(data).returning();

    // Return success response with user data
    return NextResponse.json({
      message: "User Registered Successfully",
      user,
    });
  } catch (error: unknown) {
    console.error("Error in registration:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation Error", errors: error.errors },
        { status: 400 }
      );
    }

    // Handle unique constraint violation (e.g., email already exists)
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { message: "Email already exists", error },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
