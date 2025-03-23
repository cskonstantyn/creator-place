// This script checks the Supabase connection and verifies if tables exist
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file for:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('Supabase environment variables found:');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}\n`);

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseKey);

// List of tables to check
const TABLES_TO_CHECK = [
  'payment_plans',
  'payment_intents',
  'user_subscriptions',
  'user_credits',
  'brand_deals',
  'discount_deals',
  'favorites'
];

// Function to check if table exists and count rows
async function checkTable(tableName) {
  try {
    // First, check if the table exists by querying for a single row
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') { // PostgreSQL error code for undefined_table
        console.log(`❌ Table '${tableName}' does not exist`);
        return {
          exists: false,
          count: 0
        };
      } else {
        console.log(`❌ Error checking table '${tableName}': ${error.message}`);
        return {
          exists: false,
          error: error.message
        };
      }
    }
    
    // If we got here, the table exists. Now get the row count
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log(`⚠️ Table '${tableName}' exists but error counting rows: ${countError.message}`);
      return {
        exists: true,
        count: 'Unknown'
      };
    }
    
    return {
      exists: true,
      count: count
    };
  } catch (err) {
    console.log(`❌ Unexpected error checking table '${tableName}': ${err.message}`);
    return {
      exists: false,
      error: err.message
    };
  }
}

// Check auth system
async function checkAuth() {
  try {
    // Try to get the current user to test auth
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('❌ Auth system check failed:', error.message);
      return false;
    }
    
    console.log('✅ Auth system is working');
    return true;
  } catch (err) {
    console.log('❌ Unexpected error checking auth system:', err.message);
    return false;
  }
}

// Main function to run the checks
async function main() {
  console.log('Checking Supabase connection and configuration...\n');
  
  // Check connection
  try {
    const { data, error } = await supabase.rpc('get_service_role');
    
    if (error) {
      console.log('❌ Connection to Supabase failed:');
      console.log(error.message);
      
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        console.log('\nThe function "get_service_role" doesn\'t exist in your Supabase instance.');
        console.log('This is normal for new projects. Let\'s try to check tables directly.\n');
      } else {
        console.log('\nPlease check your Supabase URL and service role key.');
        console.log('If those are correct, make sure your IP is allowed in Supabase.\n');
      }
    } else {
      console.log('✅ Successfully connected to Supabase\n');
    }
    
    // Check auth system
    await checkAuth();
    
    console.log('\nChecking tables...\n');
    
    // Check all tables
    let tableResults = {};
    for (const table of TABLES_TO_CHECK) {
      tableResults[table] = await checkTable(table);
      
      if (tableResults[table].exists) {
        console.log(`✅ Table '${table}' exists with ${tableResults[table].count} rows`);
      }
    }
    
    // Summary
    console.log('\n📊 Database Status Summary:');
    console.log('-------------------------');
    const existingTables = TABLES_TO_CHECK.filter(table => tableResults[table].exists);
    const missingTables = TABLES_TO_CHECK.filter(table => !tableResults[table].exists);
    
    console.log(`Existing tables: ${existingTables.length}/${TABLES_TO_CHECK.length}`);
    if (missingTables.length > 0) {
      console.log(`Missing tables: ${missingTables.join(', ')}`);
      console.log('\nTo create missing tables, run: node scripts/setup-supabase.js');
    } else if (existingTables.length === TABLES_TO_CHECK.length) {
      console.log('✅ All required tables exist');
    }
    
    // Check for empty tables
    const emptyTables = existingTables.filter(table => tableResults[table].count === 0);
    if (emptyTables.length > 0) {
      console.log(`\nEmpty tables: ${emptyTables.join(', ')}`);
      console.log('You might want to insert sample data by running: node scripts/setup-supabase.js');
    }
    
  } catch (err) {
    console.error('Unexpected error during checks:', err);
  }
}

// Run the main function
main(); 