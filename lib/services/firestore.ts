/**
 * Centralized Firestore Client SDK service (SERVER & CLIENT)
 * Uses public Firebase credentials - security handled by Firestore Rules
 * Works in Server Actions, Route Handlers, and Client Components
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  Timestamp,
} from "firebase/firestore";

let dbInstance: ReturnType<typeof getFirestore> | null = null;

/**
 * Initialize and get singleton Firestore instance
 * Uses public Firebase credentials - security handled by Firestore Rules
 */
function initializeFirestore() {
  if (dbInstance) return dbInstance;

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  if (!firebaseConfig.projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID environment variable");
  }

  const app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
  return dbInstance;
}

// Singleton instance
export const db = initializeFirestore();

// Re-export Firestore functions
export {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  Timestamp,
};
