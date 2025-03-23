-- Function to manage subscription activations and credit allocations
CREATE OR REPLACE FUNCTION manage_subscription(
  p_user_id UUID,
  p_stripe_subscription_id TEXT,
  p_payment_plan_id UUID,
  p_status TEXT,
  p_current_period_start TIMESTAMP WITH TIME ZONE,
  p_current_period_end TIMESTAMP WITH TIME ZONE
)
RETURNS UUID AS $$
DECLARE
  v_subscription_id UUID;
  v_payment_plan payment_plans%ROWTYPE;
  v_existing_subscription subscriptions%ROWTYPE;
  v_credits_to_allocate INTEGER;
BEGIN
  -- Get payment plan details
  SELECT * INTO v_payment_plan FROM payment_plans WHERE id = p_payment_plan_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment plan with ID % not found', p_payment_plan_id;
  END IF;
  
  -- Check if subscription already exists
  SELECT * INTO v_existing_subscription 
  FROM subscriptions 
  WHERE user_id = p_user_id AND stripe_subscription_id = p_stripe_subscription_id;
  
  IF FOUND THEN
    -- Update existing subscription
    UPDATE subscriptions
    SET 
      payment_plan_id = p_payment_plan_id,
      status = p_status,
      current_period_start = p_current_period_start,
      current_period_end = p_current_period_end,
      updated_at = NOW()
    WHERE id = v_existing_subscription.id
    RETURNING id INTO v_subscription_id;
    
    -- If status changed from inactive to active, allocate credits
    IF v_existing_subscription.status <> 'active' AND p_status = 'active' THEN
      v_credits_to_allocate := v_payment_plan.credits_per_cycle;
    ELSE
      v_credits_to_allocate := 0;
    END IF;
  ELSE
    -- Create new subscription
    INSERT INTO subscriptions (
      user_id,
      payment_plan_id,
      stripe_subscription_id,
      status,
      current_period_start,
      current_period_end
    ) VALUES (
      p_user_id,
      p_payment_plan_id,
      p_stripe_subscription_id,
      p_status,
      p_current_period_start,
      p_current_period_end
    )
    RETURNING id INTO v_subscription_id;
    
    -- Allocate credits for new active subscription
    IF p_status = 'active' THEN
      v_credits_to_allocate := v_payment_plan.credits_per_cycle;
    ELSE
      v_credits_to_allocate := 0;
    END IF;
  END IF;
  
  -- Allocate credits if needed
  IF v_credits_to_allocate > 0 THEN
    -- Check if user already has credits
    DECLARE
      v_existing_credits user_credits%ROWTYPE;
    BEGIN
      SELECT * INTO v_existing_credits FROM user_credits WHERE user_id = p_user_id;
      
      IF FOUND THEN
        -- Update existing credits
        UPDATE user_credits
        SET 
          credits_remaining = credits_remaining + v_credits_to_allocate,
          total_credits_received = total_credits_received + v_credits_to_allocate,
          updated_at = NOW()
        WHERE user_id = p_user_id;
      ELSE
        -- Create new credits record
        INSERT INTO user_credits (
          user_id,
          credits_remaining,
          credits_used,
          total_credits_received
        ) VALUES (
          p_user_id,
          v_credits_to_allocate,
          0,
          v_credits_to_allocate
        );
      END IF;
      
      -- Record credit allocation in purchase history
      INSERT INTO purchase_history (
        user_id,
        subscription_id,
        amount,
        status,
        metadata
      ) VALUES (
        p_user_id,
        v_subscription_id,
        0, -- No direct charge, subscription based
        'completed',
        jsonb_build_object(
          'event', 'credit_allocation',
          'credits_added', v_credits_to_allocate,
          'payment_plan', v_payment_plan.name,
          'stripe_subscription_id', p_stripe_subscription_id
        )
      );
    END;
  END IF;
  
  -- Update user profile type based on subscription
  UPDATE user_profiles
  SET 
    user_type = CASE 
      WHEN v_payment_plan.plan_type = 'creator' THEN 'creator'
      WHEN v_payment_plan.plan_type = 'brand' THEN 'brand'
      ELSE user_type -- Keep existing type if plan type doesn't match
    END,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN v_subscription_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- Function to cancel a subscription
