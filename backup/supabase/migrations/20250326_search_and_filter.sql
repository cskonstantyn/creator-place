-- Create a function to search and filter deals
CREATE OR REPLACE FUNCTION search_deals(
  p_search_term TEXT DEFAULT NULL,
  p_categories TEXT[] DEFAULT NULL,
  p_compensation_min NUMERIC DEFAULT NULL,
  p_compensation_max NUMERIC DEFAULT NULL,
  p_discount_min INTEGER DEFAULT NULL,
  p_discount_max INTEGER DEFAULT NULL,
  p_deal_type TEXT DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'created_at',
  p_sort_order TEXT DEFAULT 'desc',
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  company_name TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  views INTEGER,
  favorites_count INTEGER,
  deal_type TEXT,
  deal_details JSONB
) AS $$
DECLARE
  query_brand_deals TEXT;
  query_discount_deals TEXT;
  query_union TEXT;
  query_sort TEXT;
  query_total TEXT;
  params TEXT[];
  param_idx INTEGER = 1;
BEGIN
  -- Base queries for both tables
  query_brand_deals := '
    SELECT 
      bd.id,
      bd.title,
      bd.description,
      bd.company_name,
      bd.category,
      bd.created_at,
      bd.views,
      COALESCE((SELECT COUNT(*) FROM favorites WHERE deal_id = bd.id AND deal_type = ''brand_deal''), 0) AS favorites_count,
      ''brand_deal'' AS deal_type,
      jsonb_build_object(
        ''compensation'', bd.compensation,
        ''requirements'', bd.requirements,
        ''application_url'', bd.application_url,
        ''contact_email'', bd.contact_email
      ) AS deal_details
    FROM brand_deals bd
    WHERE 1=1
  ';
  
  query_discount_deals := '
    SELECT 
      dd.id,
      dd.title,
      dd.description,
      dd.company_name,
      dd.category,
      dd.created_at,
      dd.views,
      COALESCE((SELECT COUNT(*) FROM favorites WHERE deal_id = dd.id AND deal_type = ''discount_deal''), 0) AS favorites_count,
      ''discount_deal'' AS deal_type,
      jsonb_build_object(
        ''discount_code'', dd.discount_code,
        ''discount_percentage'', dd.discount_percentage,
        ''discount_flat_amount'', dd.discount_flat_amount,
        ''expiry_date'', dd.expiry_date,
        ''terms_conditions'', dd.terms_conditions,
        ''product_url'', dd.product_url
      ) AS deal_details
    FROM discount_deals dd
    WHERE 1=1
  ';
  
  -- Add search term filter
  IF p_search_term IS NOT NULL AND p_search_term <> '' THEN
    params[param_idx] := '%' || p_search_term || '%';
    
    query_brand_deals := query_brand_deals || ' AND (
      bd.title ILIKE $' || param_idx::TEXT || ' OR
      bd.description ILIKE $' || param_idx::TEXT || ' OR
      bd.company_name ILIKE $' || param_idx::TEXT || '
    )';
    
    query_discount_deals := query_discount_deals || ' AND (
      dd.title ILIKE $' || param_idx::TEXT || ' OR
      dd.description ILIKE $' || param_idx::TEXT || ' OR
      dd.company_name ILIKE $' || param_idx::TEXT || '
    )';
    
    param_idx := param_idx + 1;
  END IF;
  
  -- Add categories filter
  IF p_categories IS NOT NULL AND array_length(p_categories, 1) > 0 THEN
    params[param_idx] := p_categories;
    
    query_brand_deals := query_brand_deals || ' AND bd.category = ANY($' || param_idx::TEXT || ')';
    query_discount_deals := query_discount_deals || ' AND dd.category = ANY($' || param_idx::TEXT || ')';
    
    param_idx := param_idx + 1;
  END IF;
  
  -- Add compensation filter for brand deals
  IF p_compensation_min IS NOT NULL AND p_compensation_min > 0 THEN
    params[param_idx] := p_compensation_min::TEXT;
    
    query_brand_deals := query_brand_deals || ' AND CASE 
      WHEN bd.compensation ~ ''^\\d+(\\.\\d+)?$'' THEN bd.compensation::NUMERIC 
      ELSE 0 
    END >= $' || param_idx::TEXT;
    
    param_idx := param_idx + 1;
  END IF;
  
  IF p_compensation_max IS NOT NULL AND p_compensation_max > 0 THEN
    params[param_idx] := p_compensation_max::TEXT;
    
    query_brand_deals := query_brand_deals || ' AND CASE 
      WHEN bd.compensation ~ ''^\\d+(\\.\\d+)?$'' THEN bd.compensation::NUMERIC 
      ELSE 0 
    END <= $' || param_idx::TEXT;
    
    param_idx := param_idx + 1;
  END IF;
  
  -- Add discount filter for discount deals
  IF p_discount_min IS NOT NULL AND p_discount_min > 0 THEN
    params[param_idx] := p_discount_min::TEXT;
    
    query_discount_deals := query_discount_deals || ' AND dd.discount_percentage >= $' || param_idx::TEXT;
    
    param_idx := param_idx + 1;
  END IF;
  
  IF p_discount_max IS NOT NULL AND p_discount_max > 0 THEN
    params[param_idx] := p_discount_max::TEXT;
    
    query_discount_deals := query_discount_deals || ' AND dd.discount_percentage <= $' || param_idx::TEXT;
    
    param_idx := param_idx + 1;
  END IF;
  
  -- Build the UNION query based on deal_type
  IF p_deal_type = 'brand_deal' THEN
    query_union := query_brand_deals;
  ELSIF p_deal_type = 'discount_deal' THEN
    query_union := query_discount_deals;
  ELSE
    query_union := '(' || query_brand_deals || ') UNION ALL (' || query_discount_deals || ')';
  END IF;
  
  -- Add sorting
  IF p_sort_by IS NOT NULL AND p_sort_by <> '' THEN
    IF p_sort_by = 'title' THEN
      query_sort := ' ORDER BY title ' || CASE WHEN p_sort_order = 'asc' THEN 'ASC' ELSE 'DESC' END;
    ELSIF p_sort_by = 'company_name' THEN
      query_sort := ' ORDER BY company_name ' || CASE WHEN p_sort_order = 'asc' THEN 'ASC' ELSE 'DESC' END;
    ELSIF p_sort_by = 'views' THEN
      query_sort := ' ORDER BY views ' || CASE WHEN p_sort_order = 'asc' THEN 'ASC' ELSE 'DESC' END;
    ELSIF p_sort_by = 'favorites_count' THEN
      query_sort := ' ORDER BY favorites_count ' || CASE WHEN p_sort_order = 'asc' THEN 'ASC' ELSE 'DESC' END;
    ELSE
      query_sort := ' ORDER BY created_at ' || CASE WHEN p_sort_order = 'asc' THEN 'ASC' ELSE 'DESC' END;
    END IF;
  ELSE
    query_sort := ' ORDER BY created_at DESC';
  END IF;
  
  -- Add pagination
  query_sort := query_sort || ' LIMIT ' || p_limit || ' OFFSET ' || p_offset;
  
  -- Build the final query
  query_total := query_union || query_sort;
  
  -- Execute the query with dynamic parameters
  IF param_idx > 1 THEN
    RETURN QUERY EXECUTE query_total USING params[1:param_idx-1];
  ELSE
    RETURN QUERY EXECUTE query_total;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get recommended deals for a user
