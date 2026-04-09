import 'server-only';

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

function initAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_B64 environment variable is not set');
  }

  let serviceAccount;
  try {
    // Decode from base64
    const decoded = Buffer.from(serviceAccountJson, 'base64').toString('utf-8');
    serviceAccount = JSON.parse(decoded);
  } catch (error) {
    throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_B64: ' + (error instanceof Error ? error.message : String(error)));
  }

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminApp = initAdminApp();

export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = getFirestore(adminApp);
