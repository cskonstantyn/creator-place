import { serve } from 'https://deno.land/std@0.210.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import Stripe from 'https://esm.sh/stripe@13.11.0';

serve(async (req) => {
  try {
    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the signature from the header
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the webhook secret from environment variables
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      return new Response(JSON.stringify({ error: 'Missing Stripe webhook secret' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the request body
    const body = await req.text();

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const paymentPlanId = session.metadata?.paymentPlanId;
        
        if (userId) {
          // Get the payment plan to determine credit amount
          if (paymentPlanId) {
            const { data: paymentPlan } = await supabase
              .from('payment_plans')
              .select('credit_amount')
              .eq('id', paymentPlanId)
              .single();
            
            const creditAmount = paymentPlan?.credit_amount || 0;
            
            // Record the payment
            await supabase.from('payment_intents').insert({
              user_id: userId,
              payment_plan_id: paymentPlanId,
              amount: session.amount_total / 100, // Convert from cents
              status: 'completed',
              stripe_payment_intent_id: session.payment_intent
            });
            
            // Update user credits
            const { data: userCredits } = await supabase
              .from('user_credits')
              .select('*')
              .eq('user_id', userId)
              .single();
            
            if (userCredits) {
              // Update existing record
              await supabase
                .from('user_credits')
                .update({
                  credits_remaining: userCredits.credits_remaining + creditAmount,
                  credits_purchased: userCredits.credits_purchased + creditAmount,
                  last_purchase_date: new Date().toISOString()
                })
                .eq('user_id', userId);
            } else {
              // Create new record
              await supabase
                .from('user_credits')
                .insert({
                  user_id: userId,
                  credits_remaining: creditAmount,
                  credits_purchased: creditAmount,
                  credits_used: 0,
                  last_purchase_date: new Date().toISOString()
                });
            }
          }
        }
        break;
      }
      
      // Add more event handlers as needed
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // Handle subscription events
        break;
        
      case 'invoice.paid':
        // Handle successful payments
        break;
        
      case 'invoice.payment_failed':
        // Handle failed payments
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}); 