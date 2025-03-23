-- Test script for environment toggling functionality

-- Check the initial environment
DO $$
DECLARE
  v_environment JSONB;
  v_mode TEXT;
BEGIN
  -- Get the current environment
  SELECT value INTO v_environment FROM app_settings WHERE id = 'environment';
  
  -- Extract mode from the JSONB
  v_mode := v_environment->>'mode';
  
  RAISE NOTICE 'Initial environment setting: % (mode: %)', v_environment, v_mode;
  
  -- Verify that the environment setting exists
  IF v_environment IS NULL THEN
    RAISE EXCEPTION 'Environment setting not found in app_settings table';
  END IF;
END $$;

-- Test toggling the environment
DO $$
DECLARE
  v_original JSONB;
  v_new JSONB;
  v_mode_before TEXT;
  v_mode_after TEXT;
BEGIN
  -- Store the original environment
  SELECT value INTO v_original FROM app_settings WHERE id = 'environment';
  v_mode_before := v_original->>'mode';
  
  -- Toggle the environment
  PERFORM toggle_environment();
  
  -- Get the new environment
  SELECT value INTO v_new FROM app_settings WHERE id = 'environment';
  v_mode_after := v_new->>'mode';
  
  -- Verify the environment was toggled
  IF (v_mode_before = 'testing' AND v_mode_after = 'production') OR
     (v_mode_before = 'production' AND v_mode_after = 'testing') THEN
    RAISE NOTICE 'Environment successfully toggled from % to %', v_mode_before, v_mode_after;
  ELSE
    RAISE EXCEPTION 'Environment toggle failed: original=%, new=%', v_mode_before, v_mode_after;
  END IF;
END $$;

-- Toggle back to the original environment
DO $$
DECLARE
  v_environment JSONB;
  v_current_mode TEXT;
  v_expected_mode TEXT;
BEGIN
  -- Get the current environment
  SELECT value INTO v_environment FROM app_settings WHERE id = 'environment';
  v_current_mode := v_environment->>'mode';
  
  -- Toggle again to go back to original
  PERFORM toggle_environment();
  
  -- Get the expected environment (opposite of current)
  v_expected_mode := CASE WHEN v_current_mode = 'testing' THEN 'production' ELSE 'testing' END;
  
  -- Verify we're back to the expected environment
  SELECT value->>'mode' INTO v_current_mode FROM app_settings WHERE id = 'environment';
  
  IF v_current_mode = v_expected_mode THEN
    RAISE NOTICE 'Environment successfully toggled back to %', v_current_mode;
  ELSE
    RAISE EXCEPTION 'Environment toggle back failed: expected=%, got=%', v_expected_mode, v_current_mode;
  END IF;
END $$;

-- Test the get_environment function
DO $$
DECLARE
  v_db_env JSONB;
  v_fn_env JSONB;
BEGIN
  -- Get the environment from the database directly
  SELECT value INTO v_db_env FROM app_settings WHERE id = 'environment';
  
  -- Get the environment using the function
  SELECT get_environment() INTO v_fn_env;
  
  -- Verify the function returns the correct environment
  IF v_db_env = v_fn_env THEN
    RAISE NOTICE 'get_environment() function returned correct value: %', v_fn_env;
  ELSE
    RAISE EXCEPTION 'get_environment() function returned incorrect value: expected=%, got=%', v_db_env, v_fn_env;
  END IF;
END $$; 