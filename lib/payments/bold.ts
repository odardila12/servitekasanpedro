import { z } from 'zod';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface BoldPaymentRequest {
  amount: number;
  currency: 'COP';
  description: string;
  cartItems: CartItem[];
}

// Client-side validation schema (mirrors server for UX)
const BoldPaymentClientSchema = z.object({
  amount: z.number().int().min(100).max(10000000),
  currency: z.enum(['COP']),
  description: z.string().max(255).regex(/^[a-zA-Z0-9\s\-.,ñáéíóúÑÁÉÍÓÚ]*$/),
  cartItems: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
      price: z.number().int().min(0),
    })
  ),
});

/**
 * Generates a Bold payment link by calling our internal API route.
 * Validates input on client side first, then server verifies all prices against DB.
 * @param data Payment details including cart items
 * @returns The payment URL to redirect the user to
 * @throws Error if validation fails or server rejects the request
 */
export async function generateBoldPaymentLink(data: BoldPaymentRequest): Promise<string> {
  // Client-side validation
  try {
    BoldPaymentClientSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid payment data: ${error.errors.map((e) => e.message).join(', ')}`);
    }
    throw error;
  }

  const response = await fetch('/api/payments/bold', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();

    // Handle specific error codes
    if (response.status === 400) {
      // Cart out of date or validation error
      if (errorData.error?.includes('Cart out of date')) {
        throw new Error('Cart out of date. Please refresh your cart and try again.');
      }
      throw new Error(errorData.error || 'Invalid payment data');
    }

    throw new Error(errorData.error || 'Failed to generate Bold payment link');
  }

  const result = await response.json();

  if (!result.paymentUrl) {
    throw new Error('No payment URL returned from API');
  }

  return result.paymentUrl;
}
