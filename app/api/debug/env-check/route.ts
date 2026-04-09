import { NextResponse } from 'next/server';

/**
 * DEBUG ENDPOINT - Check Firebase environment variables
 * Remove this before production
 */
export async function GET() {
  const requiredEnvVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
  ];

  const envStatus: Record<string, boolean> = {};
  requiredEnvVars.forEach((key) => {
    envStatus[key] = !!process.env[key];
  });

  const allConfigured = requiredEnvVars.every((key) => !!process.env[key]);

  return NextResponse.json(
    {
      status: allConfigured ? 'OK' : 'MISSING_ENV_VARS',
      configured: envStatus,
      missing: Object.entries(envStatus)
        .filter(([, value]) => !value)
        .map(([key]) => key),
    },
    { status: allConfigured ? 200 : 500 }
  );
}
