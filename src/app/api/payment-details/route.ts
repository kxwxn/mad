import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product']
    });

    // 현재 시간을 타임스탬프로 사용 (session.created가 없을 경우)
    const orderDate = new Date().getTime();

    const paymentDetails = {
      amount_total: session.amount_total,
      created: orderDate,
      payment_intent: sessionId.slice(-8).toUpperCase(), // 간단한 주문번호
      items: session.line_items?.data.map(item => ({
        name: item.description,
        quantity: item.quantity,
        price: item.amount_total ? item.amount_total / 100 : 0,
        image: item.price?.product?.images?.[0] || '/placeholder-image.jpg' // 기본 이미지 추가
      })) || []
    };

    console.log('Payment Details:', paymentDetails); // 디버깅용 로그

    return NextResponse.json(paymentDetails);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment details' },
      { status: 500 }
    );
  }
}