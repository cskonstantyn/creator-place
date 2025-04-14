#!/bin/bash
# Script to deploy the create-checkout-session Edge Function to Supabase

# Deploy the create-checkout-session function
echo "Deploying create-checkout-session function..."
supabase functions deploy create-checkout-session

echo "Edge Function deployed successfully!" 