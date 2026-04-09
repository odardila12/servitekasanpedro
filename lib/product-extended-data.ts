import type { ProductExtendedData } from './types';

/**
 * Extended data for products shown on detail pages.
 * Keyed by product ID. Products not listed get auto-generated defaults.
 */
export const PRODUCT_EXTENDED_DATA: Record<string, ProductExtendedData> = {
  // --- LLANTAS ---
  '1': {
    stock: 18,
    specifications: {
      brand: 'Michelin',
      size: '205/55 R16',
      speedRating: 'W - 270 km/h',
      warranty: '3 años por defecto de fabricación',
    },
    productReviews: [
      { id: 'r1-1', author: 'Juan García', rating: 5, comment: 'Excelente calidad, muy silenciosas en autopista', date: '2024-03-15' },
      { id: 'r1-2', author: 'María López', rating: 4, comment: 'Muy buena llanta, entrega rápida', date: '2024-03-10' },
      { id: 'r1-3', author: 'Carlos Ramírez', rating: 5, comment: 'Las mejores que he comprado, agarre increíble', date: '2024-02-28' },
    ],
  },
  '2': {
    stock: 24,
    specifications: {
      brand: 'Moura',
      capacity: '60Ah',
      type: 'Convencional',
      voltage: '12V',
      warranty: '18 meses garantía',
    },
    productReviews: [
      { id: 'r2-1', author: 'Pedro Herrera', rating: 5, comment: 'Arranca perfecto en frío, excelente batería', date: '2024-04-01' },
      { id: 'r2-2', author: 'Ana Suárez', rating: 5, comment: 'Lleva 2 años y funcionando de maravilla', date: '2024-03-22' },
    ],
  },
  '3': {
    stock: 12,
    specifications: {
      brand: 'Bridgestone',
      size: '215/60 R15',
      speedRating: 'H - 210 km/h',
      warranty: '3 años por defecto de fabricación',
    },
    productReviews: [
      { id: 'r3-1', author: 'Luis Moreno', rating: 4, comment: 'Buen rendimiento en ciudad, ruido mínimo', date: '2024-03-05' },
      { id: 'r3-2', author: 'Sofia Castro', rating: 4, comment: 'Durables y económicas', date: '2024-02-18' },
    ],
  },
  '4': {
    stock: 8,
    specifications: {
      brand: 'Continental',
      size: '225/45 R17',
      speedRating: 'W - 270 km/h',
      warranty: '3 años por defecto de fabricación',
    },
    productReviews: [
      { id: 'r4-1', author: 'Miguel Torres', rating: 5, comment: 'Excelente llanta de alto rendimiento', date: '2024-04-02' },
      { id: 'r4-2', author: 'Laura Jiménez', rating: 5, comment: 'El agarre en curvas es impresionante', date: '2024-03-14' },
      { id: 'r4-3', author: 'David Vargas', rating: 4, comment: 'Un poco costosa pero vale la pena', date: '2024-02-25' },
    ],
  },
  '5': {
    stock: 15,
    specifications: {
      brand: 'Pirelli',
      size: '195/55 R16',
      speedRating: 'V - 240 km/h',
      warranty: '3 años por defecto de fabricación',
    },
    productReviews: [
      { id: 'r5-1', author: 'Roberto Peña', rating: 4, comment: 'Excelente para ciudad y carretera', date: '2024-03-28' },
    ],
  },
  '6': {
    stock: 30,
    specifications: {
      brand: 'Goodyear',
      size: '185/65 R15',
      speedRating: 'H - 210 km/h',
      warranty: '3 años por defecto de fabricación',
    },
    productReviews: [
      { id: 'r6-1', author: 'Carmen Díaz', rating: 4, comment: 'Buena relación calidad-precio', date: '2024-04-05' },
      { id: 'r6-2', author: 'Andrés Ruiz', rating: 4, comment: 'Económicas y duraderas', date: '2024-03-17' },
    ],
  },
  '7': {
    stock: 22,
    specifications: {
      brand: 'Hankook',
      size: '195/65 R15',
      speedRating: 'H - 210 km/h',
      warranty: '3 años por defecto de fabricación',
    },
    productReviews: [
      { id: 'r7-1', author: 'Patricia González', rating: 4, comment: 'Buena llanta para uso diario', date: '2024-03-01' },
    ],
  },
  '8': {
    stock: 5,
    specifications: {
      brand: 'Yokohama',
      size: '245/40 R18',
      speedRating: 'Y - 300 km/h',
      warranty: '3 años por defecto de fabricación',
    },
    productReviews: [
      { id: 'r8-1', author: 'Fernando López', rating: 5, comment: 'Llanta de primer nivel, excelente para deportivos', date: '2024-04-01' },
      { id: 'r8-2', author: 'Isabella Martínez', rating: 5, comment: 'Increíble adherencia, manejo preciso', date: '2024-03-20' },
    ],
  },
  '12': {
    stock: 14,
    specifications: {
      brand: 'Bosch',
      capacity: '70Ah',
      type: 'AGM',
      voltage: '12V',
      warranty: '24 meses garantía',
    },
    productReviews: [
      { id: 'r12-1', author: 'Juliana Ríos', rating: 5, comment: 'Perfecta para vehículos con start-stop', date: '2024-03-25' },
      { id: 'r12-2', author: 'Ernesto Campos', rating: 5, comment: 'La mejor batería del mercado, arranca siempre', date: '2024-03-10' },
    ],
  },
};

/**
 * Returns extended data for a product ID.
 * Falls back to auto-generated defaults if not explicitly defined.
 */
export function getProductExtendedData(
  productId: string,
  productName: string,
  brand: string
): ProductExtendedData {
  if (PRODUCT_EXTENDED_DATA[productId]) {
    return PRODUCT_EXTENDED_DATA[productId];
  }

  // Auto-generated defaults for products without explicit data
  const stockSeed = parseInt(productId, 10) || 1;
  const stock = ((stockSeed * 7) % 90) + 10; // deterministic 10–99

  return {
    stock,
    specifications: {
      brand: brand.charAt(0).toUpperCase() + brand.slice(1),
      warranty: '12 meses garantía de fábrica',
    },
    productReviews: [
      {
        id: `${productId}-auto-r1`,
        author: 'Cliente verificado',
        rating: 4,
        comment: `Buen producto, ${productName} cumple con lo prometido`,
        date: '2024-01-15',
      },
    ],
  };
}
