import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  limit,
  QueryConstraint,
  addDoc,
  updateDoc,
  serverTimestamp,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Product } from '@/lib/types';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

// ── Converter ────────────────────────────────────────────────────────────────

/** Converts Firestore Timestamps → ISO strings and enforces Product shape */
const productConverter: FirestoreDataConverter<Product> = {
  toFirestore(product: Product) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...data } = product;
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Product {
    const data = snapshot.data();
    return {
      ...data,
      id: snapshot.id,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt,
    } as Product;
  },
};

// ── Client-side reads (Firebase client SDK) ──────────────────────────────────

export async function getProducts(
  constraints: QueryConstraint[] = []
): Promise<Product[]> {
  const productsRef = collection(db, 'products').withConverter(productConverter);
  const q = query(productsRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, 'products', id).withConverter(productConverter);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return snapshot.data();
}

export async function getActiveProducts(): Promise<Product[]> {
  const productsRef = collection(db, 'products').withConverter(productConverter);
  const q = query(productsRef, where('isActive', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const productsRef = collection(db, 'products').withConverter(productConverter);
  const q = query(
    productsRef,
    where('isActive', '==', true),
    where('category', '==', category)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const productsRef = collection(db, 'products').withConverter(productConverter);
  const q = query(productsRef, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
}

// ── Client-side CRUD (Firebase client SDK) ───────────────────────────────────

/** Creates a new product document. Returns the new document id. */
export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const productsRef = collection(db, 'products');
  const docRef = await addDoc(productsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Updates an existing product document partially. */
export async function updateProduct(
  id: string,
  partial: Partial<Product>
): Promise<void> {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...partial,
    updatedAt: serverTimestamp(),
  });
}

/** Soft-deletes a product by setting isActive: false. */
export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    isActive: false,
    updatedAt: serverTimestamp(),
  });
}

// ── Services ────────────────────────────────────────────────────────────────

export async function getServices(
  constraints: QueryConstraint[] = []
): Promise<Service[]> {
  const servicesRef = collection(db, 'services');
  const q = query(servicesRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Service[];
}

export async function getServiceById(id: string): Promise<Service | null> {
  const docRef = doc(db, 'services', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Service;
}

// ── Featured Products ────────────────────────────────────────────────────────

export async function getFeaturedProducts(
  constraints: QueryConstraint[] = []
): Promise<Product[]> {
  const productsRef = collection(db, 'featured_products').withConverter(productConverter);
  const q = query(productsRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

export async function getFeaturedProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, 'featured_products', id).withConverter(productConverter);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return snapshot.data();
}

export async function getActiveFeaturedProducts(): Promise<Product[]> {
  const productsRef = collection(db, 'featured_products').withConverter(productConverter);
  const q = query(productsRef, where('isActive', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

export async function createFeaturedProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const productsRef = collection(db, 'featured_products');
  const docRef = await addDoc(productsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateFeaturedProduct(
  id: string,
  partial: Partial<Product>
): Promise<void> {
  const docRef = doc(db, 'featured_products', id);
  await updateDoc(docRef, {
    ...partial,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFeaturedProduct(id: string): Promise<void> {
  const docRef = doc(db, 'featured_products', id);
  await updateDoc(docRef, {
    isActive: false,
    updatedAt: serverTimestamp(),
  });
}

export async function restoreFeaturedProduct(id: string): Promise<void> {
  const docRef = doc(db, 'featured_products', id);
  await updateDoc(docRef, {
    isActive: true,
    updatedAt: serverTimestamp(),
  });
}
