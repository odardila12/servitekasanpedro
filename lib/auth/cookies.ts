'use server';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import axios from 'axios';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { isPhoneAllowed as checkPhoneAllowed, clearPhoneCache } from '@/lib/config/admin-phones';
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/auth/rate-limit';
import { logAuthFailure } from '@/lib/audit/logger';

// Encoding the secret key from the environment variable to use it for signing JWTs
const SECRET_KEY: Uint8Array = (() => {
  const key = process.env.JWT_SECRET;
  if (!key) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return new TextEncoder().encode(key);
})();

// Function to sign the JWT and set it as a cookie
export async function signAndSetCookie(uid: string) {
  // Create a JWT with the user's UID and set the header and expiration time
  const token = await new SignJWT({ uid })
    .setProtectedHeader({ alg: 'HS256' }) // Use HS256 algorithm for signing
    .setExpirationTime('30d') // Set token expiration to 30 days
    .sign(SECRET_KEY); // Sign the token with the secret key

  // Set the signed JWT as a cookie with specific options
  (await cookies()).set({
    name: 'admin-auth-token', // Name of the cookie
    value: token, // JWT token value
    httpOnly: true, // Prevent JavaScript access to increase security
    secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    maxAge: 30 * 24 * 60 * 60, // Cookie expiration time set to 30 days
    sameSite: 'strict', // Prevent CSRF by disallowing cross-site usage
    path: '/', // Make the cookie available throughout the entire site
  });
}

// Function to verify if the admin is authenticated
export async function isAdminAuthenticated() {
  const token = (await cookies()).get('admin-auth-token')?.value;

  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const uid = payload.uid as string;

    if (!uid) return false;

    // JWT token is valid - trust it contains admin status
    // No need to verify Firebase user record with client SDK
    return true;
  } catch (error) {
    console.error('Token inválido:', error);
    (await cookies()).delete('admin-auth-token');
    return false;
  }
}

// Function to logout
export async function logoutAdmin() {
  (await cookies()).delete('admin-auth-token');
}

// Create OTP for WhatsApp
export async function createPhoneToken(formattedPhone: string) {
  try {
    // Check phone allowlist from Firestore (not hardcoded)
    const isAllowed = await checkPhoneAllowed(formattedPhone);
    if (!isAllowed) {
      return {
        success: false,
        error: 'Número de teléfono no autorizado para acceder al admin.',
      };
    }

    // Generate a cryptographically secure 6-digit code
    const code = generateSecureOtp();

    const API_TOKEN = process.env.WHATSAPP_API_TOKEN;
    const BUSINESS_PHONE = process.env.WHATSAPP_BUSINESS_PHONE;
    const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v18.0';

    // Send via WhatsApp
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: "auth",
          language: {
            code: "es_CO",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: code,
                },
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: 0,
              parameters: [
                {
                  type: "text",
                  text: code,
                },
              ],
            },
          ],
        },
      },
    });

    // Generate unique userId
    const userId = Date.now().toString(36) + Math.random().toString(36).substring(2);

    // Store OTP in Firestore
    await storeOtpInFirebase(userId, code, formattedPhone);

    return { success: true, userId };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error completo de WhatsApp API:', error.response?.data);
      return { success: false, error: error.response?.data };
    } else if (error instanceof Error) {
      console.error('Error al crear token de teléfono:', error.message);
      return { success: false, error: error.message };
    }
    console.error('Error desconocido:', error);
    return { success: false, error: 'Ocurrió un error desconocido' };
  }
}

/**
 * DEPRECATED: Use verifyOTPServerAction from /app/actions/verify-otp.ts instead
 *
 * SECURITY ISSUE: This function uses the client-side Firestore SDK (db)
 * which can be queried by attackers to access the admin_otps collection.
 * All OTP verification must happen server-side using the admin SDK.
 *
 * This function is kept only for backwards compatibility.
 * New code should use the server action.
 */
