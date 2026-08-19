import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
  username: string;
}

export async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value; // Reads 'auth_token' from your login route

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    return decoded.userId;
  } catch (error) {
    return null;
  }
}
