import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest API version
  appInfo: {
    name: 'Paywall Solution',
    version: '0.1.0',
  },
});

/**
 * Create a Stripe Checkout session for a one-time payment
 */
export const createCheckoutSession = async (
  priceId: string,
  customerId: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
) => {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });
};

/**
 * Create a Stripe Checkout session for a subscription
 */
export const createSubscriptionSession = async (
  priceId: string,
  customerId: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>,
  trialDays?: number
) => {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    subscription_data: trialDays ? { trial_period_days: trialDays } : undefined,
  });
};

/**
 * Create a Stripe Customer
 */
export const createCustomer = async (email: string, name?: string, metadata?: Record<string, string>) => {
  return stripe.customers.create({
    email,
    name,
    metadata,
  });
};

/**
 * Get a Stripe Customer
 */
export const getCustomer = async (customerId: string) => {
  return stripe.customers.retrieve(customerId);
};

/**
 * Get a Stripe Subscription
 */
export const getSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.retrieve(subscriptionId);
};

/**
 * Cancel a Stripe Subscription
 */
export const cancelSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.cancel(subscriptionId);
}; 