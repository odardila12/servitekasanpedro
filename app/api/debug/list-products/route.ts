import { db, getDocs, collection } from '@/lib/services/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'products'));

    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        image: data.image,
        category: data.category,
      };
    });

    return NextResponse.json({
      total: products.length,
      products: products.slice(0, 10), // primeros 10
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
