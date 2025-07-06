import { NextResponse } from "next/server";
import { db } from "@/db"; // Safe in API route
import { usersTable } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ username: null }, { status: 401 });
  }

  const fetchedUsername = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, Number(user.id)))
    .limit(1)
    .then((res) => res[0]?.fullname || "User");

  return NextResponse.json({ username: fetchedUsername });
}
