#!/bin/bash
# Script to deploy all Edge Functions to Supabase

# Deploy the create-checkout-session function
echo "Deploying create-checkout-session function..."
supabase functions deploy create-checkout-session

# Deploy the webhook function
echo "Deploying webhook function..."
supabase functions deploy webhook

# Deploy the customer-portal function
echo "Deploying customer-portal function..."
supabase functions deploy customer-portal

echo "All Edge Functions deployed successfully!" 