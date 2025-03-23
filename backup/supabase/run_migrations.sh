#!/bin/bash

# Run Migrations Script for CreatorDeals Supabase
echo "Running CreatorDeals database migrations..."

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

# Check if Supabase is running
check_supabase_running

# Create a temporary directory for concatenated migrations
TEMP_DIR=$(mktemp -d)
COMBINED_SQL="$TEMP_DIR/combined_migrations.sql"

echo "Creating combined migrations file..."
# Get all migration files in order and concatenate them
for file in $(ls -v supabase/migrations/*.sql); do
  echo "-- Including migration: $(basename "$file")" >> "$COMBINED_SQL"
  cat "$file" >> "$COMBINED_SQL"
  echo "" >> "$COMBINED_SQL"
  echo "" >> "$COMBINED_SQL"
done

# Reset the database first
echo "Resetting the database..."
supabase db reset

# Apply the combined migrations
echo "Applying migrations..."
supabase db reset --apply-migrations=false
cat "$COMBINED_SQL" | PGPASSWORD=postgres psql --host=127.0.0.1 --port=54322 --username=postgres --dbname=postgres

# Check if the migrations were successful
if [ $? -eq 0 ]; then
  echo "✅ All migrations completed successfully!"
else
  echo "❌ Migrations failed"
  exit 1
fi

# Clean up
rm -rf "$TEMP_DIR"

echo "All migrations completed successfully!"
echo "You can now access the Supabase Studio at: http://127.0.0.1:54323" 