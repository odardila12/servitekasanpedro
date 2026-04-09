'use server';

import { adminDb } from '@/lib/firebase/admin';
import { collection, addDoc, Timestamp } from 'firebase-admin/firestore';
import { headers } from 'next/headers';

export type AdminAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'UPLOAD';
export type ResourceType = 'product' | 'image' | 'settings' | 'user';
export type AuthFailureReason = 'INVALID_OTP' | 'RATE_LIMITED' | 'EXPIRED' | 'INVALID_TOKEN';
export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'FRAUD_DETECTED';

interface AuditLogEntry {
  timestamp: Timestamp;
  userId?: string;
  action?: AdminAction;
  resourceType?: ResourceType;
  resourceId?: string;
  details?: Record<string, any>;
  ip: string;
  userAgent: string;
  reason?: AuthFailureReason;
  phone?: string;
  amount?: number;
  currency?: string;
  status?: PaymentStatus;
  collection: 'audit_logs' | 'auth_failures' | 'payment_logs';
}

/**
 * Extract client IP from request headers
 * Tries x-forwarded-for first (for proxied requests), falls back to other headers
 */
function getClientIp(): string {
  try {
    const headersList = headers();
    const xForwardedFor = headersList.get('x-forwarded-for');
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }

    const xRealIp = headersList.get('x-real-ip');
    if (xRealIp) {
      return xRealIp;
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Extract user agent from request headers
 */
function getUserAgent(): string {
  try {
    const headersList = headers();
    return headersList.get('user-agent') ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Log admin actions (CREATE, UPDATE, DELETE, UPLOAD)
 * Call this after successful admin operations
 */
export async function logAdminAction(
  userId: string,
  action: AdminAction,
  resourceType: ResourceType,
  resourceId: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const logEntry: AuditLogEntry = {
      timestamp: Timestamp.now(),
      userId,
      action,
      resourceType,
      resourceId,
      details,
      ip: getClientIp(),
      userAgent: getUserAgent(),
      collection: 'audit_logs',
    };

    await addDoc(collection(adminDb, 'audit_logs'), logEntry);

    // Log to console for local dev/debugging
    console.log('[AUDIT] Admin Action:', {
      action,
      resourceType,
      resourceId,
      userId,
      ip: logEntry.ip,
    });
  } catch (error) {
    console.error('[AUDIT] Error logging admin action:', error);
    // Don't throw - audit logging should not break the main operation
  }
}

/**
 * Log authentication failures (invalid OTP, rate limiting, expired tokens, etc.)
 * Call this when auth verification fails
 */
export async function logAuthFailure(
  phone: string,
  reason: AuthFailureReason,
  details?: Record<string, any>
): Promise<void> {
  try {
    const logEntry: AuditLogEntry = {
      timestamp: Timestamp.now(),
      phone,
      reason,
      details,
      ip: getClientIp(),
      userAgent: getUserAgent(),
      collection: 'auth_failures',
    };

    await addDoc(collection(adminDb, 'auth_failures'), logEntry);

    console.log('[AUDIT] Auth Failure:', {
      reason,
      phone,
      ip: logEntry.ip,
    });
  } catch (error) {
    console.error('[AUDIT] Error logging auth failure:', error);
    // Don't throw
  }
}

/**
 * Log payment attempts (success, failure, fraud detection)
 * Call this after payment processing
 */
export async function logPaymentAttempt(
  userId: string,
  amount: number,
  currency: string,
  status: PaymentStatus,
  details?: Record<string, any>
): Promise<void> {
  try {
    const logEntry: AuditLogEntry = {
      timestamp: Timestamp.now(),
      userId,
      amount,
      currency,
      status,
      details,
      ip: getClientIp(),
      userAgent: getUserAgent(),
      collection: 'payment_logs',
    };

    await addDoc(collection(adminDb, 'payment_logs'), logEntry);

    console.log('[AUDIT] Payment Attempt:', {
      status,
      amount,
      currency,
      userId,
      ip: logEntry.ip,
    });
  } catch (error) {
    console.error('[AUDIT] Error logging payment attempt:', error);
    // Don't throw
  }
}
