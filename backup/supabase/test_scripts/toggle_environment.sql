-- Test script for toggling between testing and production environments

-- First, check the current environment
SELECT * FROM app_settings WHERE id = 'environment';

-- Toggle to testing mode
SELECT toggle_environment();

-- Verify it changed
SELECT * FROM app_settings WHERE id = 'environment';

-- Execute a test payment in testing mode
DO $$
DECLARE
  v_user_id UUID := '00000000-0000-0000-0000-000000000000'; -- Replace with a real user ID
  v_payment_plan_id UUID;
BEGIN
  -- Get a payment plan ID
  SELECT id INTO v_payment_plan_id FROM payment_plans LIMIT 1;
  
  IF v_payment_plan_id IS NULL THEN
    RAISE NOTICE 'No payment plans found. Please create one first.';
    RETURN;
  END IF;
  
  -- Insert a test payment intent
  INSERT INTO payment_intents (
    user_id,
    payment_plan_id,
    amount,
    currency,
    status,
    stripe_payment_intent_id
  ) VALUES (
    v_user_id,
    v_payment_plan_id,
    0, -- No charge in test mode
    'usd',
    'succeeded',
    'test_pi_' || gen_random_uuid()::text
  );
  
  RAISE NOTICE 'Created test payment intent successfully.';
END $$;

-- Toggle to production mode
SELECT toggle_environment();

-- Verify it changed
SELECT * FROM app_settings WHERE id = 'environment';

-- Reset back to testing for safety
SELECT toggle_environment();
SELECT * FROM app_settings WHERE id = 'environment'; 