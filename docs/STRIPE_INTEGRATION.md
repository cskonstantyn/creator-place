# Stripe Integration Guide

This document provides instructions for setting up and utilizing Stripe payment processing in the CreatorDeals application.

## Prerequisites

- Stripe account (create one at [stripe.com](https://stripe.com) if you don't have one)
- API keys from your Stripe Dashboard

## Environment Setup

1. Add your Stripe API keys to your `.env.local` file:

```bash
# Stripe API Keys
VITE_STRIPE_PUBLIC_KEY=pk_test_your_test_key # For development
# VITE_STRIPE_PUBLIC_KEY=pk_live_your_live_key # For production

STRIPE_SECRET_KEY=sk_test_your_test_key # For development
# STRIPE_SECRET_KEY=sk_live_your_live_key # For production

STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Application Flow

### Client-Side Implementation

The frontend implementation handles redirecting users to Stripe Checkout:

1. **User selects a payment plan**: The user chooses a plan from `PaywallPlans.tsx`.
2. **Purchase function is called**: When the user clicks "Select Plan", the `handlePurchase` function in `PaywallProvider.tsx` is called.
3. **Redirect to Stripe Checkout**: In production mode, the application creates a checkout session and redirects the user to Stripe.

Key files:
- `src/lib/paywall/PaywallProvider.tsx` - Context provider with payment functions
- `src/lib/stripe/client.ts` - Client-side Stripe utilities
- `src/components/payment/PaywallPlans.tsx` - UI for displaying payment plans

### Server-Side Implementation

For full integration, you'll need a server-side implementation:

1. **Create API endpoints**: Create endpoints for generating checkout sessions.
2. **Handle webhooks**: Set up webhook handling for payment events.
3. **Store payment results**: Update the database with payment results.

Key files:
- `src/lib/stripe/server.ts` - Server-side Stripe utilities (for reference)

## Setting Up Products in Stripe

Before using Stripe in production, you need to set up products and prices:

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Products > Add Product
3. Create products that match your payment plans:
   - Basic Brand Deal
   - Premium Brand Deal
   - Basic Discount Code
   - Premium Discount Code
4. For each product, create a price:
   - One-time payment
   - Set the correct amount (e.g., $49.99 for Basic Brand Deal)
   - Set the currency to USD (or your preferred currency)

## Webhook Configuration

For production use, you need to set up webhooks to handle asynchronous events:

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL (e.g., `https://your-api.com/api/webhooks/stripe`)
4. Select the events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`

## Development vs. Production

### Development Mode

In development mode, the application uses mock implementations:

- No actual charges are made
- Console logs display payment information
- `process.env.NODE_ENV !== 'production'` triggers mock behavior

### Production Mode

For production:

1. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in your environment
2. Use live Stripe API keys
3. Implement proper webhook handling
4. Ensure your database tables are set up correctly

## Testing Stripe Integration

To test the Stripe integration:

1. Use Stripe's test mode and test API keys
2. Use Stripe's test card numbers:
   - `4242 4242 4242 4242` - Successful payment
   - `4000 0000 0000 0002` - Declined payment
3. For CVV, use any 3 digits
4. For expiration date, use any future date

## Implementing Stripe Checkout

To fully implement Stripe Checkout, you'll need to:

1. Create a serverless function or API endpoint to create checkout sessions
2. Update `src/lib/paywall/PaywallProvider.tsx` to call this endpoint
3. Handle successful payments via webhooks

Example checkout session API endpoint:

```typescript
// Example API route (e.g., in Next.js, Express, or other server framework)
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req, res) {
  const { priceId, successUrl, cancelUrl } = req.body;
  
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Troubleshooting

Common issues:

1. **API Key Issues**: Ensure your API keys are correctly formatted and have the right permissions.
2. **CORS Issues**: If using separate frontend/backend, ensure CORS is properly configured.
3. **Webhook Failures**: Check webhook logs in Stripe Dashboard for failed webhook attempts.
4. **Test vs. Live Mode**: Ensure you're using the correct mode keys for your environment.

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe.js Documentation](https://stripe.com/docs/js)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Test Cards](https://stripe.com/docs/testing) 