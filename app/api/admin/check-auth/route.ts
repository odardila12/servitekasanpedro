import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { logAuthFailure } from '@/app/actions/audit-logger';

const SECRET_KEY: Uint8Array = (() => {
  const key = process.env.JWT_SECRET;
  if (!key) {
    throw new Error('JWT_SECRET is not defined');
  }
  return new TextEncoder().encode(key);
})();

export async function GET() {
  try {
    const token = (await cookies()).get('admin-auth-token')?.value;

    if (!token) {
      // Log missing token attempt
      await logAuthFailure('unknown', 'INVALID_TOKEN', {
        reason: 'No token provided',
      });
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { payload } = await jwtVerify(token, SECRET_KEY);
    const uid = payload.uid as string;

    if (!uid) {
      await logAuthFailure('unknown', 'INVALID_TOKEN', {
        reason: 'No uid in token payload',
      });
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ authenticated: true, uid }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Log invalid token error
    await logAuthFailure('unknown', 'INVALID_TOKEN', {
      reason: error instanceof Error ? error.message : 'Unknown error',
    });
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
