// jest-dom adds custom jest matchers for asserting on DOM nodes
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    reload: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// Mock Next/server for API routes
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn().mockImplementation((data, options = {}) => {
        return {
          status: options.status || 200,
          json: async () => data,
        };
      }),
    },
    NextRequest: jest.fn().mockImplementation((input, init) => {
      return {
        json: jest.fn(),
      };
    }),
  };
});

// Create dummy environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-supabase-url.com';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
process.env.BASE_URL = 'http://localhost:3000';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.STRIPE_SECRET_KEY = 'test-stripe-key';
process.env.STRIPE_PRICE_BASIC = 'price_basic_test';
process.env.STRIPE_PRICE_PRO = 'price_pro_test';
process.env.STRIPE_PRICE_ENHANCED = 'price_enhanced_test';
process.env.STRIPE_PRICE_ENTERPRISE = 'price_enterprise_test';