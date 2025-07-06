import { NextRequest, NextResponse } from "next/server";
//import * as z from "zod";
//import { loginSchema } from "@/lib/validation/schema"; // Make sure to create a login schema for validation
//import { db } from "@/db"; // Ensure your db connection is set up properly
import bcrypt from "bcrypt";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client (ensure you have set up Supabase URL and key)
const supabase = createClient(
  "https://vaflojjhowzfkhnykrnh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZmxvampob3d6Zmtobnlrcm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MjAyMTksImV4cCI6MjA2NTE5NjIxOX0.U7U3vyF3mbHzph_z8AGE6lLfmjHOHyuimG7HI1AgRts"
);

export async function GET(req: NextRequest) {
  try {
    console.log("Checking login credentials...");

    // Extract email and password from query parameters
    const email = req.nextUrl.searchParams.get("email");
    const password = req.nextUrl.searchParams.get("password");

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if the user exists in the database using Supabase client
    const { data, error } = await supabase
      .from("users") // Table name
      .select("*") // Select all columns
      .eq("email", email) // Query using `eq` for email match
      .single(); // Ensure you get only one user result

    if (error) {
      console.error("Error while fetching user:", error.message);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!data) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, data.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // If password is valid, return a success message and user data
    return NextResponse.json({
      message: "Login successful",
      user: { id: data.id, email: data.email, name: data.name },
    });
  } catch (error: unknown) {
    // Narrowing down the error type
    if (error instanceof Error) {
      console.error("Error in login:", error.message);
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    }

    // Handle unexpected error types
    console.error("Unexpected error in login:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
