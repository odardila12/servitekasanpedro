'use server';

import { db, Timestamp, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, addDoc, query, where, orderBy, limit } from '@/lib/services/firestore';
import { logAuthFailure } from '@/app/actions/audit-logger';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export interface OtpAttempt {
  userId: string;
  attempts: number;
  lockedUntil?: Timestamp;
  lastAttemptAt: Timestamp;
}

/**
 * Check if a user is rate-limited from OTP verification
 * Returns: { isLocked: boolean, remainingTime?: number (in seconds) }
 */
export async function checkRateLimit(
  userId: string
): Promise<{ isLocked: boolean; remainingTime?: number }> {
  try {
    const attemptDoc = await getDoc(doc(db, 'otp_attempts', userId));

    if (!attemptDoc.exists()) {
      return { isLocked: false };
    }

    const data = attemptDoc.data() as OtpAttempt;

    // Check if lockout has expired
    if (data.lockedUntil) {
      const lockedUntilTime = data.lockedUntil.toMillis();
      const now = Date.now();

      if (now < lockedUntilTime) {
        const remainingMs = lockedUntilTime - now;
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        return { isLocked: true, remainingTime: remainingSeconds };
      } else {
        // Lockout has expired, clear the record
        await deleteDoc(doc(db, 'otp_attempts', userId));
        return { isLocked: false };
      }
    }

    return { isLocked: false };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    // On error, don't block the user - fail open
    return { isLocked: false };
  }
}

/**
 * Record a failed OTP verification attempt
 * Returns: { success: boolean; isNowLocked: boolean; remainingAttempts: number }
 */
export async function recordFailedAttempt(
  userId: string
): Promise<{ success: boolean; isNowLocked: boolean; remainingAttempts: number }> {
  try {
    const attemptDocRef = doc(db, 'otp_attempts', userId);
    const attemptDoc = await getDoc(attemptDocRef);

    let attempts = 1;
    let isNowLocked = false;

    if (attemptDoc.exists()) {
      const data = attemptDoc.data() as OtpAttempt;
      attempts = (data.attempts || 0) + 1;
    }

    // Lock if max attempts reached
    if (attempts >= MAX_ATTEMPTS) {
      isNowLocked = true;
      await setDoc(
        attemptDocRef,
        {
          userId,
          attempts,
          lockedUntil: Timestamp.fromMillis(Date.now() + LOCKOUT_DURATION),
          lastAttemptAt: Timestamp.now(),
        },
        { merge: true }
      );
    } else {
      // Update attempt count without locking
      await setDoc(
        attemptDocRef,
        {
          userId,
          attempts,
          lastAttemptAt: Timestamp.now(),
        },
        { merge: true }
      );
    }

    return {
      success: true,
      isNowLocked,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - attempts),
    };
  } catch (error) {
    console.error('Error recording failed attempt:', error);
    throw error;
  }
}

/**
 * Clear all attempt records for a user (call on successful OTP verification)
 */
export async function clearAttempts(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'otp_attempts', userId));
  } catch (error) {
    console.error('Error clearing attempts:', error);
    // Don't throw - this is non-critical
  }
}

/**
 * Get current attempt count for a user (for debugging/logging)
 */
export async function getAttemptCount(userId: string): Promise<number> {
  try {
    const attemptDoc = await getDoc(doc(db, 'otp_attempts', userId));
    if (!attemptDoc.exists()) {
      return 0;
    }
    const data = attemptDoc.data() as OtpAttempt;
    return data.attempts || 0;
  } catch (error) {
    console.error('Error getting attempt count:', error);
    return 0;
  }
}
