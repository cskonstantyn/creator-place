# CreatorDeals Supabase Setup

This document outlines the database structure, functions, and security policies set up in Supabase for the CreatorDeals application.

## Tables

### Core Tables

1. **brand_deals** - Brand collaboration opportunities
   - Stores deals where creators can collaborate with brands
   - Includes details like requirements, compensation, application process

2. **discount_deals** - Discount code offers
   - Stores special discount offers that creators can access
   - Includes discount codes, percentages, expiry dates

3. **deal_submissions** - Pending deal submissions
   - Stores brand and discount deals submitted by users
   - Requires admin approval before appearing in main tables

### User-related Tables

4. **user_profiles** - Extended user information
   - Stores profile data like name, bio, avatar, website
   - Identifies user types (creator, brand, admin)
   - Tracks verification status

5. **user_credits** - Credit system for users
   - Tracks credits available, used, and purchased
   - Used for accessing premium content or unlocking deals

6. **payment_intents** - Payment transaction records
   - Tracks all payment transactions
   - Links to payment plans and Stripe integration

7. **payment_plans** - Available credit packages
   - Defines the different credit packages users can purchase
   - Includes pricing, credit amounts, and features

8. **subscriptions** - User subscription information
   - Tracks subscription status, plan, and period
   - Links to payment plans and Stripe subscriptions

9. **purchase_history** - Record of user purchases
   - Tracks all user transactions (deals, credits, subscriptions)
   - Provides complete history of user activities

10. **favorites** - User's saved items
    - Allows users to save brand and discount deals
    - Used for bookmarking interesting opportunities

11. **creator_feedback** - Reviews and ratings
    - Enables users to leave feedback on deals
    - Helps build trust in the platform

12. **app_settings** - Application configuration
    - Stores environment settings (test/production mode)
    - Contains global application settings

## RPC Functions

1. **get_deals_with_stats(filter_deal_type)** - Retrieves deals with statistics
   - Returns a combined list of brand and discount deals
   - Includes average ratings and view counts
   - Optionally filters by deal type

2. **toggle_favorite(user_id, item_id, item_type)** - Manages favorites
   - Toggles items in a user's favorites list
   - Returns a boolean indicating if the item was added or removed

3. **use_credits(user_id, credits_amount)** - Credit management
   - Handles the spending of user credits
   - Validates if users have sufficient credits
   - Updates credit balances

4. **search_deals(search_term, categories, filters, sort)** - Search and filter deals
   - Complex search function with multiple filter options
   - Supports filtering by deal type, category, price range
   - Includes sorting and pagination

5. **get_recommended_deals(user_id)** - Personalized recommendations
   - Suggests deals based on user preferences and history
   - Uses past favorites and views to determine categories of interest

6. **submit_deal(user_id, deal_data)** - Submit new deals
   - Handles creation of deal submissions
   - Validates user credits and permissions
   - Creates pending submission for admin review

7. **approve_deal_submission(submission_id)** - Admin deal approval
   - Moves approved submission to live deal tables
   - Updates submission status
   - Manages record keeping

8. **reject_deal_submission(submission_id, feedback)** - Admin deal rejection
   - Rejects submissions with feedback
   - Refunds user credits if applicable
   - Updates submission status

9. **manage_subscription(user_id, subscription_details)** - Subscription management
   - Handles subscription creation and updates
   - Allocates credits based on subscription plan
   - Updates user profile type based on subscription

10. **get_user_subscription_details(user_id)** - Subscription information
    - Returns detailed subscription information
    - Includes payment plan, credits, and period dates

## Edge Functions

1. **create-checkout-session** - Creates a Stripe checkout session for payments
   - Accepts payment details and returns checkout URL
   - Integrates with Stripe for secure payment processing

2. **webhook** - Handles Stripe webhook events
   - Processes payment confirmations
   - Updates user credits after successful payments
   - Manages subscription-related events

3. **customer-portal** - Manages Stripe customer portal sessions
   - Provides access to subscription management
   - Handles account settings on Stripe

## Security (RLS Policies)

- **Row Level Security** is enabled on all tables
- Most tables restrict access based on user ID
- Read-only policies for public content (active deals)
- Role-based access control:
  - Creators can view and submit deals
  - Brands can view and submit their own deals
  - Admins can approve/reject submissions
  - Service role access for system-level operations

## Local Development

1. Start the local Supabase instance:
   ```
   supabase start
   ```

2. Access the Supabase Studio:
   ```
   http://127.0.0.1:54323
   ```

3. Reset the database (applies all migrations):
   ```
   supabase db reset
   ```

## Migration to Production

1. Create a `.env` file based on `.env.example` with your production credentials

2. Link to your hosted Supabase project:
   ```
   supabase link --project-ref your-project-ref
   ```

3. Push database changes to production:
   ```
   supabase db push
   ```

4. Deploy Edge Functions:
   ```
   ./supabase/functions/deploy.sh
   ```

## Database Architecture

```
                   +----------------+
                   | app_settings   |
                   +----------------+
                            
+---------------+  +----------------+  +-----------------+
| user_profiles |--| subscriptions  |--| payment_plans   |
+---------------+  +----------------+  +-----------------+
        |                  |
        |                  |
+-------v------+  +--------v-------+  +-----------------+
| user_credits |--| purchase_history|--| payment_intents |
+---------------+  +----------------+  +-----------------+
        |                  |
        |                  |
+-------v------+  +--------v-------+  +------------------+
| favorites    |  | deal_submissions|--| brand_deals     |
+---------------+  +----------------+  +------------------+
        |                  |                    |
        |                  |                    |
        |                  |           +--------v--------+
        |                  |           | creator_feedback|
        |                  |           +-----------------+
        |                  |
+-------v------+  +--------v-------+
| discount_deals|--| creator_feedback|
+---------------+  +-----------------+
``` 