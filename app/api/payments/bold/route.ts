import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, Timestamp, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, addDoc, query, where, orderBy, limit } from '@/lib/services/firestore';
import { logPaymentAttempt } from '@/app/actions/audit-logger';

// Input validation schema
const BoldPaymentSchema = z.object({
  amount: z.number().int().min(100).max(10000000), // 100 COP minimum, 10M max
  currency: z.enum(['COP']), // Whitelist: only COP allowed
  description: z.string().max(255).regex(/^[a-zA-Z0-9\s\-.,ñáéíóúÑÁÉÍÓÚ]*$/), // No special chars
  cartItems: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
        price: z.number().int().min(0), // Client-provided price for verification
      })
    )
    .optional()
    .default([]),
});

type BoldPaymentRequest = z.infer<typeof BoldPaymentSchema>;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate input schema
    let validatedData: BoldPaymentRequest;
    try {
      validatedData = BoldPaymentSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input', details: error.issues },
          { status: 400 }
        );
      }
      throw error;
    }

    const { amount, currency, description, cartItems } = validatedData;

    // 2. Fetch real-time prices from Firestore and verify cart integrity
    let totalFromDb = 0;
    const productPromises = cartItems.map((item) =>
      getDoc(doc(db, 'products', item.productId))
    );

    const snapshots = await Promise.all(productPromises);

    for (let i = 0; i < snapshots.length; i++) {
      const docSnap = snapshots[i];
      const item = cartItems[i];

      if (!docSnap.exists()) {
        console.error(`Fraud detection: Product ${item.productId} does not exist in database`);
        await logPaymentAttempt('unknown', amount, currency, 'FRAUD_DETECTED', {
          reason: 'Product not found',
          productId: item.productId,
        });
        return NextResponse.json(
          { error: 'Cart out of date, refresh and try again' },
          { status: 400 }
        );
      }

      const dbProduct = docSnap.data();
      const dbPrice = dbProduct?.price;
      const dbStock = dbProduct?.stock;

      // Verify price matches
      if (dbPrice !== item.price) {
        console.warn(
          `Fraud detection: Price mismatch for product ${item.productId}. Client: ${item.price}, DB: ${dbPrice}`
        );
        await logPaymentAttempt('unknown', amount, currency, 'FRAUD_DETECTED', {
          reason: 'Price mismatch',
          productId: item.productId,
          clientPrice: item.price,
          dbPrice,
        });
        return NextResponse.json(
          { error: 'Cart out of date, refresh and try again' },
          { status: 400 }
        );
      }

      // Verify stock availability
      if (typeof dbStock === 'number' && dbStock < item.quantity) {
        console.warn(
          `Fraud detection: Insufficient stock for product ${item.productId}. Available: ${dbStock}, Requested: ${item.quantity}`
        );
        await logPaymentAttempt('unknown', amount, currency, 'FRAUD_DETECTED', {
          reason: 'Insufficient stock',
          productId: item.productId,
          availableStock: dbStock,
          requestedQuantity: item.quantity,
        });
        return NextResponse.json(
          { error: 'Cart out of date, refresh and try again' },
          { status: 400 }
        );
      }

      // Calculate total from DB prices
      totalFromDb += dbPrice * item.quantity;
    }

    // 3. Verify total amount matches server-calculated amount
    if (totalFromDb !== amount) {
      console.error(
        `Fraud detection: Amount mismatch. Client: ${amount}, Calculated from DB: ${totalFromDb}`
      );
      await logPaymentAttempt('unknown', amount, currency, 'FRAUD_DETECTED', {
        reason: 'Amount mismatch',
        clientAmount: amount,
        calculatedAmount: totalFromDb,
      });
      return NextResponse.json(
        { error: 'Cart out of date, refresh and try again' },
        { status: 400 }
      );
    }

    const BOLD_SECRET_KEY = process.env.BOLD_SECRET_KEY;
    if (!BOLD_SECRET_KEY) {
      console.warn('BOLD_SECRET_KEY is not set. Using mock payment flow.');
    }

    // Log successful payment initialization
    await logPaymentAttempt('unknown', amount, currency, 'SUCCESS', {
      description,
      itemCount: cartItems.length,
    });

    // For the scope of this project, we return a mock URL if not fully integrated
    const paymentUrl = `https://checkout.bold.co/mock?amount=${amount}&curr=${currency}&desc=${encodeURIComponent(description)}`;

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error('Error generating Bold payment link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
