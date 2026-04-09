// Shared product types

export interface ProductReview {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO date string YYYY-MM-DD
}

export interface ProductSpecifications {
  brand?: string;
  size?: string;
  speedRating?: string;
  warranty?: string;
  voltage?: string;
  capacity?: string;
  type?: string;
  viscosity?: string;
  volume?: string;
  [key: string]: string | undefined;
}

export interface ProductExtendedData {
  stock: number;
  specifications: ProductSpecifications;
  productReviews: ProductReview[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  badge?: string;
  specs?: Record<string, string | undefined>;
  description?: string;
  // Extended data (optional — populated from PRODUCT_EXTENDED_DATA)
  stock?: number;
  specifications?: ProductSpecifications;
  productReviews?: ProductReview[];
  // Firebase/migration fields
  isActive?: boolean;
  isFeatured?: boolean;
  source?: 'local' | 'firestore';
  createdAt?: string;
  updatedAt?: string;
}
