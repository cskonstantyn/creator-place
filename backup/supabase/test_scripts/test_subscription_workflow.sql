-- Test script for subscription management workflow

-- First, make sure we're in testing mode
SELECT toggle_environment();

-- Create a test payment plan if needed
DO $$
DECLARE
  v_payment_plan_id UUID;
BEGIN
  -- Check if we already have payment plans
  SELECT id INTO v_payment_plan_id FROM payment_plans LIMIT 1;
  
  IF NOT FOUND THEN
    -- Create test payment plans
    INSERT INTO payment_plans (
      name,
      description,
      price,
      currency,
      interval,
      interval_count,
      credits_per_cycle,
      plan_type
    ) VALUES
    (
      'Creator Basic',
      'Basic plan for creators with 10 credits per month',
      9.99,
      'usd',
      'month',
      1,
      10,
      'creator'
    ),
    (
      'Creator Pro',
      'Pro plan for creators with 50 credits per month',
      19.99,
      'usd',
      'month',
      1,
      50,
      'creator'
    ),
    (
      'Brand Basic',
      'Basic plan for brands with 20 credits per month',
      29.99,
      'usd',
      'month',
      1,
      20,
      'brand'
    );
    
    RAISE NOTICE 'Created test payment plans';
  ELSE
    RAISE NOTICE 'Payment plans already exist, using existing plans';
  END IF;
END $$;

-- Set up a test user
DO $$
DECLARE
  v_user_id UUID;
  v_creator_plan_id UUID;
  v_brand_plan_id UUID;
BEGIN
  -- Create a test user ID (in real app, this would be a auth.users entry)
  v_user_id := gen_random_uuid();
  
  -- Create a user profile
  INSERT INTO user_profiles (
    id,
    username,
    display_name,
    user_type,
    bio,
    is_verified
  ) VALUES (
    v_user_id,
    'sub_test_user',
    'Subscription Test User',
    'creator',
    'This is a test user for subscription testing',
    TRUE
  );
  
  -- Store the user ID for later use
  INSERT INTO app_settings (id, value, is_public) 
  VALUES ('test_sub_user_id', to_jsonb(v_user_id), true)
  ON CONFLICT (id) 
  DO UPDATE SET value = to_jsonb(v_user_id);
  
  -- Get payment plan IDs
  SELECT id INTO v_creator_plan_id FROM payment_plans WHERE name = 'Creator Basic' LIMIT 1;
  SELECT id INTO v_brand_plan_id FROM payment_plans WHERE name = 'Brand Basic' LIMIT 1;
  
  -- Store payment plan IDs
  INSERT INTO app_settings (id, value, is_public) 
  VALUES 
    ('test_creator_plan_id', to_jsonb(v_creator_plan_id), true),
    ('test_brand_plan_id', to_jsonb(v_brand_plan_id), true)
  ON CONFLICT (id) 
  DO UPDATE SET value = EXCLUDED.value;
  
  RAISE NOTICE 'Created test user with ID: %', v_user_id;
END $$;

-- Test subscribing to Creator Basic plan
DO $$
DECLARE
  v_user_id UUID;
  v_plan_id UUID;
  v_subscription_id UUID;
  v_stripe_sub_id TEXT;
