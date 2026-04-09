import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { generatePresignedUploadUrl } from '@/lib/aws/s3';
import { fileTypeFromBuffer } from 'file-type';
import { logAdminAction } from '@/app/actions/audit-logger';

const SECRET_KEY: Uint8Array = (() => {
  const key = process.env.JWT_SECRET;
  if (!key) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return new TextEncoder().encode(key);
})();

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
      const { payload } = await jwtVerify(token, SECRET_KEY);
      decodedToken = payload;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Admin role verification ──────────────────────────────────────────────
    if (!decodedToken.admin) {
      console.warn(`[SECURITY] Unauthorized upload attempt by non-admin user: ${decodedToken.uid as string}`);
      return NextResponse.json(
        { error: 'Forbidden: Admin role required' },
        { status: 403 }
      );
    }

    // ── Body validation ──────────────────────────────────────────────────────
    const body = await request.json();
    const { fileName, contentType, productId, fileBuffer } = body as {
      fileName: string;
      contentType: string;
      productId: string;
      fileBuffer: string; // Base64 encoded file bytes
    };

    if (!fileName || !contentType || !productId || !fileBuffer) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, contentType, productId, fileBuffer' },
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

    // ── File name validation ─────────────────────────────────────────────────
    if (fileName.length > 255) {
      return NextResponse.json(
        { error: 'File name too long (max 255 characters)' },
        { status: 400 }
      );
    }

    // ── Magic byte validation (CRITICAL SECURITY FIX) ──────────────────────────
    // Validate actual file type from magic bytes, not from client-provided MIME type
    // This prevents attacks like uploading .exe as .jpg by renaming
    let buffer: Buffer;
    try {
      buffer = Buffer.from(fileBuffer, 'base64');
    } catch {
      return NextResponse.json(
        { error: 'Invalid file buffer encoding' },
        { status: 400 }
      );
    }

    // Check actual file size before processing
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 413 }
      );
    }

    // Validate file type from magic bytes (not from client header)
    const detectedType = await fileTypeFromBuffer(buffer);
    if (!detectedType || !ALLOWED_CONTENT_TYPES.has(detectedType.mime)) {
      console.warn(
        `[SECURITY] File type mismatch detected. Expected: ${contentType}, Actual: ${detectedType?.mime || 'unknown'}, File: ${fileName}, User: ${decodedToken.uid}`
      );
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP allowed.' },
        { status: 400 }
      );
    }

    // ── Generate presigned URL ───────────────────────────────────────────────
    const result = await generatePresignedUploadUrl(productId, fileName, detectedType.mime);

    // ── Audit logging ────────────────────────────────────────────────────────
    await logAdminAction(decodedToken.uid as string, 'UPLOAD', 'image', productId, {
      fileName,
      detectedMime: detectedType.mime,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
