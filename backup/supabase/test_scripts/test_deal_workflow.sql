-- Test script for deal submission and approval workflow

-- First, make sure we're in testing mode
SELECT toggle_environment();

-- Set up a test user with credits
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
    is_verified
  ) VALUES (
    v_user_id,
    'test_user',
    'Test User',
    'creator',
    TRUE
  );
  
  -- Add credits to the user
  INSERT INTO user_credits (
    user_id,
    credits_remaining,
    credits_used,
    total_credits_received
  ) VALUES (
    v_user_id,
    100,
    0,
    100
  );
  
  -- Store the user ID for later use
  INSERT INTO app_settings (id, value, is_public) 
  VALUES ('test_user_id', to_jsonb(v_user_id), true)
  ON CONFLICT (id) 
  DO UPDATE SET value = to_jsonb(v_user_id);
  
  RAISE NOTICE 'Created test user with ID: %', v_user_id;
END $$;

-- Get the test user ID
DO $$
DECLARE
  v_user_id UUID;
  v_submission_id UUID;
BEGIN
  -- Get the test user ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_user_id FROM app_settings WHERE id = 'test_user_id';
  
  -- Submit a test brand deal
  v_submission_id := submit_deal(
    v_user_id,
    'brand_deal',
    jsonb_build_object(
      'title', 'Test Brand Deal',
      'description', 'This is a test brand deal created via the test script',
      'company_name', 'Test Company',
      'requirements', 'Must have at least 1000 followers',
      'compensation', '$100-$500',
      'application_url', 'https://example.com/apply',
      'contact_email', 'test@example.com',
      'category', 'Technology'
    )
  );
  
  RAISE NOTICE 'Submitted brand deal with ID: %', v_submission_id;
  
  -- Store the submission ID for later approval
  INSERT INTO app_settings (id, value, is_public) 
  VALUES ('test_brand_submission_id', to_jsonb(v_submission_id), true)
  ON CONFLICT (id) 
  DO UPDATE SET value = to_jsonb(v_submission_id);
  
  -- Submit a test discount deal
  v_submission_id := submit_deal(
    v_user_id,
    'discount_deal',
    jsonb_build_object(
      'title', 'Test Discount Deal',
      'description', 'This is a test discount deal created via the test script',
      'company_name', 'Test Company',
      'discount_code', 'TEST20',
      'discount_percentage', 20,
      'discount_flat_amount', NULL,
      'expiry_date', (NOW() + INTERVAL '30 days')::TEXT,
      'terms_conditions', 'Limit one per customer',
      'product_url', 'https://example.com/product',
      'category', 'Software'
    )
  );
  
  RAISE NOTICE 'Submitted discount deal with ID: %', v_submission_id;
  
  -- Store the submission ID for later approval
  INSERT INTO app_settings (id, value, is_public) 
  VALUES ('test_discount_submission_id', to_jsonb(v_submission_id), true)
  ON CONFLICT (id) 
  DO UPDATE SET value = to_jsonb(v_submission_id);
  
  -- Check user's credits after submissions
  RAISE NOTICE 'User credits after submissions:';
END $$;

-- Verify submissions were created
SELECT * FROM deal_submissions WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_user_id')::UUID);

-- Check user credits
SELECT * FROM user_credits WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_user_id')::UUID);

-- Approve the brand deal submission
DO $$
DECLARE
  v_submission_id UUID;
  v_new_deal_id UUID;
BEGIN
  -- Get the test submission ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_submission_id FROM app_settings WHERE id = 'test_brand_submission_id';
  
  -- Approve the submission
  v_new_deal_id := approve_deal_submission(
    v_submission_id,
    'Approved via test script'
  );
  
  RAISE NOTICE 'Approved brand deal submission. New deal ID: %', v_new_deal_id;
  
  -- Store the new deal ID
  INSERT INTO app_settings (id, value, is_public) 
  VALUES ('test_brand_deal_id', to_jsonb(v_new_deal_id), true)
  ON CONFLICT (id) 
  DO UPDATE SET value = to_jsonb(v_new_deal_id);
END $$;

-- Reject the discount deal submission
DO $$
DECLARE
  v_submission_id UUID;
  v_result BOOLEAN;
BEGIN
  -- Get the test submission ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_submission_id FROM app_settings WHERE id = 'test_discount_submission_id';
  
  -- Reject the submission
  v_result := reject_deal_submission(
    v_submission_id,
    'Rejected via test script for testing purposes'
  );
  
  RAISE NOTICE 'Rejected discount deal submission: %', v_result;
END $$;

-- Verify the results
SELECT * FROM deal_submissions WHERE id IN (
  ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_brand_submission_id')::UUID),
  ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_discount_submission_id')::UUID)
);

-- Check the new brand deal
SELECT * FROM brand_deals WHERE id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_brand_deal_id')::UUID);

-- Check if user credits were refunded for the rejected submission
SELECT * FROM user_credits WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_user_id')::UUID);

-- Check purchase history
SELECT * FROM purchase_history WHERE user_id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_user_id')::UUID);

-- Test adding a view to the brand deal
SELECT increment_deal_views(
  ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_brand_deal_id')::UUID),
  'brand_deal'
);

-- Check the view count
SELECT * FROM brand_deals WHERE id = ((SELECT value#>>'{}'::text[] FROM app_settings WHERE id = 'test_brand_deal_id')::UUID);

-- Test searching for the deal
SELECT * FROM search_deals(
  p_search_term := 'Test Brand'
);

-- Clean up test data
-- Uncomment this section to clean up after testing
/*
DO $$
DECLARE
  v_user_id UUID;
  v_brand_deal_id UUID;
BEGIN
  -- Get the test user ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_user_id FROM app_settings WHERE id = 'test_user_id';
  
  -- Get the brand deal ID
  SELECT (value#>>'{}'::text[])::UUID INTO v_brand_deal_id FROM app_settings WHERE id = 'test_brand_deal_id';
  
  -- Delete test data
  DELETE FROM purchase_history WHERE user_id = v_user_id;
  DELETE FROM brand_deals WHERE id = v_brand_deal_id;
  DELETE FROM deal_submissions WHERE user_id = v_user_id;
  DELETE FROM user_credits WHERE user_id = v_user_id;
  DELETE FROM user_profiles WHERE id = v_user_id;
  
  -- Delete test app settings
  DELETE FROM app_settings WHERE id IN (
    'test_user_id',
    'test_brand_submission_id',
    'test_discount_submission_id',
    'test_brand_deal_id'
  );
  
  RAISE NOTICE 'Test data cleaned up successfully';
END $$;
*/ 