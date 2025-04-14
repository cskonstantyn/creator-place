# Supabase Edge Functions for Stripe Integration

This directory contains Edge Functions that handle Stripe integration for the CreatorDeals platform.

## Functions

### create-checkout-session

Creates a Stripe checkout session for processing payments. This function handles:
- Creating a new checkout session with Stripe
- Passing user information to Stripe
- Redirecting users to success/cancel pages after payment

## Prerequisites

Before deploying these functions, make sure you have:

1. Installed the Supabase CLI
2. Logged in to your Supabase account via the CLI
3. Set up environment variables in your Supabase project:
   - `STRIPE_SECRET_KEY` - Your Stripe secret API key
   - `SUPABASE_URL` - URL of your Supabase project
   - `SUPABASE_SERVICE_ROLE_KEY` - Service role key for your Supabase project

## Deployment

To deploy the Edge Functions:

1. Make sure you're logged in to Supabase CLI:
   ```bash
   supabase login
   ```

2. Link your local project to your Supabase project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Deploy the functions using the provided script:
   ```bash
   ./functions/deploy.sh
   ```
   
   Or deploy individual functions:
   ```bash
   supabase functions deploy create-checkout-session
   ```

4. Test the functions using the Supabase CLI:
   ```bash
   supabase functions serve --env-file .env.local
   ```

## Environment Variables

Create a `.env.local` file in the project root with the following variables for local development:

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Usage from Frontend

To use the checkout function from the frontend:

```typescript
// Example code to create a checkout session
const response = await fetch(
  'https://your-project-ref.supabase.co/functions/v1/create-checkout-session',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAccessToken}`
    },
    body: JSON.stringify({
      priceId: 'price_123456789',
      userId: 'user_id',
      successUrl: 'https://example.com/payment-success',
      cancelUrl: 'https://example.com/payment-cancel',
      metadata: {
        email: 'user@example.com',
        planType: 'basic'
      }
    })
  }
);

const { sessionId, url } = await response.json();
// Redirect user to checkout page
window.location.href = url;
``` 