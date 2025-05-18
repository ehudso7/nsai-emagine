import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getRewardTiers } from '@/shared/lib/referral';

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  const { referralCode, newUserEmail } = await req.json();
  
  if (!referralCode || !newUserEmail) {
    return NextResponse.json({ error: 'Missing referral code or user email' }, { status: 400 });
  }

  try {
    // 1. Find the referring user by their referral code
    const { data: referringUser, error: referrerError } = await supabase
      .from('users')
      .select('id, email, referral_count, referral_rewards')
      .eq('referral_code', referralCode)
      .single();
    
    if (referrerError || !referringUser) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 });
    }
    
    // 2. Check if the new user was already referred (prevent duplicate referrals)
    const { data: existingReferral, error: referralCheckError } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_email', newUserEmail)
      .maybeSingle();
    
    if (existingReferral) {
      return NextResponse.json({ error: 'User has already been referred' }, { status: 400 });
    }
    
    // 3. Store the new referral
    const { data: newReferral, error: createError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referringUser.id,
        referred_email: newUserEmail,
        created_at: new Date().toISOString(),
        status: 'pending' // Will be updated to 'completed' when the user signs up
      })
      .select()
      .single();
    
    if (createError) {
      throw new Error('Failed to create referral record');
    }
    
    // 4. Update the referring user's referral count
    const newReferralCount = (referringUser.referral_count || 0) + 1;
    
    // 5. Check if the user qualifies for a new reward tier
    const rewardTiers = getRewardTiers();
    const referralRewards = referringUser.referral_rewards || [];
    
    let newReward = null;
    for (const tier of rewardTiers) {
      if (newReferralCount >= tier.count && !referralRewards.includes(tier.count)) {
        newReward = tier;
        referralRewards.push(tier.count);
        break;
      }
    }
    
    // 6. Update the user record with new referral count and rewards
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        referral_count: newReferralCount,
        referral_rewards: referralRewards,
        updated_at: new Date().toISOString()
      })
      .eq('id', referringUser.id)
      .select()
      .single();
    
    if (updateError) {
      throw new Error('Failed to update user referral data');
    }
    
    // 7. If user earned a reward, process it
    let rewardGranted = false;
    if (newReward) {
      rewardGranted = true;
      await processReward(referringUser.id, newReward);
    }
    
    return NextResponse.json({ 
      success: true, 
      referralCount: newReferralCount,
      rewardGranted,
      reward: newReward ? newReward.reward : null
    });

  } catch (error) {
    console.error('Referral tracking error:', error);
    return NextResponse.json({ error: 'Failed to process referral' }, { status: 500 });
  }
}

async function processReward(userId: string, reward: { count: number, reward: string }) {
  // Implement the reward based on the reward description
  try {
    if (reward.reward.includes('Free month')) {
      // Add a free month to the user's subscription
      const { data, error } = await supabase
        .from('subscription_credits')
        .insert({
          user_id: userId,
          credit_type: 'time_extension',
          amount: 1, // 1 month
          reason: `Referral reward: ${reward.count} successful referrals`,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } 
    else if (reward.reward.includes('account credit')) {
      // Add account credit
      const creditAmount = parseInt(reward.reward.match(/\$(\d+)/)?.[1] || '0');
      if (creditAmount > 0) {
        const { data, error } = await supabase
          .from('subscription_credits')
          .insert({
            user_id: userId,
            credit_type: 'monetary',
            amount: creditAmount,
            reason: `Referral reward: ${reward.count} successful referrals`,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
    }
    else if (reward.reward.includes('Lifetime')) {
      // Add permanent discount to user account
      const discountMatch = reward.reward.match(/(\d+)%/);
      const discountPercent = discountMatch ? parseInt(discountMatch[1]) : 0;
      
      if (discountPercent > 0) {
        const { data, error } = await supabase
          .from('users')
          .update({
            permanent_discount: discountPercent,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (error) throw error;
      }
    }
    
    // Send notification email about the reward
    // (Email implementation would go here)
    
    console.log(`Processed reward for user ${userId}: ${reward.reward}`);
    
    return true;
  } catch (error) {
    console.error('Error processing reward:', error);
    return false;
  }
}