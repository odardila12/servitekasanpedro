'use server';

import { adminDb } from '@/lib/firebase/admin';

// Cache for admin phones (refreshed every 5 minutes)
let phoneCache: string[] = [];
let lastCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch admin phone allowlist from Firestore
 * Structure: collection `admin_phones` with docs containing {phone: string, userId: string, active: boolean}
 */
export async function getAdminPhones(): Promise<string[]> {
  const now = Date.now();

  // Return cached result if still valid
  if (phoneCache.length > 0 && now - lastCacheTime < CACHE_DURATION) {
    return phoneCache;
  }

  try {
    const snapshot = await adminDb.collection('admin_phones').get();

    const phones: string[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Only include active phones
      if (data.active === true && data.phone) {
        phones.push(data.phone);
      }
    });

    // Update cache
    phoneCache = phones;
    lastCacheTime = now;

    return phones;
  } catch (error) {
    console.error('Error fetching admin phones from Firestore:', error);
    // Fall back to cache if Firestore fails
    if (phoneCache.length > 0) {
      return phoneCache;
    }
    throw new Error('Failed to fetch admin phone allowlist');
  }
}

/**
 * Check if a phone number is allowed to access admin panel
 */
export async function isPhoneAllowed(phone: string): Promise<boolean> {
  try {
    const allowedPhones = await getAdminPhones();
    return allowedPhones.includes(phone);
  } catch (error) {
    console.error('Error checking phone allowlist:', error);
    return false;
  }
}

/**
 * Clear the phone cache (useful after updates)
 */
export async function clearPhoneCache(): Promise<void> {
  phoneCache = [];
  lastCacheTime = 0;
}
