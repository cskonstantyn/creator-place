#!/bin/bash

# Script to run all test scripts in sequence
echo "Running all CreatorDeals database test scripts..."

# Function to check if Supabase is running
check_supabase_running() {
  local status=$(supabase status 2>&1)
  if [[ $status == *"not running"* ]]; then
    echo "Supabase is not running. Starting Supabase..."
    supabase start
    echo "Waiting for Supabase to initialize..."
    sleep 10
  else
    echo "Supabase is already running."
  fi
}

# Function to run a SQL test script
run_test_script() {
  local test_script=$1
  local file_name=$(basename "$test_script")
  
  echo "----------------------------------------------"
  echo "Running test script: $file_name"
  echo "----------------------------------------------"
  
  PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f "$test_script"
  
  if [ $? -eq 0 ]; then
    echo "✅ Test script $file_name completed."
  else
    echo "❌ Test script $file_name failed."
    exit 1
  fi
  
  echo ""
}

# Check if Supabase is running
check_supabase_running

# Reset the database to ensure a clean state
echo "Resetting the database to ensure a clean state..."
supabase db reset

# Run migrations first
echo "Running migrations before tests..."
../run_migrations.sh

# Get all test scripts except this one
test_scripts=($(ls -v supabase/test_scripts/*.sql))

# Run each test script
echo "Found ${#test_scripts[@]} test scripts"
for test_script in "${test_scripts[@]}"; do
  run_test_script "$test_script"
done

echo "All test scripts completed successfully!" 