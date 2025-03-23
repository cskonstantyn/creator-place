-- Products table to store information about your products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prices table to store pricing information, linked to products
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  stripe_price_id TEXT,
  currency TEXT NOT NULL DEFAULT 'usd',
  unit_amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  interval TEXT,
  interval_count INTEGER,
  trial_period_days INTEGER,
  metadata JSONB,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table to store customer information
CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  metadata JSONB,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table to track user subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  price_id UUID NOT NULL REFERENCES prices(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table to record payment history
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  price_id UUID REFERENCES prices(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB,
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit system tables

-- Credit systems table defines the different credit systems you can have
CREATE TABLE credit_systems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit currencies table for defining different types of credits within a system
CREATE TABLE credit_currencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  symbol TEXT,
  system_id UUID NOT NULL REFERENCES credit_systems(id) ON DELETE CASCADE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exchange rates between different credit currencies
CREATE TABLE exchange_rates (
  from_currency_id UUID NOT NULL REFERENCES credit_currencies(id) ON DELETE CASCADE,
  to_currency_id UUID NOT NULL REFERENCES credit_currencies(id) ON DELETE CASCADE,
  rate NUMERIC(10, 4) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (from_currency_id, to_currency_id)
);

-- User credits to track user balances
CREATE TABLE user_credits (
  user_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  currency_id UUID NOT NULL REFERENCES credit_currencies(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, currency_id)
);

-- Credit transactions to record credit history
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  currency_id UUID NOT NULL REFERENCES credit_currencies(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  reference_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamification tables

-- Achievements table to define achievements that users can unlock
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievement conditions table to define the conditions for unlocking achievements
CREATE TABLE achievement_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  operator TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements to track which achievements a user has unlocked
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- Row-Level Security Policies
-- These policies restrict access to data based on the authenticated user

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
-- Products: Anyone can view active products, only admins can modify
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (active = TRUE);
CREATE POLICY "Only admins can insert products" ON products FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can update products" ON products FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can delete products" ON products FOR DELETE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

-- Prices: Anyone can view active prices, only admins can modify
CREATE POLICY "Anyone can view active prices" ON prices FOR SELECT USING (active = TRUE);
CREATE POLICY "Only admins can insert prices" ON prices FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can update prices" ON prices FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can delete prices" ON prices FOR DELETE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

-- Customers: Users can view and modify their own data, admins can see all
CREATE POLICY "Users can view own customer data" ON customers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all customer data" ON customers FOR SELECT USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Users can insert own customer data" ON customers FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own customer data" ON customers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any customer data" ON customers FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

-- Subscriptions: Users can view their own subscriptions, admins can see all
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Admins can view all subscriptions" ON subscriptions FOR SELECT USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only system can insert subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE) OR auth.uid() = customer_id);
CREATE POLICY "Only system can update subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

-- Payments: Users can view their own payments, admins can see all
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only system can insert payments" ON payments FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only system can update payments" ON payments FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

-- Credit systems: Anyone can view, only admins can modify
CREATE POLICY "Anyone can view credit systems" ON credit_systems FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can insert credit systems" ON credit_systems FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can update credit systems" ON credit_systems FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can delete credit systems" ON credit_systems FOR DELETE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

-- Credit currencies: Anyone can view, only admins can modify
CREATE POLICY "Anyone can view credit currencies" ON credit_currencies FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can insert credit currencies" ON credit_currencies FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can update credit currencies" ON credit_currencies FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can delete credit currencies" ON credit_currencies FOR DELETE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

-- Exchange rates: Anyone can view, only admins can modify
CREATE POLICY "Anyone can view exchange rates" ON exchange_rates FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can insert exchange rates" ON exchange_rates FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can update exchange rates" ON exchange_rates FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can delete exchange rates" ON exchange_rates FOR DELETE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

-- User credits: Users can view their own credits, admins can see all
CREATE POLICY "Users can view own credits" ON user_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all user credits" ON user_credits FOR SELECT USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only system can insert user credits" ON user_credits FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE) OR auth.uid() = user_id);
CREATE POLICY "Only system can update user credits" ON user_credits FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE) OR auth.uid() = user_id);

-- Credit transactions: Users can view their own transactions, admins can see all
CREATE POLICY "Users can view own credit transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all credit transactions" ON credit_transactions FOR SELECT USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only system can insert credit transactions" ON credit_transactions FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE) OR auth.uid() = user_id);

-- Achievements: Anyone can view achievements, only admins can modify
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can insert achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can update achievements" ON achievements FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can delete achievements" ON achievements FOR DELETE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

-- Achievement conditions: Anyone can view conditions, only admins can modify
CREATE POLICY "Anyone can view achievement conditions" ON achievement_conditions FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can insert achievement conditions" ON achievement_conditions FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can update achievement conditions" ON achievement_conditions FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only admins can delete achievement conditions" ON achievement_conditions FOR DELETE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

-- User achievements: Users can view their own achievements, admins can see all
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all user achievements" ON user_achievements FOR SELECT USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));
CREATE POLICY "Only system can insert user achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE) OR auth.uid() = user_id);

-- Add is_admin column to auth.users
-- This requires superuser permissions in Supabase SQL editor
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create a function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 