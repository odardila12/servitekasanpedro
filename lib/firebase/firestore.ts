import { collection, getDocs, doc, getDoc, query, QueryConstraint } from "firebase/firestore";
import { db } from "./config";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  [key: string]: any;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  [key: string]: any;
}

export async function getProducts(constraints: QueryConstraint[] = []): Promise<Product[]> {
  const productsRef = collection(db, "products");
  const q = query(productsRef, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, "products", id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data()
  } as Product;
}

export async function getServices(constraints: QueryConstraint[] = []): Promise<Service[]> {
  const servicesRef = collection(db, "services");
  const q = query(servicesRef, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Service[];
}

export async function getServiceById(id: string): Promise<Service | null> {
  const docRef = doc(db, "services", id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data()
  } as Service;
}
