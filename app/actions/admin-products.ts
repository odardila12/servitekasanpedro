'use server';

/**
 * Server Actions for Admin Product Management
 * Includes role verification before any write operations
 */

import { db, Timestamp, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, addDoc, query, where, orderBy, limit } from '@/lib/services/firestore';
import { jwtVerify } from 'jose';
import type { Product } from '@/lib/types';

const SECRET_KEY: Uint8Array = (() => {
  const key = process.env.JWT_SECRET;
  if (!key) {
    throw new Error('JWT_SECRET is not defined');
  }
  return new TextEncoder().encode(key);
})();

/**
 * Get all products (including inactive) - admin only
 */
export async function getAllProducts(token?: string): Promise<Product[]> {
  try {
    // Verify admin token
    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      throw new Error('Invalid or expired token');
    }

    const snapshot = await getDocs(collection(db, 'products'));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
}

/**
 * Get all products (alias for compatibility) - admin only
 */
export async function getProducts(token?: string): Promise<Product[]> {
  return getAllProducts(token);
}

/**
 * Get single product by ID - admin only
 */
export async function getProductById(id: string, token?: string): Promise<Product | null> {
  try {
    // Verify admin token
    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      throw new Error('Invalid or expired token');
    }

    const docSnap = await getDoc(doc(db, 'products', id));
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

/**
 * Get all featured products (including inactive) - admin only
 */
export async function getAllFeaturedProducts(token?: string): Promise<Product[]> {
  try {
    // Verify admin token
    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      throw new Error('Invalid or expired token');
    }

    const snapshot = await getDocs(collection(db, 'featured_products'));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching all featured products:', error);
    throw error;
  }
}

/**
 * Get featured products (alias for compatibility) - admin only
 */
export async function getFeaturedProducts(token?: string): Promise<Product[]> {
  return getAllFeaturedProducts(token);
}

/**
 * Get single featured product by ID - admin only
 */
export async function getFeaturedProductById(id: string, token?: string): Promise<Product | null> {
  try {
    // Verify admin token
    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      throw new Error('Invalid or expired token');
    }

    const docSnap = await getDoc(doc(db, 'featured_products', id));
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Product;
  } catch (error) {
    console.error('Error fetching featured product by ID:', error);
    throw error;
  }
}

/**
 * Create featured product - admin only
 */
export async function createFeaturedProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  token?: string
): Promise<string> {
  try {
    // Verify admin token
    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      throw new Error('Invalid or expired token');
    }

    const docRef = await addDoc(collection(db, 'featured_products'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating featured product:', error);
    throw error;
  }
}

/**
 * Update featured product - admin only
 */
export async function updateFeaturedProduct(
  id: string,
  partial: Partial<Product>,
  token?: string
): Promise<void> {
  try {
    // Verify admin token
    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      throw new Error('Invalid or expired token');
    }

    await setDoc(
      doc(db, 'featured_products', id),
      {
        ...partial,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating featured product:', error);
    throw error;
  }
}

/**
 * Delete featured product (soft delete - set isActive: false) - admin only
 */
export async function deleteFeaturedProduct(id: string, token?: string): Promise<void> {
  try {
    // Verify admin token
    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      throw new Error('Invalid or expired token');
    }

    await setDoc(
      doc(db, 'featured_products', id),
      {
        isActive: false,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error deleting featured product:', error);
    throw error;
  }
}

/**
 * Restore featured product - admin only
 */
export async function restoreFeaturedProduct(id: string, token?: string): Promise<void> {
  try {
    // Verify admin token
    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      throw new Error('Invalid or expired token');
    }

    await setDoc(
      doc(db, 'featured_products', id),
      {
        isActive: true,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error restoring featured product:', error);
    throw error;
  }
}

/**
 * Update product (regular, not featured) - admin only
 */
export async function updateProduct(
  id: string,
  partial: Partial<Product>,
  token?: string
): Promise<void> {
  try {
    // Verify admin token
    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      throw new Error('Invalid or expired token');
    }

    await setDoc(
      doc(db, 'products', id),
      {
        ...partial,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Delete product (soft delete - set isActive: false) - admin only
 */
export async function deleteProduct(id: string, token?: string): Promise<void> {
  try {
    // Verify admin token
    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      throw new Error('Invalid or expired token');
    }

    await setDoc(
      doc(db, 'products', id),
      {
        isActive: false,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * Create product - admin only
 */
export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  token?: string
): Promise<string> {
  try {
    // Verify admin token
    if (!token) {
      throw new Error('Unauthorized');
    }

    try {
      await jwtVerify(token, SECRET_KEY);
    } catch {
      throw new Error('Invalid or expired token');
    }

    const docRef = await addDoc(collection(db, 'products'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}
