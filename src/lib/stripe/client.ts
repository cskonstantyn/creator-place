/**
 * Stripe client-side implementation
 * This file contains functions for interacting with Stripe on the client side
 */

// Maps for Stripe price IDs
const DISCOUNT_DEAL_PRICE_IDS = {
  small: 'price_1R5eMWE9Zi2EDbaDGFywlG6b',
  medium: 'price_1R5eMvE9Zi2EDbaDodjugx4c',
  large: 'price_1R5eNWE9Zi2EDbaDZbAxnEEG'
};

const BRAND_DEAL_PRICE_IDS = {
  small: 'price_1R5eO4E9Zi2EDbaDTnRzJND1',
  medium: 'price_1R5eOYE9Zi2EDbaDBkhqMvg8',
  large: 'price_1R5eP7E9Zi2EDbaDC3NPUDy2'
};

// Get the user ID from localStorage, session, or auth provider
function getUserId(): string {
  // This is a placeholder - implement based on your auth strategy
  // In a real app, get this from your auth provider (Supabase, Firebase, etc.)
  return localStorage.getItem('userId') || 'anonymous_user';
}

// Create a checkout session and redirect to Stripe
export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string): Promise<string> {
  // For mock data mode, return a fake session ID
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return `cs_test_${generateClientReferenceId()}`;
  }
  
  try {
    // Get the authenticated user's ID
    const userId = getUserId();
    const clientReferenceId = generateClientReferenceId();
    
    // Use environment variables for the URLs if not provided
    const finalSuccessUrl = successUrl || import.meta.env.VITE_PAYMENT_SUCCESS_URL || window.location.origin + '/payment-success';
    const finalCancelUrl = cancelUrl || import.meta.env.VITE_PAYMENT_CANCEL_URL || window.location.origin + '/payment-cancel';
    
    // Call the Supabase Edge Function
    const response = await fetch(
      import.meta.env.VITE_SUPABASE_FUNCTIONS_URL + '/create-checkout-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization if needed for your Supabase setup
          // 'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl: finalSuccessUrl,
          cancelUrl: finalCancelUrl,
          clientReferenceId,
          metadata: {
            timestamp: new Date().toISOString(),
          }
        }),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create checkout session: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    // If URL is returned directly from Stripe, we can redirect right away
    if (data.url) {
      window.location.href = data.url;
      return data.sessionId;
    }
    
    return data.sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Get the appropriate price ID based on plan size and type
export function getStripePriceId(planType: 'discount-deal' | 'brand-deal', planSize: 'small' | 'medium' | 'large'): string {
  if (planType === 'discount-deal') {
    return DISCOUNT_DEAL_PRICE_IDS[planSize];
  } else {
    return BRAND_DEAL_PRICE_IDS[planSize];
  }
}

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
  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
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