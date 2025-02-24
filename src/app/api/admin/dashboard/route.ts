import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

export async function GET() {
  try {
    // 최근 결제 내역 조회 (최근 30일)
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
    
    const [payments, totalRevenue] = await Promise.all([
      stripe.paymentIntents.list({
        limit: 10,
        created: { gte: thirtyDaysAgo },
        expand: ['data.customer', 'data.payment_method']
      }),
      stripe.paymentIntents.list({
        created: { gte: thirtyDaysAgo },
        limit: 100
      })
    ]);

    const recentPayments = await Promise.all(
      payments.data.map(async (payment) => {
        // 관련 Checkout Session 조회
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: payment.id
        });
        const session = sessions.data[0];

        return {
          id: payment.id,
          amount: payment.amount / 100,
          customerEmail: session?.customer_details?.email || 'N/A',
          status: payment.status,
          created: payment.created,
          items: session?.line_items?.data.map(item => ({
            name: item.description || '',
            quantity: item.quantity || 0,
            price: (item.amount_total || 0) / 100
          })) || []
        };
      })
    );

    const totalAmount = totalRevenue.data.reduce(
      (sum, payment) => sum + payment.amount,
      0
    ) / 100;

    return NextResponse.json({
      totalRevenue: totalAmount,
      totalOrders: totalRevenue.data.length,
      recentPayments
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}