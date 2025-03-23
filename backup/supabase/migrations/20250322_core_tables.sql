-- Create brand_deals table
CREATE TABLE IF NOT EXISTS brand_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT NOT NULL,
  requirements TEXT,
  compensation TEXT NOT NULL,
  application_url TEXT,
  contact_email TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create discount_deals table
CREATE TABLE IF NOT EXISTS discount_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT NOT NULL,
  discount_code TEXT NOT NULL,
  discount_percentage INTEGER,
  discount_flat_amount NUMERIC,
  expiry_date TIMESTAMP WITH TIME ZONE,
  terms_conditions TEXT,
  product_url TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on tables
ALTER TABLE brand_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_deals ENABLE ROW LEVEL SECURITY;

-- Add triggers for updating timestamps
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'brand_deals_updated_at'
  ) THEN
    CREATE TRIGGER brand_deals_updated_at
    BEFORE UPDATE ON brand_deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'discount_deals_updated_at'
  ) THEN
    CREATE TRIGGER discount_deals_updated_at
    BEFORE UPDATE ON discount_deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

-- Add RLS policies for brand_deals
CREATE POLICY "Anyone can view active brand deals" 
  ON brand_deals FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "System can manage all brand deals" 
  ON brand_deals FOR ALL
  USING (auth.role() = 'service_role');

-- Add RLS policies for discount_deals
CREATE POLICY "Anyone can view active discount deals" 
  ON discount_deals FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "System can manage all discount deals" 
  ON discount_deals FOR ALL
  USING (auth.role() = 'service_role');

-- Add sample data for brand_deals
INSERT INTO brand_deals (title, description, company_name, requirements, compensation, application_url, contact_email, category)
VALUES 
  ('Fashion Influencer Collaboration', 'Looking for fashion influencers to showcase our new summer collection', 'StyleHouse', 'Minimum 10k followers, fashion-focused content', '$500 per post + free clothing', 'https://stylehouse.com/apply', 'collab@stylehouse.com', 'Fashion'),
  ('Tech Product Review', 'Seeking tech reviewers for our new smartphone accessory', 'TechGadgets', 'Technology channel with at least 5k subscribers', '$300 + free product', 'https://techgadgets.com/creators', 'partnerships@techgadgets.com', 'Technology'),
  ('Fitness Program Promotion', 'Want fitness creators to try and promote our 12-week workout program', 'FitLife', 'Fitness-oriented content creators with engaged audience', 'Revenue share: 30% commission on sales', 'https://fitlife.com/partner', 'creators@fitlife.com', 'Fitness');

-- Add sample data for discount_deals
INSERT INTO discount_deals (title, description, company_name, discount_code, discount_percentage, discount_flat_amount, expiry_date, terms_conditions, product_url, category)
VALUES 
  ('Exclusive Camera Equipment Discount', '20% off all camera equipment for content creators', 'PhotoPro', 'CREATOR20', 20, NULL, NOW() + INTERVAL '90 days', 'Cannot be combined with other offers. Valid for online purchases only.', 'https://photopro.com/equipment', 'Photography'),
  ('Premium Editing Software Deal', 'Special creator price on our professional video editing suite', 'EditMaster', 'EDITPRO50', 50, NULL, NOW() + INTERVAL '60 days', 'For new customers only. Annual subscription required.', 'https://editmaster.com/pro', 'Software'),
  ('Studio Microphone Special', 'Flat $75 off our bestselling podcast microphone', 'AudioTech', 'PODCAST75', NULL, 75.00, NOW() + INTERVAL '30 days', 'While supplies last. Shipping not included.', 'https://audiotech.com/podcast-mic', 'Audio'),
  ('Lighting Kit Bundle', 'Creator bundle: Get our complete lighting setup at 35% off', 'StreamLight', 'LIGHTKIT35', 35, NULL, NOW() + INTERVAL '45 days', 'Free shipping on orders over $200.', 'https://streamlight.com/creator-kit', 'Streaming'); 