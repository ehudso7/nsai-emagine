import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16'
});

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  const { email, plan } = await req.json();
  
  if (!email || !plan) {
    return NextResponse.json({ error: 'Email and plan are required' }, { status: 400 });
  }
  
  try {
    // Verify the user exists in our database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, stripe_customer_id, permanent_discount')
      .eq('email', email)
      .single();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get the appropriate price ID based on the plan
    const priceMap: Record<string, string> = {
      // Monthly plans
      basic: process.env.STRIPE_PRICE_BASIC || 'price_basic_id_here',
      pro: process.env.STRIPE_PRICE_PRO || 'price_pro_id_here',
      enhanced: process.env.STRIPE_PRICE_ENHANCED || 'price_enhanced_id_here',
      enterprise: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_id_here',
      
      // Annual plans (20% discount already applied)
      basic_annual: process.env.STRIPE_PRICE_BASIC_ANNUAL || 'price_basic_annual_id_here',
      pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL || 'price_pro_annual_id_here',
      enhanced_annual: process.env.STRIPE_PRICE_ENHANCED_ANNUAL || 'price_enhanced_annual_id_here',
      enterprise_annual: process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL || 'price_enterprise_annual_id_here'
    };
    
    const priceId = priceMap[plan];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }
    
    // Set up checkout session options
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${process.env.BASE_URL}/dashboard?billing=success`,
      cancel_url: `${process.env.BASE_URL}/dashboard?billing=cancelled`,
      metadata: {
        userId: user.id
      }
    };
    
    // Apply a discount if the user has one from referrals
    if (user.permanent_discount && user.permanent_discount > 0) {
      // Create a coupon or use an existing one for the discount
      const couponPercent = Math.min(user.permanent_discount, 50); // Cap at 50% to prevent abuse
      
      // Create or retrieve a coupon for this discount
      let coupon;
      
      try {
        // Try to find an existing coupon with this percentage
        const existingCoupons = await stripe.coupons.list({
          limit: 1
        });
        
        coupon = existingCoupons.data.find(c => 
          c.percent_off === couponPercent && c.duration === 'forever'
        );
        
        // If no existing coupon found, create a new one
        if (!coupon) {
          coupon = await stripe.coupons.create({
            percent_off: couponPercent,
            duration: 'forever',
            name: `${couponPercent}% Lifetime Discount`
          });
        }
        
        // Apply the coupon
        sessionOptions.discounts = [
          {
            coupon: coupon.id
          }
        ];
      } catch (err) {
        console.error('Error creating/retrieving discount:', err);
        // Continue without the discount if there's an error
      }
    }
    
    // If user already has a Stripe customer ID, use it
    if (user.stripe_customer_id) {
      sessionOptions.customer = user.stripe_customer_id;
    } else {
      sessionOptions.customer_email = email;
    }
    
    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionOptions);
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' }, 
      { status: 500 }
    );
  }
}