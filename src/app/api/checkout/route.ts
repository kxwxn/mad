import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getRequiredEnv, getRequiredPublicEnv } from '@/utils/env';

// Stripe 인스턴스를 지연 초기화하도록 변경
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    try {
      const stripeSecretKey = getRequiredEnv('STRIPE_SECRET_KEY');
      stripeInstance = new Stripe(stripeSecretKey, {
        apiVersion: '2025-02-24.acacia'
      });
    } catch (error) {
      console.error('❌ Failed to initialize Stripe:', error);
      throw error;
    }
  }
  return stripeInstance;
}

function getSiteUrl(): string {
  try {
    return getRequiredPublicEnv('NEXT_PUBLIC_SITE_URL');
  } catch (error) {
    console.error('❌ Failed to get site URL:', error);
    throw error;
  }
}

interface CartItem {
  name: string;
  imageUrl: string; // 빈 문자열도 허용
  selectedSize: string;
  price: number;
  quantity: number;
  id: string | number; // 문자열 또는 숫자 허용
  selectedColor?: string; // 선택적 필드
}

export async function POST(req: Request) {
  try {
    // 환경 변수 및 Stripe 초기화 확인
    let stripe: Stripe;
    let siteUrl: string;
    
    try {
      stripe = getStripe();
      siteUrl = getSiteUrl();
    } catch (envError) {
      const errorMessage = envError instanceof Error ? envError.message : 'Environment variable error';
      console.error('❌ Environment variable error:', errorMessage);
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: errorMessage,
          details: 'Please check server environment variables'
        },
        { status: 500 }
      );
    }

    // 요청 본문 파싱
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body', message: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided or invalid items format' },
        { status: 400 }
      );
    }

    // 각 아이템 검증
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // 먼저 기본 객체 체크
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return NextResponse.json(
          { error: `Invalid cart item at position ${i + 1}: item is not an object` },
          { status: 400 }
        );
      }
      
      const obj = item as Record<string, unknown>;
      
      // 각 필수 필드 검증 및 누락된 필드 목록 생성
      const missingFields: string[] = [];
      const invalidFields: string[] = [];
      
      // id는 문자열 또는 숫자 모두 허용
      if (obj.id === undefined || obj.id === null) {
        missingFields.push('id');
      } else if (typeof obj.id !== 'string' && typeof obj.id !== 'number') {
        invalidFields.push(`id (got: ${typeof obj.id})`);
      } else if (typeof obj.id === 'string' && obj.id.length === 0) {
        missingFields.push('id');
      }
      if (!obj.name || typeof obj.name !== 'string' || obj.name.length === 0) {
        missingFields.push('name');
      }
      if (typeof obj.price !== 'number' || obj.price <= 0) {
        if (obj.price === undefined) {
          missingFields.push('price');
        } else {
          invalidFields.push(`price (got: ${typeof obj.price}, value: ${obj.price})`);
        }
      }
      // imageUrl은 빈 문자열도 허용 (null이나 undefined도 기본값으로 처리)
      // 실제로는 빈 문자열이나 undefined도 허용해야 함
      if (obj.imageUrl !== undefined && obj.imageUrl !== null && typeof obj.imageUrl !== 'string') {
        invalidFields.push(`imageUrl (got: ${typeof obj.imageUrl})`);
      }
      // imageUrl이 undefined이면 빈 문자열로 설정
      if (obj.imageUrl === undefined || obj.imageUrl === null) {
        obj.imageUrl = '';
      }
      if (!obj.selectedSize || typeof obj.selectedSize !== 'string' || obj.selectedSize.length === 0) {
        missingFields.push('selectedSize');
      }
      if (typeof obj.quantity !== 'number' || obj.quantity <= 0 || !Number.isInteger(obj.quantity)) {
        if (obj.quantity === undefined) {
          missingFields.push('quantity');
        } else {
          invalidFields.push(`quantity (got: ${typeof obj.quantity}, value: ${obj.quantity})`);
        }
      }
      
      if (missingFields.length > 0 || invalidFields.length > 0) {
        const errorMessage = [
          `Invalid cart item at position ${i + 1}`,
          missingFields.length > 0 && `Missing fields: ${missingFields.join(', ')}`,
          invalidFields.length > 0 && `Invalid fields: ${invalidFields.join(', ')}`
        ].filter(Boolean).join('. ');
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Validation error:', {
            position: i + 1,
            missingFields,
            invalidFields,
            item,
          });
        }
        
        return NextResponse.json(
          { 
            error: errorMessage,
            position: i + 1,
            missingFields,
            invalidFields,
          },
          { status: 400 }
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: items.map((item: CartItem) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: item.imageUrl ? [item.imageUrl] : [],
            metadata: {
              productId: String(item.id), // Stripe metadata는 문자열만 허용
              selectedSize: item.selectedSize || 'OS',
            },
          },
          unit_amount: Math.round(item.price * 100), // Stripe는 센트 단위 사용
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${siteUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop/cart`,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Stripe session created:', {
        id: session.id,
        url: session.url,
        success_url: session.success_url,
        cancel_url: session.cancel_url,
      });
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error: unknown) {
    const err = error as { type?: string; message?: string } | undefined;
    
    console.error('Checkout error:', err?.message || error);
    
    if (err?.type === 'StripeCardError' || err?.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ 
        error: err.message || 'Payment processing error',
        type: err.type 
      }, { status: 400 });
    } else if (err?.type === 'StripeAPIError') {
      return NextResponse.json({ 
        error: err.message || 'Stripe API error',
        type: err.type 
      }, { status: 500 });
    }
    
    // 일반 에러 처리
    const errorMessage = err?.message || (error instanceof Error ? error.message : 'Internal server error');
    return NextResponse.json(
      { 
        error: errorMessage,
        details: 'An unexpected error occurred during checkout'
      },
      { status: 500 }
    );
  }
}
