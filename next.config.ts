import type { NextConfig } from "next";

// Security: Use specific S3 bucket hostname, not wildcard
// Extracts bucket hostname from env var or defaults to known production bucket
const getS3Hostname = (): string => {
  const s3BaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL;

  if (s3BaseUrl) {
    try {
      const url = new URL(s3BaseUrl);
      return url.hostname ?? 'serviteka-products.s3.us-east-1.amazonaws.com';
    } catch {
      // invalid URL — use default bucket
    }
  }

  // Default to specific bucket if no env var set
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET || 'serviteka-products';
  const region = process.env.NEXT_PUBLIC_S3_REGION || 'us-east-1';
  return `${bucketName}.s3.${region}.amazonaws.com`;
};

const s3Hostname = getS3Hostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: s3Hostname,
      },
    ],
  },
};

export default nextConfig;
