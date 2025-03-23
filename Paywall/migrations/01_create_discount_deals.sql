-- Create the discount_deals table
CREATE TABLE IF NOT EXISTS discount_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  discount_code TEXT NOT NULL,
  discount_amount INTEGER NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE,
  brand_name TEXT NOT NULL,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE discount_deals ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active discount deals
CREATE POLICY "Anyone can view active discount deals" ON discount_deals
  FOR SELECT USING (active = TRUE);

-- Only admins can modify discount deals
CREATE POLICY "Only admins can insert discount deals" ON discount_deals
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

CREATE POLICY "Only admins can update discount deals" ON discount_deals
  FOR UPDATE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

CREATE POLICY "Only admins can delete discount deals" ON discount_deals
  FOR DELETE USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE is_admin = TRUE));

-- Add some sample data
INSERT INTO discount_deals (title, description, discount_code, discount_amount, brand_name, image_url, expiry_date)
VALUES 
  (
    'Spring Creator Bundle',
    'Get 30% off on our premium creator tools bundle including video editing software and stock assets.',
    'SPRING30',
    30,
    'CreatorTools Pro',
    'https://images.unsplash.com/photo-1542744094-3a31f272c490',
    NOW() + INTERVAL '30 days'
  ),
  (
    'Audio Equipment Sale',
    'Professional microphones and audio interfaces at 25% off for content creators.',
    'AUDIO25',
    25,
    'AudioGear',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
    NOW() + INTERVAL '14 days'
  ),
  (
    'Lighting Kit Special',
    'Complete studio lighting kit with 40% discount for new YouTubers and streamers.',
    'LIGHT40',
    40,
    'StudioPro',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    NOW() + INTERVAL '21 days'
  );