CREATE OR REPLACE FUNCTION cancel_subscription(
  p_user_id UUID,
  p_stripe_subscription_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription subscriptions%ROWTYPE;
BEGIN
  -- Find the subscription
  SELECT * INTO v_subscription 
  FROM subscriptions 
  WHERE user_id = p_user_id AND stripe_subscription_id = p_stripe_subscription_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription with ID % not found for user %', p_stripe_subscription_id, p_user_id;
  END IF;
  
  -- Update subscription status
  UPDATE subscriptions
  SET 
    status = 'canceled',
    updated_at = NOW()
  WHERE id = v_subscription.id;
  
  -- Record cancellation in purchase history
  INSERT INTO purchase_history (
    user_id,
    subscription_id,
    amount,
    status,
    metadata
  ) VALUES (
    p_user_id,
    v_subscription.id,
    0, -- No charge for cancellation
    'completed',
    jsonb_build_object(
      'event', 'subscription_canceled',
      'stripe_subscription_id', p_stripe_subscription_id
    )
  );
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- Function to renew subscription and allocate credits for a new billing cycle
CREATE OR REPLACE FUNCTION renew_subscription(
  p_stripe_subscription_id TEXT,
  p_current_period_start TIMESTAMP WITH TIME ZONE,
  p_current_period_end TIMESTAMP WITH TIME ZONE
)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription subscriptions%ROWTYPE;
  v_payment_plan payment_plans%ROWTYPE;
BEGIN
  -- Find the subscription
  SELECT * INTO v_subscription 
  FROM subscriptions 
  WHERE stripe_subscription_id = p_stripe_subscription_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription with ID % not found', p_stripe_subscription_id;
  END IF;
  
  -- Get payment plan details
  SELECT * INTO v_payment_plan FROM payment_plans WHERE id = v_subscription.payment_plan_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment plan with ID % not found', v_subscription.payment_plan_id;
  END IF;
  
  -- Update subscription period
  UPDATE subscriptions
  SET 
    current_period_start = p_current_period_start,
    current_period_end = p_current_period_end,
    updated_at = NOW()
  WHERE id = v_subscription.id;
  
  -- Allocate credits for the new billing cycle
  UPDATE user_credits
  SET 
    credits_remaining = credits_remaining + v_payment_plan.credits_per_cycle,
    total_credits_received = total_credits_received + v_payment_plan.credits_per_cycle,
    updated_at = NOW()
  WHERE user_id = v_subscription.user_id;
  
  -- Record renewal in purchase history
  INSERT INTO purchase_history (
    user_id,
    subscription_id,
    amount,
    status,
    metadata
  ) VALUES (
    v_subscription.user_id,
    v_subscription.id,
    0, -- No direct charge, subscription based
    'completed',
    jsonb_build_object(
      'event', 'subscription_renewed',
      'credits_added', v_payment_plan.credits_per_cycle,
      'stripe_subscription_id', p_stripe_subscription_id,
      'period_start', p_current_period_start,
      'period_end', p_current_period_end
    )
  );
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- Function to get user subscription details
CREATE OR REPLACE FUNCTION get_user_subscription_details(
  p_user_id UUID
)
RETURNS TABLE (
  subscription_id UUID,
  payment_plan_id UUID,
  payment_plan_name TEXT,
  payment_plan_type TEXT,
  payment_plan_price NUMERIC,
  payment_plan_credits INTEGER,
  stripe_subscription_id TEXT,
  status TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  credits_remaining INTEGER,
  credits_used INTEGER,
  total_credits_received INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id AS subscription_id,
    s.payment_plan_id,
    pp.name AS payment_plan_name,
    pp.plan_type AS payment_plan_type,
    pp.price AS payment_plan_price,
    pp.credits_per_cycle AS payment_plan_credits,
    s.stripe_subscription_id,
    s.status,
    s.current_period_start,
    s.current_period_end,
    s.created_at,
    uc.credits_remaining,
    uc.credits_used,
    uc.total_credits_received
  FROM subscriptions s
  JOIN payment_plans pp ON s.payment_plan_id = pp.id
  LEFT JOIN user_credits uc ON s.user_id = uc.user_id
  WHERE s.user_id = p_user_id
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql; 