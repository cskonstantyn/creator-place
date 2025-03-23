-- Function to get deals with stats (brand and discount deals)
CREATE OR REPLACE FUNCTION get_deals_with_stats(filter_deal_type TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  avg_rating NUMERIC,
  total_views INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  deal_type TEXT
) AS $$
BEGIN
  -- Returns a combined list of brand and discount deals with stats
  RETURN QUERY
  
  -- Get brand deals
  (SELECT 
    bd.id,
    bd.title,
    bd.description,
    COALESCE(AVG(cf.rating), 0) as avg_rating,
    bd.views as total_views,
    bd.created_at,
    'brand_deal' as deal_type
  FROM brand_deals bd
  LEFT JOIN creator_feedback cf ON bd.id = cf.deal_id AND cf.deal_type = 'brand_deal'
  WHERE filter_deal_type IS NULL OR filter_deal_type = 'brand_deal'
  GROUP BY bd.id, bd.title, bd.description, bd.views, bd.created_at)
  
  UNION ALL
  
  -- Get discount deals
  (SELECT 
    dd.id,
    dd.title,
    dd.description,
    COALESCE(AVG(cf.rating), 0) as avg_rating,
    dd.views as total_views,
    dd.created_at,
    'discount_deal' as deal_type
  FROM discount_deals dd
  LEFT JOIN creator_feedback cf ON dd.id = cf.deal_id AND cf.deal_type = 'discount_deal'
  WHERE filter_deal_type IS NULL OR filter_deal_type = 'discount_deal'
  GROUP BY dd.id, dd.title, dd.description, dd.views, dd.created_at)
  
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to toggle favorites
CREATE OR REPLACE FUNCTION toggle_favorite(
  p_user_id UUID,
  p_item_id UUID,
  p_item_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  favorite_exists BOOLEAN;
BEGIN
  -- Check if the favorite already exists
  SELECT EXISTS (
    SELECT 1 FROM favorites 
    WHERE user_id = p_user_id AND item_id = p_item_id AND item_type = p_item_type
  ) INTO favorite_exists;
  
  -- If it exists, remove it
  IF favorite_exists THEN
    DELETE FROM favorites 
    WHERE user_id = p_user_id AND item_id = p_item_id AND item_type = p_item_type;
    RETURN FALSE; -- Indicates item was removed from favorites
  ELSE
    -- If it doesn't exist, add it
    INSERT INTO favorites (user_id, item_id, item_type)
    VALUES (p_user_id, p_item_id, p_item_type);
    RETURN TRUE; -- Indicates item was added to favorites
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to use credits
CREATE OR REPLACE FUNCTION use_credits(
  p_user_id UUID,
  p_credits_amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  user_credits_record user_credits%ROWTYPE;
BEGIN
  -- Get the user's credits
  SELECT * INTO user_credits_record FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE; -- Lock the row to prevent concurrent modification
  
  -- If no record exists, insert with default values
  IF NOT FOUND THEN
    INSERT INTO user_credits (user_id, credits_remaining, credits_used, credits_purchased)
    VALUES (p_user_id, 0, 0, 0)
    RETURNING * INTO user_credits_record;
  END IF;
  
  -- Check if user has enough credits
  IF user_credits_record.credits_remaining < p_credits_amount THEN
    RETURN FALSE; -- Not enough credits
  END IF;
  
  -- Update credits
  UPDATE user_credits
  SET 
    credits_remaining = credits_remaining - p_credits_amount,
    credits_used = credits_used + p_credits_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN TRUE; -- Successfully used credits
END;
$$ LANGUAGE plpgsql; 