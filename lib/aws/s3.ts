import 'server-only';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const PRESIGNED_URL_TTL = 900; // 15 minutes

interface PresignedUploadResult {
  presignedUrl: string;
  publicUrl: string;
  key: string;
}

/**
 * Generates a presigned S3 URL for uploading a product image.
 *
 * @param productId - The product identifier (used as part of the S3 key path)
 * @param fileName  - Original file name (sanitized into the key)
 * @param contentType - MIME type of the file (e.g. image/jpeg)
 * @returns presignedUrl to PUT the file, publicUrl to access it, and the S3 key
 */
export async function generatePresignedUploadUrl(
  productId: string,
  fileName: string,
  contentType: string
): Promise<PresignedUploadResult> {
  const key = `products/${productId}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_TTL,
  });

  const publicUrl = `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${key}`;

  return { presignedUrl, publicUrl, key };
}
