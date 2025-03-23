import { loadStripe } from '@stripe/stripe-js';

// Initialize the Stripe client
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default stripePromise;

/**
 * Redirect to Stripe Checkout
 */
export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error('Stripe failed to initialize');
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    throw error;
  }
}; 