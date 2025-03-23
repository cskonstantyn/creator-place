-- Create users_profiles table for extended user information
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  email TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('creator', 'brand', 'admin', 'regular')) DEFAULT 'regular',
  is_verified BOOLEAN DEFAULT false,
  social_links JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create subscriptions table to track user subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan_id UUID REFERENCES payment_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'past_due', 'trialing', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create deal_submissions table to track brand/discount deal submissions
CREATE TABLE IF NOT EXISTS deal_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_type TEXT NOT NULL CHECK (deal_type IN ('brand_deal', 'discount_deal')),
  deal_id UUID,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'draft')),
  submission_data JSONB NOT NULL,
  admin_feedback TEXT,
  payment_intent_id UUID REFERENCES payment_intents(id),
  credits_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create purchase_history table to track user purchases
CREATE TABLE IF NOT EXISTS purchase_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_intent_id UUID REFERENCES payment_intents(id),
  deal_id UUID,
  deal_type TEXT CHECK (deal_type IN ('brand_deal', 'discount_deal', 'subscription', 'credits')),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('completed', 'refunded', 'failed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create settings table for app-level configurations
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY, -- key for the setting
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Add triggers for updating timestamps
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'user_profiles_updated_at'
  ) THEN
    CREATE TRIGGER user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'subscriptions_updated_at'
  ) THEN
    CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'deal_submissions_updated_at'
  ) THEN
    CREATE TRIGGER deal_submissions_updated_at
    BEFORE UPDATE ON deal_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'app_settings_updated_at'
  ) THEN
    CREATE TRIGGER app_settings_updated_at
    BEFORE UPDATE ON app_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" 
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" 
  ON user_profiles FOR SELECT
  USING (is_verified = true);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage all subscriptions" 
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for deal_submissions
CREATE POLICY "Users can view their own submissions" 
  ON deal_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions" 
  ON deal_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" 
  ON deal_submissions FOR UPDATE
  USING (auth.uid() = user_id AND status IN ('draft', 'pending'));

CREATE POLICY "System can manage all submissions" 
  ON deal_submissions FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for purchase_history
CREATE POLICY "Users can view their own purchase history" 
  ON purchase_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage all purchase history" 
  ON purchase_history FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for app_settings
CREATE POLICY "Anyone can view public settings" 
  ON app_settings FOR SELECT
  USING (is_public = true);

CREATE POLICY "Only admins can manage settings" 
  ON app_settings FOR ALL
  USING (auth.role() = 'service_role');

-- Insert app settings for environment configuration
INSERT INTO app_settings (id, value, description, is_public)
VALUES 
  (
    'environment', 
    '{"mode": "testing", "stripe_mode": "test"}'::jsonb, 
    'Environment configuration for the application', 
    true
  ),
  (
    'deal_pricing', 
    '{"brand_deal_credits": 20, "discount_deal_credits": 10}'::jsonb, 
    'Credit costs for submitting different types of deals', 
    true
  );

-- Create a function to toggle environment between testing and production
CREATE OR REPLACE FUNCTION toggle_environment()
RETURNS JSONB AS $$
DECLARE
  current_env JSONB;
  new_env JSONB;
BEGIN
  -- Get current environment
  SELECT value INTO current_env FROM app_settings WHERE id = 'environment';
  
  -- Toggle environment
  IF current_env->>'mode' = 'testing' THEN
    new_env = '{"mode": "production", "stripe_mode": "live"}'::jsonb;
  ELSE
    new_env = '{"mode": "testing", "stripe_mode": "test"}'::jsonb;
  END IF;
  
  -- Update environment
  UPDATE app_settings SET value = new_env WHERE id = 'environment';
  
  RETURN new_env;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get current environment configuration
CREATE OR REPLACE FUNCTION get_environment()
RETURNS JSONB AS $$
DECLARE
  env_config JSONB;
BEGIN
  SELECT value INTO env_config FROM app_settings WHERE id = 'environment';
  RETURN env_config;
END;
$$ LANGUAGE plpgsql;

-- Create a function to submit a new deal
CREATE OR REPLACE FUNCTION submit_deal(
  p_user_id UUID,
  p_deal_type TEXT,
  p_submission_data JSONB,
  p_status TEXT DEFAULT 'pending'
)
RETURNS UUID AS $$
DECLARE
  credit_cost INTEGER;
  user_credits_record user_credits%ROWTYPE;
  submission_id UUID;
BEGIN
  -- Determine credit cost based on deal type
  SELECT 
    CASE 
      WHEN p_deal_type = 'brand_deal' THEN (value->>'brand_deal_credits')::INTEGER
      WHEN p_deal_type = 'discount_deal' THEN (value->>'discount_deal_credits')::INTEGER
      ELSE 0
    END INTO credit_cost
  FROM app_settings
  WHERE id = 'deal_pricing';
  
  -- Get user credits
  SELECT * INTO user_credits_record 
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- Check if user has enough credits
  IF user_credits_record.credits_remaining < credit_cost THEN
    RAISE EXCEPTION 'Not enough credits to submit deal. Required: %, Available: %', 
      credit_cost, user_credits_record.credits_remaining;
  END IF;
  
  -- Create submission record
  INSERT INTO deal_submissions (
    user_id,
    deal_type,
    status,
    submission_data,
    credits_used
  ) VALUES (
    p_user_id,
    p_deal_type,
    p_status,
    p_submission_data,
    credit_cost
  ) RETURNING id INTO submission_id;
  
  -- Use credits if not in draft mode
  IF p_status != 'draft' THEN
    -- Update user credits
    UPDATE user_credits
    SET 
      credits_remaining = credits_remaining - credit_cost,
      credits_used = credits_used + credit_cost
    WHERE user_id = p_user_id;
  END IF;
  
  RETURN submission_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql; 