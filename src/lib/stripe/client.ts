/**
 * Stripe client-side implementation
 * This file contains functions for interacting with Stripe on the client side
 */

// Redirects to Stripe checkout with the provided session ID
export async function redirectToCheckout(sessionId: string): Promise<void> {
  // Load the Stripe.js script dynamically
  if (!(window as any).Stripe) {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    document.body.appendChild(script);

    // Wait for the script to load
    await new Promise<void>((resolve) => {
      script.onload = () => resolve();
    });
  }

  // Initialize Stripe with the public key
  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
  const stripe = (window as any).Stripe(stripePublicKey);

  // Redirect to checkout
  const { error } = await stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    console.error('Error redirecting to checkout:', error);
    throw new Error(error.message);
  }
}

// Creates a client reference ID for tracking purposes
export function generateClientReferenceId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
} 