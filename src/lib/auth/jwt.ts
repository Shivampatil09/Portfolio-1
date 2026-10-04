import { SignJWT, jwtVerify } from "jose";

export interface AdminSession {
  adminId?: string;
  username: string;
  role: string;
  tokenVersion?: number;
}

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY: JWT_SECRET environment variable is missing in production."
      );
    }
    // Local development fallback only
    return new TextEncoder().encode(
      "dev-local-jwt-secret-shivam-patil-portfolio-32chars"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: AdminSession): Promise<string> {
  const secretKey = getJwtSecretKey();
  return new SignJWT({
    adminId: payload.adminId,
    username: payload.username,
    role: payload.role || "admin",
    tokenVersion: payload.tokenVersion ?? 1,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return {
      adminId: payload.adminId as string | undefined,
      username: payload.username as string,
      role: (payload.role as string) || "admin",
      tokenVersion: typeof payload.tokenVersion === "number" ? payload.tokenVersion : 1,
    };
  } catch {
    return null;
  }
}
