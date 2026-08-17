import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // 1. Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    // 2. Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return NextResponse.json(
        { error: `${field} is already taken` },
        { status: 409 },
      );
    }

    // 3. Hash the password (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user in database
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    // 6. Set Auth Cookies
    const response = NextResponse.json(
      {
        success: true,
        user: { id: user.id, username: user.username, email: user.email },
      },
      { status: 201 },
    );

    // Secure token for middleware & API requests (Hidden from JS)
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Public indicator cookie so Navbar knows user is logged in
    response.cookies.set({
      name: "is_logged_in",
      value: "true",
      httpOnly: false, // Accessible by document.cookie in Navbar
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
