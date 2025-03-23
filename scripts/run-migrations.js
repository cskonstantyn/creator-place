#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

// Create Supabase client - use the correct environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Show all available env variables containing the word 'SUPABASE' for debugging
console.log('Available Supabase environment variables:');
Object.keys(process.env)
  .filter(key => key.includes('SUPABASE'))
  .forEach(key => console.log(`${key}: ${key.includes('KEY') ? '***' : process.env[key]}`));

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set');
  console.error('Current environment variables:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));
  process.exit(1);
}

console.log('Using Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

// Execute raw SQL
async function executeSQL(sql) {
  try {
    // Newer Supabase client doesn't have query method
    // Use fetch directly with the REST endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'X-Client-Info': 'migration-script',
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: sql,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SQL query failed: ${errorText}`);
    }

    return { error: null };
  } catch (error) {
    console.error('SQL execution error:', error);
    return { error };
  }
}

async function createMigrationsTable() {
  try {
    console.log('Creating _migrations table if it doesn\'t exist...');
    
    // First, see if the table already exists
    const { data, error } = await supabase
      .from('_migrations')
      .select('id')
      .limit(1);
    
    if (!error) {
      console.log('Migrations table already exists');
      return true;
    }
    
    // If table doesn't exist, create it
    console.log('Need to create migrations table');
    
    // Try to create the table using executeSQL
    const result = await executeSQL(`
      CREATE TABLE IF NOT EXISTS public._migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (result.error) {
      console.error('Error creating migrations table:', result.error);
      return false;
    }
    
    console.log('Created migrations table successfully');
    return true;
  } catch (error) {
    console.error('Error creating migrations table:', error);
    return false;
  }
}

async function checkIfMigrationExecuted(migrationName) {
  try {
    const { data, error } = await supabase
      .from('_migrations')
      .select('id')
      .eq('name', migrationName)
      .limit(1);
    
    if (error) {
      console.error(`Error checking if migration ${migrationName} was executed:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking migration status:`, error);
    return false;
  }
}

async function runMigrations() {
  console.log('Starting database migrations...');
  
  try {
    // Create migrations table
    const migrationsTableCreated = await createMigrationsTable();
    
    if (!migrationsTableCreated) {
      console.error('Failed to create migrations table, exiting...');
      process.exit(1);
    }
    
    // Get list of migration files
    const migrationFiles = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure they run in alphabetical order
    
    console.log(`Found ${migrationFiles.length} migration files:`, migrationFiles);
    
    // Run migrations that haven't been executed yet
    for (const migrationFile of migrationFiles) {
      const migrationExecuted = await checkIfMigrationExecuted(migrationFile);
      
      if (migrationExecuted) {
        console.log(`Migration ${migrationFile} already executed, skipping...`);
        continue;
      }
      
      console.log(`Running migration: ${migrationFile}`);
      
      const migrationSql = fs.readFileSync(path.join(MIGRATIONS_DIR, migrationFile), 'utf8');
      
      // Run the migration SQL
      const result = await executeSQL(migrationSql);
      
      if (result.error) {
        console.error(`Error executing migration ${migrationFile}:`, result.error);
        process.exit(1);
      }
      
      // Mark the migration as executed
      const { error: insertError } = await supabase
        .from('_migrations')
        .insert({ name: migrationFile });
      
      if (insertError) {
        console.error(`Error recording migration ${migrationFile}:`, insertError);
        process.exit(1);
      }
      
      console.log(`Successfully executed migration: ${migrationFile}`);
    }
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Unexpected error during migrations:', error);
    process.exit(1);
  }
}

runMigrations().catch(error => {
  console.error('Migration process failed:', error);
  process.exit(1);
}); 