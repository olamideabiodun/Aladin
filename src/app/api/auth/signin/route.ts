import { NextResponse } from 'next/server';
import { auth, signIn, signOut } from "@/lib/auth"; // Make sure to import `signOut`

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Using a custom function to sign in and then check the role
    const res = await signIn("credentials", { email, password, redirect: false });

    // The sign-in attempt fails if credentials are wrong, throwing an error
    // so this line only runs on successful credential validation
    const session = await auth();

    // Enforce admin-only access
    if (!session || session.user.role !== "ADMIN") {
      await signOut(); // Sign out the user immediately if they are not an admin
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    return NextResponse.json({ message: "Admin sign-in successful" }, { status: 200 });
  } catch (error) {
    console.error("Authentication Error:", error);
    // Return a generic error to prevent email enumeration attacks
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}