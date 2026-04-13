'use server';

/**
 * Server Action for Audit Logging
 * This runs ONLY on the server, so it can write to Firestore without Client SDK restrictions
 */

import { db, Timestamp, addDoc, collection } from '@/lib/services/firestore';
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

async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers();
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

async function getUserAgent(): Promise<string> {
  try {
    const headersList = await headers();
    return headersList.get('user-agent') ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Log payment attempts (runs on server only)
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
      ip: await getClientIp(),
      userAgent: await getUserAgent(),
      collection: 'payment_logs',
    };

    await addDoc(collection(db, 'payment_logs'), logEntry);

    console.log('[AUDIT] Payment Attempt:', {
      status,
      amount,
      currency,
      userId,
      ip: logEntry.ip,
    });
  } catch (error) {
    console.error('[AUDIT] Error logging payment attempt:', error);
    // Don't throw - audit logging should not break the main operation
  }
}

/**
 * Log authentication failures (runs on server only)
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
      ip: await getClientIp(),
      userAgent: await getUserAgent(),
      collection: 'auth_failures',
    };

    await addDoc(collection(db, 'auth_failures'), logEntry);

    console.log('[AUDIT] Auth Failure:', {
      reason,
      phone,
      ip: logEntry.ip,
    });
  } catch (error) {
    console.error('[AUDIT] Error logging auth failure:', error);
  }
}

/**
 * Log admin actions (runs on server only)
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
      ip: await getClientIp(),
      userAgent: await getUserAgent(),
      collection: 'audit_logs',
    };

    await addDoc(collection(db, 'audit_logs'), logEntry);

    console.log('[AUDIT] Admin Action:', {
      action,
      resourceType,
      resourceId,
      userId,
      ip: logEntry.ip,
    });
  } catch (error) {
    console.error('[AUDIT] Error logging admin action:', error);
  }
}
