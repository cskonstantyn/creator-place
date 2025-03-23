// This script sets up the Supabase database with the necessary tables and initial data

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key (for admin operations)
const supabase = createClient(supabaseUrl, supabaseKey);

// Run SQL from file
async function runSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    console.log(`Running SQL from ${filePath}...`);
    const { error } = await supabase.rpc('pgbouncer_exec', { query: sql });
    if (error) throw error;
    console.log(`Successfully executed SQL from ${filePath}`);
  } catch (error) {
    console.error(`Error running SQL file ${filePath}:`, error);
    throw error;
  }
}

// Create brand_deals table
async function createBrandDealsTable() {
  try {
    console.log('Creating brand_deals table...');
    const { error } = await supabase.rpc('pgbouncer_exec', {
      query: `
        CREATE TABLE IF NOT EXISTS public.brand_deals (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          user_id UUID REFERENCES auth.users(id),
          category VARCHAR(100) NOT NULL,
          brand_name VARCHAR(255) NOT NULL,
          platform VARCHAR(100),
          price DECIMAL(10, 2),
          deal_value VARCHAR(255),
          location VARCHAR(255),
          image_url TEXT,
          image_urls TEXT[] DEFAULT '{}',
          requirements TEXT,
          is_featured BOOLEAN DEFAULT FALSE,
          views INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create index for common queries
        CREATE INDEX IF NOT EXISTS idx_brand_deals_category ON public.brand_deals(category);
        CREATE INDEX IF NOT EXISTS idx_brand_deals_user_id ON public.brand_deals(user_id);

        -- Create function to update the updated_at timestamp
        CREATE OR REPLACE FUNCTION update_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create trigger to automatically update the updated_at timestamp
        DROP TRIGGER IF EXISTS set_brand_deals_updated_at ON public.brand_deals;
        CREATE TRIGGER set_brand_deals_updated_at
        BEFORE UPDATE ON public.brand_deals
        FOR EACH ROW
        EXECUTE FUNCTION update_modified_column();
      `
    });

    if (error) throw error;
    console.log('Successfully created brand_deals table');
  } catch (error) {
    console.error('Error creating brand_deals table:', error);
    throw error;
  }
}

// Create discount_deals table
async function createDiscountDealsTable() {
  try {
    console.log('Creating discount_deals table...');
    const { error } = await supabase.rpc('pgbouncer_exec', {
      query: `
        CREATE TABLE IF NOT EXISTS public.discount_deals (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          user_id UUID REFERENCES auth.users(id),
          store_name VARCHAR(255) NOT NULL,
          discount_percentage INTEGER NOT NULL,
          original_price DECIMAL(10, 2) NOT NULL,
          discounted_price DECIMAL(10, 2) NOT NULL,
          coupon_code VARCHAR(100),
          items_sold INTEGER DEFAULT 0,
          usage_limit INTEGER,
          location VARCHAR(255),
          tags TEXT[] DEFAULT '{}',
          image_url TEXT,
          image_urls TEXT[] DEFAULT '{}',
          campaign_period_start TIMESTAMP WITH TIME ZONE,
          campaign_period_end TIMESTAMP WITH TIME ZONE,
          is_featured BOOLEAN DEFAULT FALSE,
          views INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for common queries
        CREATE INDEX IF NOT EXISTS idx_discount_deals_store_name ON public.discount_deals(store_name);
        CREATE INDEX IF NOT EXISTS idx_discount_deals_user_id ON public.discount_deals(user_id);

        -- Create trigger to automatically update the updated_at timestamp
        DROP TRIGGER IF EXISTS set_discount_deals_updated_at ON public.discount_deals;
        CREATE TRIGGER set_discount_deals_updated_at
        BEFORE UPDATE ON public.discount_deals
        FOR EACH ROW
        EXECUTE FUNCTION update_modified_column();
      `
    });

    if (error) throw error;
    console.log('Successfully created discount_deals table');
  } catch (error) {
    console.error('Error creating discount_deals table:', error);
    throw error;
  }
}

