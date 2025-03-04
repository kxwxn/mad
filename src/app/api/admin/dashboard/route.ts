import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia'
});

export async function GET() {
  try {
    // 모든 결제 목록을 가져오기 위한 재귀 함수
    async function getAllPayments(): Promise<Stripe.PaymentIntent[]> {
      const payments: Stripe.PaymentIntent[] = [];
      let hasMore = true;
      let lastPaymentId: string | undefined;

      while (hasMore) {
        const response = await stripe.paymentIntents.list({
          limit: 100,
          starting_after: lastPaymentId,
        });

        payments.push(...response.data);
        hasMore = response.has_more;
        lastPaymentId = response.data[response.data.length - 1]?.id;
      }

      return payments;
    }

    const allPayments = await getAllPayments();

    const recentPayments = await Promise.all(
      allPayments.map(async (payment) => {
        try {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: payment.id,
            expand: ['data.line_items']
          });
          
          const session = sessions.data[0];
          const items = await Promise.all(
            (session?.line_items?.data || [])
              .filter(item => item.price !== null)
              .map(async (item) => {
                const product = await stripe.products.retrieve(
                  item.price!.product as string
                );

                return {
                  name: item.description || '',
                  quantity: item.quantity || 0,
                  price: (item.amount_total || 0) / 100,
                  image: product.images?.[0] || '/api/placeholder/400/400'
                };
              })
          );

          return {
            id: payment.id,
            amount: payment.amount / 100,
            customerEmail: session?.customer_details?.email || 'N/A',
            status: payment.status,
            created: payment.created,
            items: items
          };
        } catch {
          console.error('Error processing payment data');
          return {
            id: payment.id,
            amount: payment.amount / 100,
            customerEmail: 'N/A',
            status: payment.status,
            created: payment.created,
            items: []
          };
        }
      })
    );

    return NextResponse.json({
      totalRevenue: allPayments.reduce((sum, payment) => sum + payment.amount, 0) / 100,
      totalOrders: allPayments.length,
      recentPayments
    });

  } catch {
    console.error('Dashboard data fetch error occurred');
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data',
        totalRevenue: 0,
        totalOrders: 0,
        recentPayments: []
      },
      { status: 500 }
    );
  }
}