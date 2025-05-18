import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Create a Supabase client
const createClientFromCookies = () => {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
};

// Get the authenticated user (server-side)
export async function getServerUser() {
  const supabase = createClientFromCookies();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }
  
  // Get the user profile with plan information
  const { data: profile } = await supabase
    .from('users')
    .select('id, email, plan, referral_code, referral_count, permanent_discount')
    .eq('id', session.user.id)
    .single();
  
  return {
    id: session.user.id,
    email: session.user.email,
    plan: profile?.plan || 'free',
    referralCode: profile?.referral_code,
    referralCount: profile?.referral_count || 0,
    discount: profile?.permanent_discount || 0
  };
}

// Client-side authentication helpers
export function getUser() {
  // For demonstration/development, return a mock user
  if (process.env.NODE_ENV === 'development') {
    return { 
      id: 'user_123', 
      email: 'test@nsaie.com', 
      plan: 'pro',
      referralCode: 'testuser-123456',
      referralCount: 2,
      discount: 0
    };
  }
  
  // In production, this would fetch from Supabase Client
  return { id: '', email: '', plan: 'free' };
}

// Check if user can access a specific tool based on their plan
export function canUserAccess(toolName: string, userPlan: string) {
  // Re-use the existing access control function
  return import('./billing').then(({ canAccessTool }) => {
    return canAccessTool(toolName, userPlan);
  });
}

// Generate a new referral code for a user
export async function generateUserReferralCode(userId: string, name: string) {
  const { generateReferralCode } = await import('./referral');
  const referralCode = generateReferralCode(userId, name);
  
  // In production, this would update the user's record in Supabase
  if (process.env.NODE_ENV !== 'development') {
    const supabase = createClientFromCookies();
    await supabase
      .from('users')
      .update({ referral_code: referralCode })
      .eq('id', userId);
  }
  
  return referralCode;
}