// Create favorites table
async function createFavoritesTable() {
  try {
    console.log('Creating favorites table...');
    const { error } = await supabase.rpc('pgbouncer_exec', {
      query: `
        CREATE TABLE IF NOT EXISTS public.favorites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id),
          item_id UUID NOT NULL,
          item_type VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create unique index to prevent duplicate favorites
        CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_unique ON public.favorites(user_id, item_id, item_type);
        -- Create index for retrieving user favorites
        CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
      `
    });

    if (error) throw error;
    console.log('Successfully created favorites table');
  } catch (error) {
    console.error('Error creating favorites table:', error);
    throw error;
  }
}

// Set up RLS (Row Level Security) policies
async function setupRLS() {
  try {
    console.log('Setting up RLS policies...');
    const { error } = await supabase.rpc('pgbouncer_exec', {
      query: `
        -- Enable RLS on tables
        ALTER TABLE IF EXISTS public.brand_deals ENABLE ROW LEVEL SECURITY;
        ALTER TABLE IF EXISTS public.discount_deals ENABLE ROW LEVEL SECURITY;
        ALTER TABLE IF EXISTS public.favorites ENABLE ROW LEVEL SECURITY;
        ALTER TABLE IF EXISTS public.payment_plans ENABLE ROW LEVEL SECURITY;
        
        -- Brand deals policies
        DROP POLICY IF EXISTS "Anyone can read brand deals" ON public.brand_deals;
        CREATE POLICY "Anyone can read brand deals"
          ON public.brand_deals
          FOR SELECT
          USING (true);
          
        DROP POLICY IF EXISTS "Users can insert their own brand deals" ON public.brand_deals;
        CREATE POLICY "Users can insert their own brand deals"
          ON public.brand_deals
          FOR INSERT
          WITH CHECK (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Users can update their own brand deals" ON public.brand_deals;
        CREATE POLICY "Users can update their own brand deals"
          ON public.brand_deals
          FOR UPDATE
          USING (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Users can delete their own brand deals" ON public.brand_deals;
        CREATE POLICY "Users can delete their own brand deals"
          ON public.brand_deals
          FOR DELETE
          USING (auth.uid() = user_id);
          
        -- Discount deals policies
        DROP POLICY IF EXISTS "Anyone can read discount deals" ON public.discount_deals;
        CREATE POLICY "Anyone can read discount deals"
          ON public.discount_deals
          FOR SELECT
          USING (true);
          
        DROP POLICY IF EXISTS "Users can insert their own discount deals" ON public.discount_deals;
        CREATE POLICY "Users can insert their own discount deals"
          ON public.discount_deals
          FOR INSERT
          WITH CHECK (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Users can update their own discount deals" ON public.discount_deals;
        CREATE POLICY "Users can update their own discount deals"
          ON public.discount_deals
          FOR UPDATE
          USING (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Users can delete their own discount deals" ON public.discount_deals;
        CREATE POLICY "Users can delete their own discount deals"
          ON public.discount_deals
          FOR DELETE
          USING (auth.uid() = user_id);
          
        -- Favorites policies
        DROP POLICY IF EXISTS "Users can read their own favorites" ON public.favorites;
        CREATE POLICY "Users can read their own favorites"
          ON public.favorites
          FOR SELECT
          USING (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
        CREATE POLICY "Users can insert their own favorites"
          ON public.favorites
          FOR INSERT
          WITH CHECK (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
        CREATE POLICY "Users can delete their own favorites"
          ON public.favorites
          FOR DELETE
          USING (auth.uid() = user_id);
          
        -- Payment plans policies
        DROP POLICY IF EXISTS "Anyone can read payment plans" ON public.payment_plans;
        CREATE POLICY "Anyone can read payment plans"
          ON public.payment_plans
          FOR SELECT
          USING (true);
      `
    });

    if (error) throw error;
    console.log('Successfully set up RLS policies');
  } catch (error) {
    console.error('Error setting up RLS policies:', error);
    throw error;
  }
}

