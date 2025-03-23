import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { serverSupabase } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { Stripe } from 'stripe';

// This is your Stripe CLI webhook secret for testing your endpoint locally
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature') || '';
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        // Payment is successful and the checkout session is completed
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      
      case 'invoice.paid': {
        // Invoice is paid, which indicates a successful subscription renewal
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }
      
      case 'invoice.payment_failed': {
        // Invoice payment failed, subscription might be at risk
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }
      
      case 'customer.subscription.created': {
        // A new subscription is created
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }
      
      case 'customer.subscription.updated': {
        // A subscription is updated (e.g., plan change, trial ended)
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        // A subscription is canceled or expires
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

// Handler functions for each event type

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // Extract metadata from the session
  const userId = session.metadata?.user_id;
  const priceId = session.metadata?.price_id;
  
  if (!userId || !priceId) {
    console.error('Missing required metadata in session:', session.id);
    return;
  }
  
  // Get the customer from Supabase
  const { data: customer, error: customerError } = await serverSupabase
    .from('customers')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (customerError) {
    console.error('Error fetching customer:', customerError);
    return;
  }
  
  // Get the price from Supabase
  const { data: price, error: priceError } = await serverSupabase
    .from('prices')
    .select('*')
    .eq('id', priceId)
    .single();
  
  if (priceError) {
    console.error('Error fetching price:', priceError);
    return;
  }
  
  if (session.mode === 'payment') {
    // Handle one-time payment
    
    // Record the payment in Supabase
    const paymentData = {
      id: session.id,
      customer_id: userId,
      price_id: priceId,
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      status: 'succeeded',
      created_at: new Date().toISOString(),
      stripe_payment_id: session.id,
      metadata: session.metadata,
    };
    
    const { error: paymentError } = await serverSupabase
      .from('payments')
      .insert(paymentData);
    
    if (paymentError) {
      console.error('Error inserting payment:', paymentError);
    }
    
    // If this is a credit purchase, add credits to the user's account
    if (session.metadata?.creditAmount && session.metadata?.currencyId) {
      const creditAmount = parseInt(session.metadata.creditAmount);
      const currencyId = session.metadata.currencyId;
      
      // First check if the user already has credits for this currency
      const { data: existingCredits, error: creditsError } = await serverSupabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .eq('currency_id', currencyId)
        .single();
      
      if (creditsError && creditsError.code !== 'PGRST116') {
        console.error('Error fetching user credits:', creditsError);
        return;
      }
      
      if (existingCredits) {
        // Update existing credits
        const newBalance = existingCredits.balance + creditAmount;
        
        const { error: updateError } = await serverSupabase
          .from('user_credits')
          .update({ balance: newBalance })
          .eq('user_id', userId)
          .eq('currency_id', currencyId);
        
        if (updateError) {
          console.error('Error updating user credits:', updateError);
        }
      } else {
        // Create new credit entry
        const { error: insertError } = await serverSupabase
          .from('user_credits')
          .insert({
            user_id: userId,
            currency_id: currencyId,
            balance: creditAmount,
          });
        
        if (insertError) {
          console.error('Error inserting user credits:', insertError);
        }
      }
      
      // Record the credit transaction
      const { error: transactionError } = await serverSupabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          currency_id: currencyId,
          amount: creditAmount,
          type: 'purchase',
          reference_id: session.id,
          created_at: new Date().toISOString(),
          metadata: {
            payment_id: session.id,
            price_id: priceId,
          },
        });
      
      if (transactionError) {
        console.error('Error inserting credit transaction:', transactionError);
      }
    }
  } else if (session.mode === 'subscription') {
    // For subscriptions, the subscription.created event will handle it
    console.log('Subscription checkout completed, waiting for subscription event');
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.subscription || !invoice.customer) {
    console.log('No subscription or customer in invoice:', invoice.id);
    return;
  }
  
  const subscriptionId = typeof invoice.subscription === 'string' 
    ? invoice.subscription 
    : invoice.subscription.id;
  
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer.id;
  
  // Get the subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  // Find the Supabase user from the Stripe customer
  const { data: customers, error: customerError } = await serverSupabase
    .from('customers')
    .select('*')
    .eq('stripe_customer_id', customerId);
  
  if (customerError || !customers || customers.length === 0) {
    console.error('Error finding customer with Stripe ID:', customerId);
    return;
  }
  
  const userId = customers[0].id;
  
  // Find the subscription in Supabase
  const { data: subscriptions, error: subscriptionError } = await serverSupabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId);
  
  if (subscriptionError) {
    console.error('Error finding subscription:', subscriptionError);
    return;
  }
  
  if (subscriptions && subscriptions.length > 0) {
    // Update the existing subscription
    const { error: updateError } = await serverSupabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);
    
    if (updateError) {
      console.error('Error updating subscription:', updateError);
    }
  }
  
  // Record the payment
  const { error: paymentError } = await serverSupabase
    .from('payments')
    .insert({
      customer_id: userId,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      created_at: new Date().toISOString(),
      stripe_payment_id: invoice.charge as string,
      metadata: {
        invoice_id: invoice.id,
        subscription_id: subscriptionId,
      },
    });
  
  if (paymentError) {
    console.error('Error inserting payment:', paymentError);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription || !invoice.customer) {
    console.log('No subscription or customer in invoice:', invoice.id);
    return;
  }
  
  const subscriptionId = typeof invoice.subscription === 'string' 
    ? invoice.subscription 
    : invoice.subscription.id;
  
  // Find the subscription in Supabase
  const { data: subscriptions, error: subscriptionError } = await serverSupabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId);
  
  if (subscriptionError || !subscriptions || subscriptions.length === 0) {
    console.error('Error finding subscription:', subscriptionError);
    return;
  }
  
  // Update the subscription status
  const { error: updateError } = await serverSupabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);
  
  if (updateError) {
    console.error('Error updating subscription status:', updateError);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // Get the first item from the subscription
  const item = subscription.items.data[0];
  if (!item) {
    console.error('No items in subscription:', subscription.id);
    return;
  }
  
  // Get the customer ID
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;
  
  // Find the customer in Supabase
  const { data: customers, error: customerError } = await serverSupabase
    .from('customers')
    .select('*')
    .eq('stripe_customer_id', customerId);
  
  if (customerError || !customers || customers.length === 0) {
    console.error('Error finding customer with Stripe ID:', customerId);
    return;
  }
  
  const userId = customers[0].id;
  
  // Get the price ID for this subscription
  const stripePrice = item.price;
  
  // Find the corresponding price in Supabase
  const { data: prices, error: priceError } = await serverSupabase
    .from('prices')
    .select('*')
    .eq('stripe_price_id', stripePrice.id);
  
  if (priceError || !prices || prices.length === 0) {
    console.error('Error finding price with Stripe ID:', stripePrice.id);
    return;
  }
  
  const priceId = prices[0].id;
  
  // Create a new subscription record in Supabase
  const { error: insertError } = await serverSupabase
    .from('subscriptions')
    .insert({
      customer_id: userId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      stripe_subscription_id: subscription.id,
      trial_start: subscription.trial_start 
        ? new Date(subscription.trial_start * 1000).toISOString() 
        : null,
      trial_end: subscription.trial_end 
        ? new Date(subscription.trial_end * 1000).toISOString() 
        : null,
    });
  
  if (insertError) {
    console.error('Error inserting subscription:', insertError);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Find the subscription in Supabase
  const { data: subscriptions, error: subscriptionError } = await serverSupabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscription.id);
  
  if (subscriptionError || !subscriptions || subscriptions.length === 0) {
    console.error('Error finding subscription:', subscriptionError);
    return;
  }
  
  // Update the subscription in Supabase
  const { error: updateError } = await serverSupabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at: subscription.cancel_at 
        ? new Date(subscription.cancel_at * 1000).toISOString() 
        : null,
      canceled_at: subscription.canceled_at 
        ? new Date(subscription.canceled_at * 1000).toISOString() 
        : null,
      trial_start: subscription.trial_start 
        ? new Date(subscription.trial_start * 1000).toISOString() 
        : null,
      trial_end: subscription.trial_end 
        ? new Date(subscription.trial_end * 1000).toISOString() 
        : null,
    })
    .eq('stripe_subscription_id', subscription.id);
  
  if (updateError) {
    console.error('Error updating subscription:', updateError);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Find the subscription in Supabase
  const { error: updateError } = await serverSupabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
  
  if (updateError) {
    console.error('Error updating subscription status to canceled:', updateError);
  }
} 