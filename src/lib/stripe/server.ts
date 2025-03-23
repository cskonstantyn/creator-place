/**
 * Stripe server-side implementation
 * This file contains functions for interacting with Stripe on the server side
 */
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY || '';
if (!stripeSecretKey && import.meta.env.PROD) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable');
}
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
});

// Types
export interface CreateCheckoutSessionOptions {
  priceId: string;
  clientReferenceId?: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

// Create a checkout session
export async function createCheckoutSession(options: CreateCheckoutSessionOptions): Promise<string> {
  const { priceId, clientReferenceId, customerId, successUrl, cancelUrl, metadata } = options;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment', // or 'subscription' for recurring payments
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    client_reference_id: clientReferenceId,
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });

  return session.id;
}

// Create a customer portal session
export async function createCustomerPortalSession(customerId: string, returnUrl: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

// Get active products from Stripe
export async function getStripeProducts() {
  const { data } = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });

  return data;
}

// Get prices for a specific product
export async function getStripePrices(productId: string) {
  const { data } = await stripe.prices.list({
    product: productId,
    active: true,
  });

  return data;
} 