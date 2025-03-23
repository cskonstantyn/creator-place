-- Create a function to approve deal submissions
CREATE OR REPLACE FUNCTION approve_deal_submission(
  p_submission_id UUID,
  p_admin_feedback TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  submission deal_submissions%ROWTYPE;
  new_deal_id UUID;
BEGIN
  -- Get the submission
  SELECT * INTO submission
  FROM deal_submissions
  WHERE id = p_submission_id
  FOR UPDATE;
  
  -- Check if submission exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission with ID % not found', p_submission_id;
  END IF;
  
  -- Check if submission is in a state that can be approved
  IF submission.status != 'pending' THEN
    RAISE EXCEPTION 'Submission with ID % is not in pending state', p_submission_id;
  END IF;
  
  -- Process based on deal type
  IF submission.deal_type = 'brand_deal' THEN
    -- Insert into brand_deals table
    INSERT INTO brand_deals (
      title,
      description,
      company_name,
      requirements,
      compensation,
      application_url,
      contact_email,
      category
    )
    VALUES (
      submission.submission_data->>'title',
      submission.submission_data->>'description',
      submission.submission_data->>'company_name',
      submission.submission_data->>'requirements',
      submission.submission_data->>'compensation',
      submission.submission_data->>'application_url',
      submission.submission_data->>'contact_email',
      submission.submission_data->>'category'
    )
    RETURNING id INTO new_deal_id;
    
  ELSIF submission.deal_type = 'discount_deal' THEN
    -- Insert into discount_deals table
    INSERT INTO discount_deals (
      title,
      description,
      company_name,
      discount_code,
      discount_percentage,
      discount_flat_amount,
      expiry_date,
      terms_conditions,
      product_url,
      category
    )
    VALUES (
      submission.submission_data->>'title',
      submission.submission_data->>'description',
      submission.submission_data->>'company_name',
      submission.submission_data->>'discount_code',
      (submission.submission_data->>'discount_percentage')::INTEGER,
      (CASE WHEN submission.submission_data->>'discount_flat_amount' IS NOT NULL 
          THEN (submission.submission_data->>'discount_flat_amount')::NUMERIC 
          ELSE NULL END),
      (CASE WHEN submission.submission_data->>'expiry_date' IS NOT NULL 
          THEN (submission.submission_data->>'expiry_date')::TIMESTAMP WITH TIME ZONE 
          ELSE NULL END),
      submission.submission_data->>'terms_conditions',
      submission.submission_data->>'product_url',
      submission.submission_data->>'category'
    )
    RETURNING id INTO new_deal_id;
    
  ELSE
    RAISE EXCEPTION 'Unknown deal type: %', submission.deal_type;
  END IF;
  
  -- Update the submission
  UPDATE deal_submissions
  SET 
    status = 'approved',
    deal_id = new_deal_id,
    admin_feedback = p_admin_feedback,
    updated_at = NOW()
  WHERE id = p_submission_id;
  
  -- Record in purchase history
  INSERT INTO purchase_history (
    user_id,
    deal_id,
    deal_type,
    amount,
    status,
    metadata
  ) VALUES (
    submission.user_id,
    new_deal_id,
    submission.deal_type,
    0, -- No direct charge for submission
    'completed',
    jsonb_build_object(
      'submission_id', submission.id,
      'credits_used', submission.credits_used
    )
  );
  
  RETURN new_deal_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- Create a function to reject deal submissions
CREATE OR REPLACE FUNCTION reject_deal_submission(
  p_submission_id UUID,
  p_admin_feedback TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  submission deal_submissions%ROWTYPE;
BEGIN
  -- Get the submission
  SELECT * INTO submission
  FROM deal_submissions
  WHERE id = p_submission_id
  FOR UPDATE;
  
  -- Check if submission exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission with ID % not found', p_submission_id;
  END IF;
  
  -- Check if submission is in a state that can be rejected
  IF submission.status != 'pending' THEN
    RAISE EXCEPTION 'Submission with ID % is not in pending state', p_submission_id;
  END IF;
  
  -- Update the submission
  UPDATE deal_submissions
  SET 
    status = 'rejected',
    admin_feedback = p_admin_feedback,
    updated_at = NOW()
  WHERE id = p_submission_id;
  
  -- Refund the credits to the user
  UPDATE user_credits
  SET 
    credits_remaining = credits_remaining + submission.credits_used,
    credits_used = credits_used - submission.credits_used,
    updated_at = NOW()
  WHERE user_id = submission.user_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update a deal's view count
CREATE OR REPLACE FUNCTION increment_deal_views(
  p_deal_id UUID,
  p_deal_type TEXT
)
RETURNS INTEGER AS $$
DECLARE
  current_views INTEGER;
BEGIN
  IF p_deal_type = 'brand_deal' THEN
    UPDATE brand_deals
    SET views = views + 1
    WHERE id = p_deal_id
    RETURNING views INTO current_views;
  ELSIF p_deal_type = 'discount_deal' THEN
    UPDATE discount_deals
    SET views = views + 1
    WHERE id = p_deal_id
    RETURNING views INTO current_views;
  ELSE
    RAISE EXCEPTION 'Unknown deal type: %', p_deal_type;
  END IF;
  
  RETURN current_views;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql; 