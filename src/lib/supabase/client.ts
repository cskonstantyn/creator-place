import { createClient } from '@supabase/supabase-js';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { supabase as integrationSupabase } from '../../integrations/supabase/client';

// Check if mock data should be used
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Re-export the Supabase client from integrations to avoid duplication
export const supabase = integrationSupabase;

// Check if a table exists in the Supabase database
export async function tableExists(tableName: string): Promise<boolean> {
  // In mock mode, just return false (table doesn't exist)
  if (useMockData) {
    console.log(`[Mock] Checking if table ${tableName} exists: false`);
    return false;
  }
  
  try {
    // Query the information_schema to check if the table exists
    const { count, error } = await supabase
      .from('information_schema.tables')
      .select('table_name', { count: 'exact', head: true })
      .eq('table_schema', 'public')
      .eq('table_name', tableName);
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

// Generic function to handle database queries with fallback to mock data
export async function queryWithFallback<T>(
  tableName: string,
  queryFn: () => PostgrestFilterBuilder<any, any, unknown[], string, T>,
  mockData: T
): Promise<T> {
  // Check if mock data should be used
  if (useMockData) {
    console.log(`Using mock data for ${tableName}`);
    return mockData;
  }
  
  // Check if the table exists
  const exists = await tableExists(tableName);
  
  if (!exists) {
    console.log(`Table ${tableName} does not exist, using mock data`);
    return mockData;
  }
  
  try {
    // Execute the query
    const { data, error } = await queryFn();
    
    if (error) {
      console.error(`Error querying ${tableName}:`, error);
      return mockData;
    }
    
    if (!data) {
      console.log(`No data found in ${tableName}, using mock data`);
      return mockData;
    }
    
    return data as unknown as T;
  } catch (error) {
    console.error(`Error querying ${tableName}:`, error);
    return mockData;
  }
} 