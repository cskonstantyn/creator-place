-- Create payment_plans table
CREATE TABLE IF NOT EXISTS payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year', 'one_time')),
  type TEXT NOT NULL CHECK (type IN ('subscription', 'one_time')),
  credit_amount INTEGER NOT NULL,
  features JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  stripe_price_id TEXT,
  stripe_product_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on the payment_plans table
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;

-- Add triggers for updating timestamps
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'payment_plans_updated_at'
  ) THEN
    CREATE TRIGGER payment_plans_updated_at
    BEFORE UPDATE ON payment_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

-- Add RLS policies for payment_plans
CREATE POLICY "Anyone can view active payment plans" 
  ON payment_plans FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "System can manage all payment plans" 
  ON payment_plans FOR ALL
  USING (auth.role() = 'service_role');

-- Add sample payment plans
INSERT INTO payment_plans (
  name, 
  description, 
  price, 
  interval, 
  type, 
  credit_amount, 
  features, 
  is_active, 
  is_featured
)
VALUES 
  (
    'Basic', 
    '10 credits to access exclusive deals', 
    9.99, 
    'one_time', 
    'one_time', 
    10, 
    '["Access to exclusive deals", "One-time purchase"]'::jsonb, 
    true, 
    false
  ),
  (
    'Pro', 
    '50 credits with priority support', 
    39.99, 
    'one_time', 
    'one_time', 
    50, 
    '["Access to exclusive deals", "Priority support", "Discounted rate per credit"]'::jsonb, 
    true, 
    true
  ),
  (
    'Enterprise', 
    '200 credits with all premium features', 
    149.99, 
    'one_time', 
    'one_time', 
    200, 
    '["Access to exclusive deals", "Premium support", "Bulk discount", "Early access to new deals"]'::jsonb, 
    true, 
    false
  ); 