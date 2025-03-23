#!/bin/bash

# Run tests for the CreatorDeals application
echo "Running CreatorDeals database tests..."

# Check if Supabase is running
supabase status >/dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Error: Supabase is not running. Please start it with 'supabase start'."
  exit 1
fi

# Directory where test scripts are stored
TEST_DIR="$(dirname "$0")"
PSQL_CONN="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Check if we can connect to the database
echo "Checking database connection..."
psql $PSQL_CONN -c "SELECT NOW();" >/dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Error: Cannot connect to database. Please check if Supabase is running correctly."
  exit 1
fi

# Function to run a test script
run_test_script() {
  local script=$1
  echo "-----------------------------------------------------------"
  echo "Running test: $(basename $script)"
  echo "-----------------------------------------------------------"
  
  # Run the script, capturing output but still displaying it
  output=$(psql $PSQL_CONN -f "$script" 2>&1)
  result=$?
  
  echo "$output"
  
  # Check for errors
  if [ $result -ne 0 ]; then
    echo "❌ Test failed: $(basename $script)"
    return 1
  else
    if echo "$output" | grep -q "ERROR"; then
      echo "❌ Test had errors: $(basename $script)"
      return 1
    else
      echo "✅ Test passed: $(basename $script)"
      return 0
    fi
  fi
}

# Reset any test environment settings
echo "Resetting test environment..."
psql $PSQL_CONN -c "DO \$\$ BEGIN PERFORM toggle_environment(); END \$\$;" >/dev/null 2>&1

# Run toggle_environment test first to ensure environment functionality
if [ -f "$TEST_DIR/test_toggle_environment.sql" ]; then
  run_test_script "$TEST_DIR/test_toggle_environment.sql"
  if [ $? -ne 0 ]; then
    echo "❌ Environment toggle test failed. Aborting further tests."
    exit 1
  fi
fi

# Define core test scripts to run in order
TEST_SCRIPTS=(
  "test_deal_workflow.sql"
  "test_subscription_workflow.sql"
  "test_user_credit_workflow.sql"
)

# Run the core test scripts
failures=0
for script in "${TEST_SCRIPTS[@]}"; do
  if [ -f "$TEST_DIR/$script" ]; then
    run_test_script "$TEST_DIR/$script"
    if [ $? -ne 0 ]; then
      ((failures++))
    fi
  else
    echo "⚠️ Test script not found: $script"
    ((failures++))
  fi
done

# Run any additional test scripts found in the directory
for script in "$TEST_DIR"/*.sql; do
  # Skip files that were already run
  if [[ ! " ${TEST_SCRIPTS[@]} " =~ " $(basename $script) " && $(basename $script) != "test_toggle_environment.sql" ]]; then
    run_test_script "$script"
    if [ $? -ne 0 ]; then
      ((failures++))
    fi
  fi
done

# Report results
echo "-----------------------------------------------------------"
if [ $failures -eq 0 ]; then
  echo "🎉 All tests passed successfully!"
else
  echo "⚠️ $failures test(s) failed."
fi
echo "-----------------------------------------------------------"

exit $failures 