'use server';

import { cookies } from 'next/headers';
import { adminDb } from '@/lib/firebase/admin';
import { SignJWT } from 'jose';
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/auth/rate-limit';

const SECRET_KEY: Uint8Array = (() => {
  const key = process.env.JWT_SECRET;
  if (!key) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return new TextEncoder().encode(key);
})();

/**
 * Verify OTP on the server side
 * This prevents client-side direct access to admin_otps collection
 * All verification happens on the server with admin privileges
 *
 * SECURITY: This is a server action. The client CANNOT:
 * - Query the admin_otps collection directly
 * - Access OTP codes
 * - Bypass rate limiting
 * - Perform replay attacks (OTP is deleted after use)
 */
export async function verifyOTPServerAction(
  userId: string,
  otpCode: string
): Promise<{
  success: boolean;
  error?: string;
  statusCode?: number;
}> {
  try {
    // ── Rate limiting check ──────────────────────────────────────────────────
    const rateLimit = await checkRateLimit(userId);
    if (rateLimit.isLocked) {
      const remainingMinutes = Math.ceil((rateLimit.remainingTime || 0) / 60);
      return {
        success: false,
        error: `Demasiados intentos fallidos. Intenta de nuevo en ${remainingMinutes} minuto(s).`,
        statusCode: 429,
      };
    }

    // ── Query admin_otps from Firestore (server-only, admin SDK) ─────────────
    // Client CANNOT access this because Firebase Rules deny non-admin reads
    const otpQuery = await adminDb
      .collection('admin_otps')
      .doc(userId)
      .get();

    if (!otpQuery.exists) {
      // Record failed attempt
      await recordFailedAttempt(userId);
      return {
        success: false,
        error: 'OTP expirado o inválido',
      };
    }

    const otpData = otpQuery.data() as {
      code: string;
      phone: string;
      expiresAt: any; // Firestore Timestamp
    };

    // ── Verify OTP code matches ──────────────────────────────────────────────
    if (otpData.code !== otpCode) {
      // Failed attempt - record and check if locked
      const attempt = await recordFailedAttempt(userId);
      if (attempt.isNowLocked) {
        return {
          success: false,
          error: 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.',
          statusCode: 429,
        };
      }
      return {
        success: false,
        error: `OTP inválido. Intentos restantes: ${attempt.remainingAttempts}`,
      };
    }

    // ── Check expiration ─────────────────────────────────────────────────────
    let expiresAt: Date;
    if (otpData.expiresAt.toDate) {
      // Firestore Timestamp
      expiresAt = otpData.expiresAt.toDate();
    } else {
      // Plain timestamp number
      expiresAt = new Date(otpData.expiresAt);
    }

    if (expiresAt < new Date()) {
      // OTP expired
      await recordFailedAttempt(userId);
      await adminDb.collection('admin_otps').doc(userId).delete();
      return {
        success: false,
        error: 'OTP expirado',
      };
    }

    // ── OTP is valid - set authentication cookie ────────────────────────────
    // Generate JWT token with the phone number
    const jwtToken = await new SignJWT({ phone: otpData.phone })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(SECRET_KEY);

    // Set HTTP-only, secure cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'admin-auth-token',
      value: jwtToken,
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // Prevent CSRF
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // ── Clean up OTP (one-time use) ──────────────────────────────────────────
    await adminDb.collection('admin_otps').doc(userId).delete();

    // ── Clear rate limit tracking ────────────────────────────────────────────
    await clearAttempts(userId);

    return {
      success: true,
    };
  } catch (error) {
    console.error('[ERROR] verifyOTPServerAction failed:', error);
    return {
      success: false,
      error: 'Ocurrió un error durante la verificación. Intenta más tarde.',
      statusCode: 500,
    };
  }
}
