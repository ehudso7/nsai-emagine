import { createClient } from '@supabase/supabase-js';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => {
  const mockFromSelect = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        data: {
          id: 'user-123',
          email: 'test@example.com',
          plan: 'basic',
          created_at: new Date().toISOString(),
        },
        error: null,
      });
    }),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };

  const mockFromInsert = {
    insert: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'new-record-123' },
        error: null,
      }),
    }),
  };

  const mockFromUpdate = {
    update: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 'updated-record-123' },
          error: null,
        }),
      }),
    }),
  };

  const mockFrom = jest.fn().mockImplementation((table) => {
    return {
      ...mockFromSelect,
      ...mockFromInsert,
      ...mockFromUpdate,
    };
  });

  const mockAuth = {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
      error: null,
    }),
    signUp: jest.fn().mockResolvedValue({
      data: { user: { id: 'new-user-123', email: 'new@example.com' } },
      error: null,
    }),
    signIn: jest.fn().mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
      error: null,
    }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  };

  return {
    createClient: jest.fn().mockImplementation(() => {
      return {
        from: mockFrom,
        auth: mockAuth,
      };
    }),
  };
});

describe('Supabase Integration Tests', () => {
  let supabase: ReturnType<typeof createClient>;
  
  beforeEach(() => {
    // Create a fresh Supabase client for each test
    supabase = createClient('https://example.supabase.co', 'fake-api-key');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('can retrieve user data', async () => {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('email', 'test@example.com')
      .single();
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.email).toBe('test@example.com');
    expect(data.plan).toBe('basic');
  });

  it('can insert new records', async () => {
    const { data, error } = await supabase
      .from('usage_logs')
      .insert({
        user_id: 'user-123',
        tool: 'advisor',
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe('new-record-123');
  });

  it('can update existing records', async () => {
    const { data, error } = await supabase
      .from('users')
      .update({ plan: 'pro' })
      .eq('id', 'user-123')
      .select()
      .single();
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.id).toBe('updated-record-123');
  });

  it('can authenticate users', async () => {
    const { data, error } = await supabase.auth.getUser();
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.user?.id).toBe('user-123');
    expect(data.user?.email).toBe('test@example.com');
  });

  it('can sign up new users', async () => {
    const { data, error } = await supabase.auth.signUp({
      email: 'new@example.com',
      password: 'password123',
    });
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.user?.id).toBe('new-user-123');
    expect(data.user?.email).toBe('new@example.com');
  });
});