CREATE OR REPLACE FUNCTION get_recommended_deals(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  company_name TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  views INTEGER,
  favorites_count INTEGER,
  deal_type TEXT,
  deal_details JSONB
) AS $$
DECLARE
  user_categories TEXT[];
BEGIN
  -- Get user's preferred categories based on favorites and views
  WITH user_activities AS (
    -- Brand deals that user has favorited
    SELECT bd.category, 2 AS weight
    FROM favorites f
    JOIN brand_deals bd ON f.deal_id = bd.id
    WHERE f.user_id = p_user_id AND f.deal_type = 'brand_deal'
    
    UNION ALL
    
    -- Discount deals that user has favorited
    SELECT dd.category, 2 AS weight
    FROM favorites f
    JOIN discount_deals dd ON f.deal_id = dd.id
    WHERE f.user_id = p_user_id AND f.deal_type = 'discount_deal'
    
    UNION ALL
    
    -- Brand deals that user has viewed (from purchase_history)
    SELECT bd.category, 1 AS weight
    FROM purchase_history ph
    JOIN brand_deals bd ON ph.deal_id = bd.id
    WHERE ph.user_id = p_user_id AND ph.deal_type = 'brand_deal'
    
    UNION ALL
    
    -- Discount deals that user has viewed (from purchase_history)
    SELECT dd.category, 1 AS weight
    FROM purchase_history ph
    JOIN discount_deals dd ON ph.deal_id = dd.id
    WHERE ph.user_id = p_user_id AND ph.deal_type = 'discount_deal'
  ),
  
  category_weights AS (
    SELECT category, SUM(weight) AS total_weight
    FROM user_activities
    GROUP BY category
    ORDER BY total_weight DESC
    LIMIT 3
  )
  
  SELECT array_agg(category) INTO user_categories FROM category_weights;
  
  -- If user has no preferred categories, show most popular deals
  IF user_categories IS NULL OR array_length(user_categories, 1) = 0 THEN
    RETURN QUERY (
      SELECT * FROM search_deals(
        p_sort_by := 'views',
        p_sort_order := 'desc',
        p_limit := p_limit
      )
    );
  ELSE
    -- Get deals matching user's preferred categories
    RETURN QUERY (
      SELECT * FROM search_deals(
        p_categories := user_categories,
        p_limit := p_limit
      )
    );
  END IF;
END;
$$ LANGUAGE plpgsql; 