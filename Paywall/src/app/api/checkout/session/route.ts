import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { serverSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { priceId, mode, successUrl, cancelUrl, metadata, trialDays } = body;
    
    // Verify required parameters
    if (!priceId || !mode || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Validate mode
    if (mode !== 'payment' && mode !== 'subscription') {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "payment" or "subscription"' },
        { status: 400 }
      );
    }
    
    // Get authentication from the request
    const requestUrl = new URL(request.url);
    const authToken = request.headers.get('authorization')?.split('Bearer ')[1];
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await serverSupabase.auth.getUser(authToken);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Find or create a customer for this user
    const { data: existingCustomer, error: customerError } = await serverSupabase
      .from('customers')
      .select('*')
      .eq('id', user.id)
      .single();
    
    let stripeCustomerId: string;
    
    if (customerError && customerError.code !== 'PGRST116') {
      // Error other than "not found"
      console.error('Error fetching customer:', customerError);
      return NextResponse.json(
        { error: 'Error fetching customer data' },
        { status: 500 }
      );
    }
    
    if (!existingCustomer) {
      // Create a new Stripe customer
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_id: user.id,
        },
      });
      
      stripeCustomerId = stripeCustomer.id;
      
      // Save the customer information in Supabase
      await serverSupabase
        .from('customers')
        .insert({
          id: user.id,
          email: user.email,
          stripe_customer_id: stripeCustomerId,
        });
    } else {
      // Use the existing Stripe customer ID
      stripeCustomerId = existingCustomer.stripe_customer_id || '';
      
      if (!stripeCustomerId) {
        // If the user exists but doesn't have a Stripe customer ID, create one
        const stripeCustomer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_id: user.id,
          },
        });
        
        stripeCustomerId = stripeCustomer.id;
        
        // Update the customer with the Stripe customer ID
        await serverSupabase
          .from('customers')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('id', user.id);
      }
    }
    
    // Look up the price in Supabase to determine what kind of checkout session to create
    const { data: priceData, error: priceError } = await serverSupabase
      .from('prices')
      .select('*')
      .eq('id', priceId)
      .single();
    
    if (priceError) {
      console.error('Error fetching price:', priceError);
      return NextResponse.json(
        { error: 'Price not found' },
        { status: 404 }
      );
    }
    
    // Create the Stripe checkout session
    let sessionParams: any = {
      mode,
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceData.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
        price_id: priceId,
        ...metadata,
      },
    };
    
    // Add subscription-specific data
    if (mode === 'subscription' && trialDays && trialDays > 0) {
      sessionParams.subscription_data = {
        trial_period_days: trialDays,
      };
    }
    
    const session = await stripe.checkout.sessions.create(sessionParams);
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 