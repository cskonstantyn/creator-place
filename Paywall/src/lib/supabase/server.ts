import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client for server-side usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwbHB6dXp3aHNzaHN4Y2JpcXRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4Njg4Mjc1OCwiZXhwIjoyMDAyNDU4NzU4fQ.X6DWD7AuUTiVb9SNpQMhbJgNPxy2gfkOyz3_aLOXGuI';

export const serverSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
}); 