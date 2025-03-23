-- Create payment_plans table
CREATE TABLE IF NOT EXISTS public.payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  interval VARCHAR(20) CHECK (interval IN ('month', 'year', 'one_time')),
  interval_count INTEGER DEFAULT 1,
  type VARCHAR(20) NOT NULL CHECK (type IN ('subscription', 'credit', 'one_time')),
  credit_amount INTEGER,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  stripe_price_id VARCHAR(255),
  stripe_product_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_payment_plans_type ON public.payment_plans(type);
CREATE INDEX IF NOT EXISTS idx_payment_plans_is_active ON public.payment_plans(is_active);

-- Create payment_intents table
CREATE TABLE IF NOT EXISTS public.payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  payment_plan_id UUID REFERENCES public.payment_plans(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for payment_intents
CREATE INDEX IF NOT EXISTS idx_payment_intents_user_id ON public.payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON public.payment_intents(status);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  payment_plan_id UUID REFERENCES public.payment_plans(id),
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user_subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);

-- Create user_credits table
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  credits_remaining INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  credits_purchased INTEGER NOT NULL DEFAULT 0,
  last_purchase_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index for user_credits to ensure only one record per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits(user_id);

-- Insert default payment plans
INSERT INTO public.payment_plans (name, description, price, interval, type, credit_amount, features, is_active, is_featured, stripe_price_id, stripe_product_id)
VALUES
  ('Free Plan', 'Get started with basic access to CreatorDeals', 0.00, 'month', 'subscription', NULL, 
   ARRAY['Browse all listings', 'Save favorite deals', 'Basic profile features'], 
   TRUE, FALSE, 'price_free', 'prod_free'),
  
  ('Creator Basic', '10 credits for creating brand deal or discount listings', 19.99, 'one_time', 'credit', 10, 
   ARRAY['10 listing credits', 'No expiration date', 'Standard visibility'], 
   TRUE, FALSE, 'price_1OvXYZ123456789', 'prod_1OvXYZ123456789'),
  
  ('Creator Pro', '30 credits for creating brand deal or discount listings', 49.99, 'one_time', 'credit', 30, 
   ARRAY['30 listing credits', 'No expiration date', 'Enhanced visibility', 'Priority support'], 
   TRUE, TRUE, 'price_2PwXYZ123456789', 'prod_2PwXYZ123456789'),
  
  ('Business Monthly', 'Unlimited listings with advanced features', 99.99, 'month', 'subscription', NULL, 
   ARRAY['Unlimited listings', 'Advanced analytics', 'Featured placement', 'Dedicated support'], 
   TRUE, TRUE, 'price_3QxXYZ123456789', 'prod_3QxXYZ123456789'),
  
  ('Enterprise Yearly', 'Complete solution for large brands and agencies', 999.99, 'year', 'subscription', NULL, 
   ARRAY['Unlimited listings', 'Advanced analytics', 'Featured placement', 'Dedicated account manager', 'Custom branding', 'API access'], 
   TRUE, FALSE, 'price_4RyXYZ123456789', 'prod_4RyXYZ123456789')
ON CONFLICT (id) DO NOTHING;

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at timestamp
DROP TRIGGER IF EXISTS set_payment_plans_updated_at ON public.payment_plans;
CREATE TRIGGER set_payment_plans_updated_at
BEFORE UPDATE ON public.payment_plans
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 