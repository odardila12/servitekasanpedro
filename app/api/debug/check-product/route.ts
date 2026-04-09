import { db, getDocs, collection, query, where } from '@/lib/services/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug') || 'llanta-bridgestone-turanza-t005';

    const snapshot = await getDocs(
      query(
        collection(db, 'products'),
        where('slug', '==', slug)
      )
    );

    if (snapshot.empty) {
      return NextResponse.json({
        found: false,
        message: `Producto con slug "${slug}" no encontrado`,
      });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return NextResponse.json({
      found: true,
      id: doc.id,
      name: data.name,
      slug: data.slug,
      image: data.image,
      isValidImage: !!(data.image && (data.image.startsWith('http') || data.image.startsWith('s3'))),
      images: data.images || [],
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
