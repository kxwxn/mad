import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia'
});

interface CartItem {
  name: string;
  imageUrl: string;
  selectedSize: string;
  price: number;
  quantity: number;
  id: string;
}

function isValidCartItem(item: any): item is CartItem {
  return (
    typeof item.name === 'string' &&
    typeof item.imageUrl === 'string' &&
    typeof item.selectedSize === 'string' &&
    typeof item.price === 'number' && item.price > 0 &&
    typeof item.quantity === 'number' && item.quantity > 0 && Number.isInteger(item.quantity) &&
    typeof item.id === 'string'
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided or invalid items format' },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!isValidCartItem(item)) {
        return NextResponse.json(
          { error: 'Invalid cart item data' },
          { status: 400 }
        );
      }
    }

    // Stripe checkout session 생성
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: items.map((item: CartItem) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: item.imageUrl ? [item.imageUrl] : [],
            metadata: {
              productId: item.id,
              selectedSize: item.selectedSize || 'OS',
            },
          },
          unit_amount: Math.round(item.price * 100), // Stripe는 센트 단위 사용
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/cart`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    if (error.type === 'StripeCardError') {
      console.error('Stripe card error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else if (error.type === 'StripeInvalidRequestError') {
      console.error('Stripe invalid request error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else if (error.type === 'StripeAPIError') {
      console.error('Stripe API error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Checkout error occurred:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