BEGIN
  -- Get the test user ID and payment plan ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_user_id FROM app_settings WHERE id = 'test_sub_user_id';
  SELECT (value#>>'{}'::text[])::UUID INTO v_plan_id FROM app_settings WHERE id = 'test_creator_plan_id';
  
  -- Generate a fake Stripe subscription ID
  v_stripe_sub_id := 'test_sub_' || gen_random_uuid()::text;
  
  -- Create the subscription
  v_subscription_id := manage_subscription(
    v_user_id,
    v_stripe_sub_id,
    v_plan_id,
    'active',
    NOW(),
    NOW() + INTERVAL '1 month'
  );
  
  -- Store the subscription ID for later use
  INSERT INTO app_settings (id, value, is_public) 
  VALUES ('test_subscription_id', to_jsonb(v_subscription_id), true)
  ON CONFLICT (id) 
  DO UPDATE SET value = to_jsonb(v_subscription_id);
  
  INSERT INTO app_settings (id, value, is_public) 
  VALUES ('test_stripe_sub_id', to_jsonb(v_stripe_sub_id), true)
  ON CONFLICT (id) 
  DO UPDATE SET value = to_jsonb(v_stripe_sub_id);
  
  RAISE NOTICE 'Created subscription with ID: %', v_subscription_id;
END $$;

-- Check the subscription
SELECT * FROM subscriptions WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_sub_user_id')::UUID);

-- Check that credits were allocated
SELECT * FROM user_credits WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_sub_user_id')::UUID);

-- Check the user profile type was updated to 'creator'
SELECT * FROM user_profiles WHERE id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_sub_user_id')::UUID);

-- Test subscription details function
SELECT * FROM get_user_subscription_details(((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_sub_user_id')::UUID));

-- Test subscription renewal
DO $$
DECLARE
  v_stripe_sub_id TEXT;
  v_result BOOLEAN;
BEGIN
  -- Get the stripe subscription ID
  SELECT value#>>'{}'::text[] INTO v_stripe_sub_id FROM app_settings WHERE id = 'test_stripe_sub_id';
  
  -- Renew the subscription
  v_result := renew_subscription(
    v_stripe_sub_id,
    NOW(),
    NOW() + INTERVAL '1 month'
  );
  
  RAISE NOTICE 'Renewed subscription: %', v_result;
END $$;

-- Check that credits were added after renewal
SELECT * FROM user_credits WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_sub_user_id')::UUID);

-- Check purchase history
SELECT * FROM purchase_history WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_sub_user_id')::UUID);

-- Test changing to a brand plan
DO $$
DECLARE
  v_user_id UUID;
  v_plan_id UUID;
  v_stripe_sub_id TEXT;
  v_subscription_id UUID;
BEGIN
  -- Get the test user ID and payment plan ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_user_id FROM app_settings WHERE id = 'test_sub_user_id';
  SELECT (value#>>'{}'::text[])::UUID INTO v_plan_id FROM app_settings WHERE id = 'test_brand_plan_id';
  
  -- Generate a new fake Stripe subscription ID
  v_stripe_sub_id := 'test_sub_' || gen_random_uuid()::text;
  
  -- Cancel the old subscription
  PERFORM cancel_subscription(
    v_user_id,
    (SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_stripe_sub_id')
  );
  
  -- Create the new subscription
  v_subscription_id := manage_subscription(
    v_user_id,
    v_stripe_sub_id,
    v_plan_id,
    'active',
    NOW(),
    NOW() + INTERVAL '1 month'
  );
  
  -- Update the stored subscription IDs
  UPDATE app_settings SET value = to_jsonb(v_subscription_id) WHERE id = 'test_subscription_id';
  UPDATE app_settings SET value = to_jsonb(v_stripe_sub_id) WHERE id = 'test_stripe_sub_id';
  
  RAISE NOTICE 'Changed to Brand plan subscription with ID: %', v_subscription_id;
END $$;

-- Check that user profile type was changed to 'brand'
SELECT * FROM user_profiles WHERE id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_sub_user_id')::UUID);

-- Check subscription history
SELECT * FROM subscriptions WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_sub_user_id')::UUID);

-- Check that more credits were allocated
SELECT * FROM user_credits WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_sub_user_id')::UUID);

-- Clean up test data
-- Uncomment this section to clean up after testing
/*
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the test user ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_user_id FROM app_settings WHERE id = 'test_sub_user_id';
  
  -- Delete test data
  DELETE FROM purchase_history WHERE user_id = v_user_id;
  DELETE FROM subscriptions WHERE user_id = v_user_id;
  DELETE FROM user_credits WHERE user_id = v_user_id;
  DELETE FROM user_profiles WHERE id = v_user_id;
  
  -- Delete test app settings
  DELETE FROM app_settings WHERE id IN (
    'test_sub_user_id',
    'test_subscription_id',
    'test_stripe_sub_id',
    'test_creator_plan_id',
    'test_brand_plan_id'
  );
  
  RAISE NOTICE 'Test data cleaned up successfully';
END $$;
*/ 