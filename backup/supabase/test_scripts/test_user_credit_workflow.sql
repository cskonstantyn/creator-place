-- Test script for user credit management workflow

-- First, make sure we're in testing mode
SELECT toggle_environment();

-- Set up a test user
DO $$
DECLARE
  v_user_id UUID;
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
    'credit_test_user',
    'Credit Test User',
    'creator',
    'This is a test user for credit testing',
    TRUE
  );
  
  -- Store the user ID for later use
  INSERT INTO app_settings (id, value, is_public) 
  VALUES ('test_credit_user_id', to_jsonb(v_user_id), true)
  ON CONFLICT (id) 
  DO UPDATE SET value = to_jsonb(v_user_id);
  
  RAISE NOTICE 'Created test user with ID: %', v_user_id;
END $$;

-- Test adding initial credits
DO $$
DECLARE
  v_user_id UUID;
  v_initial_credits INTEGER := 20;
  v_actual_credits INTEGER;
BEGIN
  -- Get the test user ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_user_id FROM app_settings WHERE id = 'test_credit_user_id';
  
  -- Add initial credits
  INSERT INTO user_credits (
    user_id,
    credits_amount,
    credits_source,
    description
  ) VALUES (
    v_user_id,
    v_initial_credits,
    'manual',
    'Initial credits for testing'
  );
  
  -- Verify credits were added
  SELECT SUM(credits_amount) INTO v_actual_credits FROM user_credits WHERE user_id = v_user_id;
  
  IF v_actual_credits = v_initial_credits THEN
    RAISE NOTICE 'Successfully added % initial credits', v_initial_credits;
  ELSE
    RAISE EXCEPTION 'Failed to add initial credits: expected=%, got=%', v_initial_credits, v_actual_credits;
  END IF;
END $$;

-- Check user's current credits
SELECT * FROM user_credits 
WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_credit_user_id')::UUID);

-- Test using credits for a deal
DO $$
DECLARE
  v_user_id UUID;
  v_initial_credits INTEGER;
  v_used_credits INTEGER := 5;
  v_remaining_credits INTEGER;
  v_result BOOLEAN;
BEGIN
  -- Get the test user ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_user_id FROM app_settings WHERE id = 'test_credit_user_id';
  
  -- Get initial credits
  SELECT SUM(credits_amount) INTO v_initial_credits FROM user_credits WHERE user_id = v_user_id;
  
  -- Use credits
  SELECT use_credits(v_user_id, v_used_credits, 'Test usage of credits') INTO v_result;
  
  -- Verify credits were used
  SELECT SUM(credits_amount) INTO v_remaining_credits FROM user_credits WHERE user_id = v_user_id;
  
  IF v_result = TRUE AND v_remaining_credits = (v_initial_credits - v_used_credits) THEN
    RAISE NOTICE 'Successfully used % credits. Remaining: %', v_used_credits, v_remaining_credits;
  ELSE
    RAISE EXCEPTION 'Failed to use credits: initial=%, used=%, remaining=%, result=%', 
      v_initial_credits, v_used_credits, v_remaining_credits, v_result;
  END IF;
END $$;

-- Test using more credits than available
DO $$
DECLARE
  v_user_id UUID;
  v_available_credits INTEGER;
  v_excess_credits INTEGER;
  v_result BOOLEAN;
BEGIN
  -- Get the test user ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_user_id FROM app_settings WHERE id = 'test_credit_user_id';
  
  -- Get available credits
  SELECT SUM(credits_amount) INTO v_available_credits FROM user_credits WHERE user_id = v_user_id;
  
  -- Try to use more credits than available
  v_excess_credits := v_available_credits + 10;
  
  -- Use credits (should fail)
  BEGIN
    SELECT use_credits(v_user_id, v_excess_credits, 'This should fail') INTO v_result;
    
    -- If we get here, the function didn't throw an exception
    RAISE EXCEPTION 'Function should have failed but returned %', v_result;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Successfully caught exception when trying to use more credits than available';
  END;
  
  -- Verify credits were not changed
  DECLARE
    v_final_credits INTEGER;
  BEGIN
    SELECT SUM(credits_amount) INTO v_final_credits FROM user_credits WHERE user_id = v_user_id;
    
    IF v_final_credits = v_available_credits THEN
      RAISE NOTICE 'Credits unchanged after failed attempt: %', v_final_credits;
    ELSE
      RAISE EXCEPTION 'Credits changed after failed attempt: before=%, after=%', 
        v_available_credits, v_final_credits;
    END IF;
  END;
END $$;

-- Test adding more credits
DO $$
DECLARE
  v_user_id UUID;
  v_before_credits INTEGER;
  v_added_credits INTEGER := 15;
  v_after_credits INTEGER;
BEGIN
  -- Get the test user ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_user_id FROM app_settings WHERE id = 'test_credit_user_id';
  
  -- Get credits before adding more
  SELECT SUM(credits_amount) INTO v_before_credits FROM user_credits WHERE user_id = v_user_id;
  
  -- Add more credits
  INSERT INTO user_credits (
    user_id,
    credits_amount,
    credits_source,
    description
  ) VALUES (
    v_user_id,
    v_added_credits,
    'purchase',
    'Additional purchased credits'
  );
  
  -- Verify credits were added
  SELECT SUM(credits_amount) INTO v_after_credits FROM user_credits WHERE user_id = v_user_id;
  
  IF v_after_credits = (v_before_credits + v_added_credits) THEN
    RAISE NOTICE 'Successfully added % more credits. Total: %', v_added_credits, v_after_credits;
  ELSE
    RAISE EXCEPTION 'Failed to add more credits: before=%, added=%, after=%', 
      v_before_credits, v_added_credits, v_after_credits;
  END IF;
END $$;

-- Test credit history
SELECT * FROM user_credits 
WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_credit_user_id')::UUID)
ORDER BY created_at;

-- Clean up test data
-- Uncomment this section to clean up after testing
/*
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the test user ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_user_id FROM app_settings WHERE id = 'test_credit_user_id';
  
  -- Delete test data
  DELETE FROM user_credits WHERE user_id = v_user_id;
  DELETE FROM user_profiles WHERE id = v_user_id;
  
  -- Delete test app settings
  DELETE FROM app_settings WHERE id = 'test_credit_user_id';
  
  RAISE NOTICE 'Test data cleaned up successfully';
END $$;
*/ 