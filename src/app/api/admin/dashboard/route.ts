import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia'
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 최근 결제 목록 가져오기
    const payments = await stripe.paymentIntents.list({
      limit: 100,
      expand: ['data.latest_charge'],
    });

    // 페이지네이션 처리
    const paginatedPayments = payments.data.slice(offset, offset + limit);
    const totalPages = Math.ceil(payments.data.length / limit);

    const recentPayments = await Promise.all(
      paginatedPayments.map(async (payment) => {
        try {
          // 결제 세션 정보 가져오기
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: payment.id,
            limit: 1,
            expand: ['data.line_items']
          });
          
          const session = sessions.data[0];
          if (!session) {
            return {
              id: payment.id,
              amount: payment.amount / 100,
              customerEmail: 'N/A',
              status: payment.status,
              created: payment.created,
              items: []
            };
          }

          // 환불 상태 확인
          let status: string = payment.status;
          if (payment.latest_charge) {
            const charge = payment.latest_charge as Stripe.Charge;
            if (charge.refunded) {
              status = 'refunded';
            }
          }

          // 상품 정보 가져오기
          const items = await Promise.all(
            (session.line_items?.data || [])
              .filter(item => item.price !== null)
              .map(async (item) => {
                try {
                  const product = await stripe.products.retrieve(
                    item.price!.product as string
                  );

                  return {
                    name: item.description || product.name || '',
                    quantity: item.quantity || 0,
                    price: (item.amount_total || 0) / 100,
                    image: product.images?.[0] || '/api/placeholder/400/400'
                  };
                } catch (error) {
                  console.error('Error fetching product:', error);
                  return {
                    name: item.description || 'Unknown Product',
                    quantity: item.quantity || 0,
                    price: (item.amount_total || 0) / 100,
                    image: '/api/placeholder/400/400'
                  };
                }
              })
          );

          return {
            id: payment.id,
            amount: payment.amount / 100,
            customerEmail: session.customer_details?.email || 'N/A',
            status: status,
            created: payment.created,
            items: items
          };
        } catch (error) {
          console.error('Error processing payment:', error);
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
      totalRevenue: payments.data.reduce((sum, payment) => sum + payment.amount, 0) / 100,
      totalOrders: payments.data.length,
      totalPages,
      currentPage: page,
      recentPayments
    });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data',
        totalRevenue: 0,
        totalOrders: 0,
        totalPages: 0,
        currentPage: 1,
        recentPayments: []
      },
      { status: 500 }
    );
  }
}