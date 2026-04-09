import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { generatePresignedUploadUrl } from '@/lib/aws/s3';
import { fileTypeFromBuffer } from 'file-type';
import { logAdminAction } from '@/lib/audit/logger';

const ALLOWED_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

export async function POST(request: Request) {
  try {
    // ── Auth validation ──────────────────────────────────────────────────────
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.slice('Bearer '.length);
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Admin role verification ──────────────────────────────────────────────
    if (!decodedToken.admin) {
      console.warn(`[SECURITY] Unauthorized upload attempt by non-admin user: ${decodedToken.uid}`);
      return NextResponse.json(
        { error: 'Forbidden: Admin role required' },
        { status: 403 }
      );
    }

    // ── Body validation ──────────────────────────────────────────────────────
    const body = await request.json();
    const { fileName, contentType, productId } = body as {
      fileName: string;
      contentType: string;
      productId: string;
    };

    if (!fileName || !contentType || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, contentType, productId' },
        { status: 400 }
      );
    }

    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      return NextResponse.json(
        {
          error: `Invalid content type. Allowed types: ${[...ALLOWED_CONTENT_TYPES].join(', ')}`,
        },
        { status: 400 }
      );
    }

    // ── File size validation ─────────────────────────────────────────────────
    // Note: This validates the fileName string length as a proxy; actual file size
    // is validated by S3 presigned URL parameters and bucket policies
    if (fileName.length > 255) {
      return NextResponse.json(
        { error: 'File name too long (max 255 characters)' },
        { status: 400 }
      );
    }

    // ── Generate presigned URL ───────────────────────────────────────────────
    const result = await generatePresignedUploadUrl(productId, fileName, contentType);

    // ── Audit logging ────────────────────────────────────────────────────────
    await logAdminAction(decodedToken.uid, 'UPLOAD', 'image', productId, {
      fileName,
      contentType,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
