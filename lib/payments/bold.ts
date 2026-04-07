export interface BoldPaymentRequest {
  amount: number;
  currency?: string;
  description: string;
}

/**
 * Generates a Bold payment link by calling our internal API route.
 * @param data Payment details
 * @returns The payment URL to redirect the user to
 */
export async function generateBoldPaymentLink(data: BoldPaymentRequest): Promise<string> {
  const response = await fetch('/api/payments/bold', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to generate Bold payment link');
  }

  const result = await response.json();
  
  if (!result.paymentUrl) {
    throw new Error('No payment URL returned from API');
  }
  
  return result.paymentUrl;
}
