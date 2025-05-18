import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook error:', err);
    return new NextResponse('Webhook error', { status: 400 });
  }

  try {
    // Handle checkout.session.completed event when user completes payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
    }
    
    // Handle customer.subscription.updated event
    else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
    }
    
    // Handle customer.subscription.deleted event
    else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCancelled(subscription);
    }

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_email;
  if (!customerEmail) return;
  
  // Get the price ID from the session to determine which plan was purchased
  let planType = 'free';
  if (session.line_items) {
    // Need to retrieve line items since they're not included in the event
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    if (lineItems.data.length > 0) {
      const priceId = lineItems.data[0].price?.id;
      
      // Map price IDs to plan names
      if (priceId === process.env.STRIPE_PRICE_BASIC) {
        planType = 'basic';
      } else if (priceId === process.env.STRIPE_PRICE_PRO) {
        planType = 'pro';
      }
    }
  }
  
  // Get referral source
  const { data: user } = await supabase
    .from('users')
    .select('referred_by')
    .eq('email', customerEmail)
    .single();
  
  // Update user's plan in Supabase
  const { data, error } = await supabase
    .from('users')
    .update({ 
      plan: planType,
      stripe_customer_id: session.customer as string,
      updated_at: new Date().toISOString()
    })
    .eq('email', customerEmail);
    
  if (error) {
    console.error('Error updating user plan:', error);
    throw new Error('Failed to update user plan');
  }
  
  // Process referral reward if applicable
  if (user?.referred_by) {
    try {
      // Update referral status to rewarded
      await supabase
        .from('referrals')
        .update({ status: 'completed' })
        .eq('referred_email', customerEmail);
        
      // Get referrer by their referral code
      const { data: referrer } = await supabase
        .from('users')
        .select('id, email, referral_count, referral_rewards')
        .eq('referral_code', user.referred_by)
        .single();
        
      if (referrer) {
        // Increment referrer's count and check for rewards
        const newReferralCount = (referrer.referral_count || 0) + 1;
        
        // Check if the user qualifies for new reward tier
        const { data: updatedUser } = await supabase
          .from('users')
          .update({
            referral_count: newReferralCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', referrer.id)
          .select()
          .single();
          
        console.log(`Processed referral reward for ${customerEmail} referred by ${user.referred_by}`);
      }
    } catch (rewardError) {
      console.error('Error processing referral reward:', rewardError);
      // Don't throw here, as we've already updated the user's plan
    }
  }
  
  console.log(`User ${customerEmail} upgraded to ${planType} plan`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Get current plan status
  const status = subscription.status;
  const priceId = subscription.items.data[0]?.price.id;
  
  let planType = 'free';
  if (status === 'active') {
    if (priceId === process.env.STRIPE_PRICE_BASIC) {
      planType = 'basic';
    } else if (priceId === process.env.STRIPE_PRICE_PRO) {
      planType = 'pro';
    }
  }
  
  // Update user's plan in Supabase
  const { data, error } = await supabase
    .from('users')
    .update({ 
      plan: planType,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId);
    
  if (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription');
  }
  
  console.log(`Subscription updated for customer ${customerId} to ${planType} plan`);
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Update user's plan in Supabase to free plan
  const { data, error } = await supabase
    .from('users')
    .update({ 
      plan: 'free',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId);
    
  if (error) {
    console.error('Error cancelling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
  
  console.log(`Subscription cancelled for customer ${customerId}, reverted to free plan`);
}