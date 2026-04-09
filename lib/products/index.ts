/**
 * Hybrid Query Layer — lib/products/index.ts
 *
 * Single entry point for all product data fetching.
 * Merges locally-cached FEATURED_PRODUCTS with Firestore.
 * Local products always take precedence on id conflicts.
 * Never throws — Firestore failures fall back to local data with console.warn.
 */

import { FEATURED_PRODUCTS } from '@/lib/constants';
import {
  getActiveProducts,
  getProductsByCategory as firestoreGetProductsByCategory,
  getProductBySlug as firestoreGetProductBySlug,
} from '@/lib/firebase/firestore';
import type { Product } from '@/lib/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function withSource(product: Product, source: 'local' | 'firestore'): Product {
  return { ...product, source };
}

/**
 * Dedup by id — local wins.
 * Insert local first so Firestore entries with the same id are skipped.
 */
function mergeProducts(
  localProducts: Product[],
  firestoreProducts: Product[]
): Product[] {
  const map = new Map<string, Product>();
  localProducts.forEach((p) => map.set(p.id, withSource(p, 'local')));
  firestoreProducts.forEach((p) => {
    if (!map.has(p.id)) {
      map.set(p.id, withSource(p, 'firestore'));
    }
  });
  return Array.from(map.values());
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the locally-cached featured products.
 * Sync, zero Firestore calls — safe for SSR and landing page.
 */
export function getFeaturedProducts(): Product[] {
  return FEATURED_PRODUCTS.map((p) => withSource(p, 'local'));
}

/**
 * Returns all active products: local + Firestore, deduped by id.
 * Firestore errors fall back gracefully to local-only.
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const firestoreProducts = await getActiveProducts();
    return mergeProducts(FEATURED_PRODUCTS, firestoreProducts);
  } catch (err) {
    console.warn('Firestore unavailable, using local products only', err);
    return FEATURED_PRODUCTS.map((p) => withSource(p, 'local'));
  }
}

/**
 * Hybrid slug lookup.
 * Step 1: local check (sync, < 5ms).
 * Step 2: Firestore fallback if not found locally.
 * Returns null if not found in either source.
 */
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  // Fast local check first
  const local = FEATURED_PRODUCTS.find((p) => p.slug === slug);
  if (local) return withSource(local, 'local');

  // Firestore fallback
  try {
    const firestoreProduct = await firestoreGetProductBySlug(slug);
    if (!firestoreProduct) return null;
    return withSource(firestoreProduct, 'firestore');
  } catch (err) {
    console.warn('Firestore unavailable for slug lookup', slug, err);
    return null;
  }
}

/**
 * Returns products for a given category, merging local + Firestore.
 * Firestore errors fall back to local-only.
 */
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const localFiltered = FEATURED_PRODUCTS.filter(
    (p) => p.category === category
  );

  try {
    const firestoreFiltered = await firestoreGetProductsByCategory(category);
    return mergeProducts(localFiltered, firestoreFiltered);
  } catch (err) {
    console.warn(
      'Firestore unavailable for category lookup',
      category,
      err
    );
    return localFiltered.map((p) => withSource(p, 'local'));
  }
}

/**
 * Full-text search across all products (name + category + brand).
 * Calls getAllProducts() then filters client-side.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const all = await getAllProducts();
  const q = query.trim().toLowerCase();
  if (!q) return all;
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.brand ?? '').toLowerCase().includes(q)
  );
}
