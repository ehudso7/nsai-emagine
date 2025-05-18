import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Mock the Stripe and Supabase dependencies
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/test-session' }),
        },
      },
      coupons: {
        list: jest.fn().mockResolvedValue({ 
          data: [{ percent_off: 20, duration: 'forever', id: 'coupon_id' }] 
        }),
        create: jest.fn().mockResolvedValue({ id: 'new_coupon_id', percent_off: 10 }),
      },
    };
  });
});

jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'user_id',
                stripe_customer_id: 'cus_test123',
                permanent_discount: 10,
              },
              error: null,
            }),
          }),
        }),
      }),
    }),
  };
});

describe('Stripe Checkout Session Creation', () => {
  let OLD_ENV: NodeJS.ProcessEnv;
  
  beforeEach(() => {
    OLD_ENV = process.env;
    process.env = {
      ...OLD_ENV,
      STRIPE_SECRET_KEY: 'sk_test_123',
      STRIPE_PRICE_BASIC: 'price_basic',
      STRIPE_PRICE_PRO: 'price_pro',
      STRIPE_PRICE_ENHANCED: 'price_enhanced',
      STRIPE_PRICE_ENTERPRISE: 'price_enterprise',
      STRIPE_PRICE_BASIC_ANNUAL: 'price_basic_annual',
      STRIPE_PRICE_PRO_ANNUAL: 'price_pro_annual',
      STRIPE_PRICE_ENHANCED_ANNUAL: 'price_enhanced_annual',
      STRIPE_PRICE_ENTERPRISE_ANNUAL: 'price_enterprise_annual',
      BASE_URL: 'https://example.com',
    };
  });
  
  afterEach(() => {
    process.env = OLD_ENV;
    jest.clearAllMocks();
  });

  it('validates required fields', async () => {
    // Import the handler after setting up mocks
    const { POST } = await import('../pages/api/stripe/create-checkout-session');
    
    const req = {
      json: jest.fn().mockResolvedValue({}),
    } as unknown as NextRequest;
    
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Email and plan are required');
  });

  it('creates a checkout session successfully', async () => {
    const { POST } = await import('../pages/api/stripe/create-checkout-session');
    
    const req = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com', plan: 'pro' }),
    } as unknown as NextRequest;
    
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.url).toBe('https://checkout.stripe.com/test-session');
  });

  it('handles annual plan subscriptions', async () => {
    const { POST } = await import('../pages/api/stripe/create-checkout-session');
    
    const req = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com', plan: 'pro_annual' }),
    } as unknown as NextRequest;
    
    const response = await POST(req);
    expect(response.status).toBe(200);
    
    const stripeInstance = new Stripe('', { apiVersion: '2023-08-16' });
    expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price: 'price_pro_annual',
            quantity: 1,
          }),
        ]),
      })
    );
  });

  it('applies discounts when user has referral benefits', async () => {
    const { POST } = await import('../pages/api/stripe/create-checkout-session');
    
    const req = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com', plan: 'basic' }),
    } as unknown as NextRequest;
    
    const response = await POST(req);
    expect(response.status).toBe(200);
    
    const stripeInstance = new Stripe('', { apiVersion: '2023-08-16' });
    expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        discounts: [{ coupon: 'coupon_id' }],
      })
    );
  });
});