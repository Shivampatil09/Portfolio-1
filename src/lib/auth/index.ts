import { cookies } from "next/headers";
import {
  getAdminUserByUsername,
  getAdminUserById,
  getAdminUserCount,
  createAdminUser,
  recordAdminLoginSuccess,
  DatabaseQueryError,
} from "@/lib/db";
import {
  getJwtSecretKey,
  createSessionToken,
  verifySessionToken,
  AdminSession,
} from "./jwt";
import { hashPassword, verifyPassword } from "./passwords";

export * from "./jwt";
export * from "./passwords";

const COOKIE_NAME = "shivam_admin_session";

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session) return null;

  // Invalidate any session across all devices if tokenVersion does not match current DB version
  try {
    let user = null;
    if (session.adminId) {
      user = await getAdminUserById(session.adminId);
    } else if (session.username) {
      user = await getAdminUserByUsername(session.username);
    }

    if (!user || user.status !== "active") {
      return null;
    }

    const currentVersion = user.tokenVersion ?? 1;
    const sessionVersion = session.tokenVersion ?? 1;
    if (currentVersion !== sessionVersion) {
      return null;
    }

    return session;
  } catch {
    if (process.env.NODE_ENV === "production") {
      return null;
    }
    return session;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Authenticates admin credentials against the database.
 * 
 * Strict Security Guarantees:
 * 1. Fails closed on any database failure. Database errors NEVER trigger legacy bootstrap.
 * 2. Only if the database query confirms exactly 0 admin users exist will it run the atomic single-admin bootstrap.
 * 3. Once an admin account exists in DB, authentication strictly checks DB records.
 * 4. Tokens contain only minimal session identity (no password hashes, no recovery emails).
 */
export async function authenticateAdmin(
  username: string,
  password: string
): Promise<{
  success: boolean;
  session?: AdminSession;
  message: string;
}> {
  const cleanUsername = username.trim();
  if (!cleanUsername || !password) {
    return { success: false, message: "Username and password are required." };
  }

  try {
    // 1. Check if user exists in database
    const user = await getAdminUserByUsername(cleanUsername);

    if (user) {
      if (user.status !== "active") {
        return {
          success: false,
          message: "This admin account is currently locked or inactive.",
        };
      }

      const isMatch = await verifyPassword(password, user.passwordHash);
      if (!isMatch) {
        return { success: false, message: "Invalid username or password." };
      }

      await recordAdminLoginSuccess(user.id);
      return {
        success: true,
        session: {
          adminId: user.id,
          username: user.username,
          role: "admin",
          tokenVersion: user.tokenVersion ?? 1,
        },
        message: "Authentication successful.",
      };
    }

    // 2. Migration/Bootstrap path: ONLY if database is confirmed to contain exactly 0 admin users
    const adminCount = await getAdminUserCount();
    if (adminCount === 0) {
      const expectedUser =
        process.env.ADMIN_USERNAME ||
        (process.env.NODE_ENV !== "production" ? "admin" : null);
      const expectedPass =
        process.env.ADMIN_PASSWORD ||
        (process.env.NODE_ENV !== "production" ? "admin123" : null);

      if (
        expectedUser &&
        expectedPass &&
        cleanUsername === expectedUser &&
        password === expectedPass
      ) {
        // Migrate initial credentials into database
        const passwordHash = await hashPassword(password);
        const recoveryEmail =
          process.env.ADMIN_RECOVERY_EMAIL || "patilshivam1280@gmail.com";

        const created = await createAdminUser({
          username: cleanUsername,
          passwordHash,
          recoveryEmail,
          status: "active",
        });

        if (created) {
          await recordAdminLoginSuccess(created.id);
          return {
            success: true,
            session: {
              adminId: created.id,
              username: created.username,
              role: "admin",
              tokenVersion: created.tokenVersion ?? 1,
            },
            message:
              "Admin account initialized & migrated into database successfully.",
          };
        } else {
          // If another concurrent request already bootstrapped, reject safely
          return {
            success: false,
            message: "Initialization conflict. Please try signing in again.",
          };
        }
      }
    }

    return { success: false, message: "Invalid username or password." };
  } catch (error) {
    if (error instanceof DatabaseQueryError) {
      // Fail closed: Do NOT expose internal error details, do NOT enter bootstrap
      return {
        success: false,
        message:
          "Authentication service temporarily unavailable. Please try again later.",
      };
    }
    return {
      success: false,
      message: "An unexpected authentication error occurred.",
    };
  }
}

// Backward compatibility helper
export async function validateAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const res = await authenticateAdmin(username, password);
  return res.success;
}
