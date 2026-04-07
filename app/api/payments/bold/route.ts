import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'COP', description } = body;

    if (!amount || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const BOLD_SECRET_KEY = process.env.BOLD_SECRET_KEY;
    if (!BOLD_SECRET_KEY) {
      console.warn('BOLD_SECRET_KEY is not set. Using mock payment flow.');
    }

    // In a real integration, this would call the actual Bold API:
    /*
    const response = await fetch('https://payments.api.bold.co/v2/payment-links', {
      method: 'POST',
      headers: {
        'Authorization': `ApiKey ${BOLD_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        description
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Bold API error: ${response.statusText}`);
    }

    const data = await response.json();
    // Assuming data contains a payment_url field
    return NextResponse.json({ paymentUrl: data.payment_url });
    */

    // For the scope of this project, we return a mock URL if not fully integrated
    const paymentUrl = `https://checkout.bold.co/mock?amount=${amount}&desc=${encodeURIComponent(description)}`;

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error('Error generating Bold payment link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
