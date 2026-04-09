'use server';

/**
 * Server Actions for Product Queries
 * ALL Firestore reads go through here - clients NEVER query Firestore directly
 * This prevents exposing queries in browser Network tab
 */

import { db, Timestamp, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, addDoc, query, where, orderBy, limit } from '@/lib/services/firestore';
import type { Product } from '@/lib/types';

/**
 * Get all active products
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, 'products'),
        where('isActive', '==', true)
      )
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docSnap = await getDoc(doc(db, 'products', id));
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, 'products'),
        where('isActive', '==', true),
        where('category', '==', category)
      )
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, 'products'),
        where('slug', '==', slug),
        limit(1)
      )
    );

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Product;
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all active featured products
 */
export async function getActiveFeaturedProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, 'featured_products'),
        where('isActive', '==', true)
      )
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

/**
 * Get single featured product by ID
 */
export async function getFeaturedProductById(id: string): Promise<Product | null> {
  try {
    const docSnap = await getDoc(doc(db, 'featured_products', id));
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Product;
  } catch (error) {
    console.error('Error fetching featured product by ID:', error);
    return null;
  }
}

/**
 * Get all featured products (including inactive - for admin)
 */
export async function getAllFeaturedProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, 'featured_products'));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching all featured products:', error);
    return [];
  }
}

/**
 * Search products by name or description
 */
export async function searchProducts(queryStr: string): Promise<Product[]> {
  if (!queryStr || queryStr.length < 2) return [];

  try {
    const snapshot = await getDocs(
      query(
        collection(db, 'products'),
        where('isActive', '==', true)
      )
    );

    const queryLower = queryStr.toLowerCase();
    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Product))
      .filter(
        (p) =>
          p.name.toLowerCase().includes(queryLower) ||
          p.description?.toLowerCase().includes(queryLower)
      );
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}