// Insert sample data for testing
async function insertSampleData() {
  try {
    console.log('Inserting sample data...');
    
    // Insert sample brand deals
    const { error: brandDealsError } = await supabase
      .from('brand_deals')
      .upsert([
        {
          title: 'Instagram Promotion for New Athletic Shoe Line',
          description: 'Looking for fitness influencers to promote our new line of athletic shoes. We need engaging content that showcases the shoes in action with authentic storytelling.',
          brand_name: 'FitStep Athletics',
          category: 'Fashion & Accessories',
          platform: 'Instagram',
          price: 500,
          deal_value: '$500 - $1,500 USD',
          location: 'United States',
          image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
          requirements: 'Minimum 10K followers. Must be in fitness, sports, or active lifestyle niche.',
          is_featured: true,
          views: 245
        },
        {
          title: 'YouTube Review of Premium Skincare Product',
          description: 'Seeking beauty influencers to create in-depth reviews of our new premium skincare line. We want honest feedback and demonstrations of the products in use.',
          brand_name: 'Lumina Beauty',
          category: 'Beauty & Cosmetics',
          platform: 'YouTube',
          price: 750,
          deal_value: '$750 - $2,000 USD',
          location: 'Canada',
          image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b',
          requirements: 'Minimum 20K subscribers. Must have experience with skincare reviews.',
          is_featured: false,
          views: 189
        }
      ]);
    
    if (brandDealsError) throw brandDealsError;
    
    // Insert sample discount deals
    const { error: discountDealsError } = await supabase
      .from('discount_deals')
      .upsert([
        {
          title: '50% Off Premium Website Hosting',
          description: 'Get 50% off our premium website hosting package for the first year. Includes unlimited storage, free domain, and 24/7 support.',
          store_name: 'CloudHost Pro',
          discount_percentage: 50,
          original_price: 199.99,
          discounted_price: 99.99,
          coupon_code: 'CREATOR50',
          items_sold: 47,
          usage_limit: 100,
          location: 'Global',
          tags: ['Web Hosting', 'Digital', 'Technology'],
          image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
          campaign_period_end: '2023-12-31T23:59:59Z',
          is_featured: true,
          views: 312
        },
        {
          title: '30% Off Professional Video Editing Software',
          description: 'Save 30% on our professional video editing software. Perfect for content creators looking to enhance their production quality.',
          store_name: 'EditMaster Software',
          discount_percentage: 30,
          original_price: 299.99,
          discounted_price: 209.99,
          coupon_code: 'CREATE30',
          items_sold: 78,
          usage_limit: 200,
          location: 'Global',
          tags: ['Software', 'Video Editing', 'Content Creation'],
          image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d',
          campaign_period_end: '2023-11-30T23:59:59Z',
          is_featured: false,
          views: 427
        }
      ]);
    
    if (discountDealsError) throw discountDealsError;
    
    console.log('Successfully inserted sample data');
  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
}

// Main function to run all setup tasks
async function main() {
  try {
    console.log('Starting Supabase database setup...');
    
    // Check connection
    const { data, error } = await supabase.from('payment_plans').select('id').limit(1);
    if (error) {
      console.log('Could not connect to Supabase or payment_plans table does not exist. Creating required tables...');
      
      // Run payment plans migration
      await runSqlFile(path.resolve(__dirname, '../migrations/create_payment_plans.sql'));
    } else {
      console.log('Successfully connected to Supabase and payment_plans table exists.');
    }
    
    // Create other tables
    await createBrandDealsTable();
    await createDiscountDealsTable();
    await createFavoritesTable();
    
    // Set up RLS
    await setupRLS();
    
    // Insert sample data if tables are empty
    const { count: brandDealsCount, error: countError } = await supabase
      .from('brand_deals')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking if brand_deals table has data:', countError);
    } else if (brandDealsCount === 0) {
      await insertSampleData();
    } else {
      console.log('Sample data already exists, skipping data insertion.');
    }
    
    console.log('Supabase database setup complete!');
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 