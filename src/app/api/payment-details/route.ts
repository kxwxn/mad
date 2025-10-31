import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getErrorMessage, getErrorStatus } from '@/lib/errorHandling';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET(request: NextRequest) {
  try {
    // URL에서 session_id 파라미터 가져오기
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Stripe에서 세션 정보 가져오기
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    // 결제 정보 구성
    const paymentDetails = {
      amount_total: session.amount_total || 0,
      created: session.created * 1000, // Unix 타임스탬프를 밀리초로 변환
      payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || sessionId,
      items:
        session.line_items?.data.map((item) => {
          const product = item.price?.product as Stripe.Product;
          const metadata = product.metadata || {};
          const productId = metadata.productId;
          
          if (process.env.NODE_ENV === 'development' && (!productId || productId === '')) {
            console.warn('Missing productId in metadata:', {
              metadata,
              productName: product.name,
            });
          }
          
          return {
            id: productId || '',
            name: product.name || item.description || "",
            quantity: item.quantity || 0,
            price: (item.amount_total || 0) / 100, // 센트 단위를 달러/유로 단위로 변환
            image: product.images?.[0] || undefined,
            selectedSize: metadata.selectedSize || 'OS',
          };
        }) || [],
    };

    return NextResponse.json(paymentDetails);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching payment details:', error);
    }
    const status = getErrorStatus(error);
    const message = getErrorMessage(error);
    
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