export async function verifyOTP(userId: string, otp: string) {
  try {
    // Check if user is rate-limited
    const rateLimit = await checkRateLimit(userId);
    if (rateLimit.isLocked) {
      const remainingMinutes = Math.ceil((rateLimit.remainingTime || 0) / 60);
      // Log rate limit hit
      await logAuthFailure('unknown', 'RATE_LIMITED', {
        userId,
        remainingSeconds: rateLimit.remainingTime,
      });
      return {
        success: false,
        error: `Demasiados intentos fallidos. Intenta de nuevo en ${remainingMinutes} minuto(s).`,
        statusCode: 429,
      };
    }

    const storedData = await getOtpFromFirebase(userId);

    if (!storedData) {
      // OTP expired or invalid
      await recordFailedAttempt(userId);
      await logAuthFailure('unknown', 'EXPIRED', {
        userId,
        reason: 'OTP not found or expired',
      });
      return { success: false, error: 'OTP expirado o inválido' };
    }

    if (storedData.code === otp) {
      // Success - clear attempt tracking
      await clearAttempts(userId);
      await removeOtpFromFirebase(userId);
      return { success: true, session: { userId, phone: storedData.phone } };
    } else {
      // Failed attempt - record and check if locked
      const attempt = await recordFailedAttempt(userId);
      await logAuthFailure(storedData.phone, 'INVALID_OTP', {
        userId,
        attemptsRemaining: attempt.remainingAttempts,
        totalAttempts: 3 - attempt.remainingAttempts,
      });
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al verificar OTP:', error.message);
      return { success: false, error: error.message };
    }
    console.error('Error desconocido:', error);
    return { success: false, error: 'Ocurrió un error desconocido' };
  }
}

// Store OTP in Firestore
async function storeOtpInFirebase(userId: string, code: string, phone: string) {
  try {
    const otpRef = doc(db, 'admin_otps', userId);

    await setDoc(otpRef, {
      code,
      phone,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 600000), // 10 minutos
    });

    console.log('OTP almacenado para:', userId);
    return true;
  } catch (error) {
    console.error('Error al almacenar OTP:', error);
    throw error;
  }
}

// Get OTP from Firestore
async function getOtpFromFirebase(userId: string) {
  try {
    const otpDoc = await getDoc(doc(db, 'admin_otps', userId));

    if (!otpDoc.exists()) {
      console.log('No se encontró OTP para:', userId);
      return null;
    }

    const data = otpDoc.data();

    // Check if OTP expired
    if (data.expiresAt.toDate ? data.expiresAt.toDate() < new Date() : data.expiresAt < new Date()) {
      await removeOtpFromFirebase(userId);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error al obtener OTP:', error);
    throw error;
  }
}

// Remove OTP from Firestore
async function removeOtpFromFirebase(userId: string) {
  try {
    await deleteDoc(doc(db, 'admin_otps', userId));
    console.log('OTP eliminado para:', userId);
    return true;
  } catch (error) {
    console.error('Error al eliminar OTP:', error);
    throw error;
  }
}

/**
 * Generate a cryptographically secure 6-digit OTP
 * Uses crypto.getRandomValues() instead of Math.random()
 * Math.random() is NOT suitable for cryptographic purposes
 */
function generateSecureOtp(): string {
  // Create a typed array for random bytes
  const randomBytes = new Uint32Array(1);

  // Use crypto API for cryptographically secure randomness
  crypto.getRandomValues(randomBytes);

  // Convert to 6-digit code (100000-999999)
  // Divide by max uint32 to get 0-1, multiply by 900000, add 100000
  const randomValue = randomBytes[0];
  const maxUint32 = 4294967295;
  const otp = Math.floor((randomValue / maxUint32) * 900000) + 100000;

  return otp.toString();
}

// Verify phone number and set cookie with Firebase Auth
export async function verifyPhoneAndSetCookie(phoneNumber: string) {
  try {
    const normalizedPhoneNumber = phoneNumber.replace(/\D/g, '');
    const formattedPhone = `57${normalizedPhoneNumber}`;

    // Check phone allowlist from Firestore
    const isAllowed = await checkPhoneAllowed(formattedPhone);
    if (!isAllowed) {
      throw new Error('Número de teléfono no autorizado.');
    }

    // Get user from Firebase by phone (need to have a way to map phone -> uid)
    // For now, we'll use a direct uid. You should implement proper phone-to-uid mapping

    // Get all users with admin claim and match phone
    const usersRef = collection(db, 'admin_users');
    const q = query(usersRef, where('phone', '==', `57${normalizedPhoneNumber}`));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const uid = userDoc.id;

      // User exists in Firestore admin_users collection - trusted as admin
      await signAndSetCookie(uid);
      return { success: true };
    } else {
      return { success: false, error: 'Usuario no encontrado' };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error verificando usuario:', error.message);
    } else {
      console.error('Error verificando usuario:', error);
    }
    throw new Error('Ocurrió un error. Por favor, intenta nuevamente.');
  }
}
