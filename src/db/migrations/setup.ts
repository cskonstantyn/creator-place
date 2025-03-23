import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('Running database migrations...');

  // Create payment_plans table
  const { error: plansError } = await supabase.rpc('create_payment_plans_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.payment_plans (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        duration_days INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        features JSONB,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Create RLS policy for payment_plans
      ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
      
      -- Allow anyone to read payment_plans
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'payment_plans' AND policyname = 'Anyone can read payment_plans'
        ) THEN
          CREATE POLICY "Anyone can read payment_plans"
            ON public.payment_plans
            FOR SELECT USING (true);
        END IF;
      END
      $$;
    `,
  });

  if (plansError) {
    console.error('Error creating payment_plans table:', plansError);
  } else {
    console.log('✅ payment_plans table created or already exists');
  }

  // Create payment_intents table
  const { error: intentsError } = await supabase.rpc('create_payment_intents_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.payment_intents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES auth.users(id),
        payment_plan_id UUID REFERENCES public.payment_plans(id),
        stripe_payment_intent_id VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        status VARCHAR(50) NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Create RLS policy for payment_intents
      ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
      
      -- Allow authenticated users to read their own payment_intents
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'payment_intents' AND policyname = 'Users can read their own payment_intents'
        ) THEN
          CREATE POLICY "Users can read their own payment_intents"
            ON public.payment_intents
            FOR SELECT USING (auth.uid() = user_id);
        END IF;
      END
      $$;
    `,
  });

  if (intentsError) {
    console.error('Error creating payment_intents table:', intentsError);
  } else {
    console.log('✅ payment_intents table created or already exists');
  }

  // Seed payment plans if table is empty
  const { data: existingPlans, error: countError } = await supabase
    .from('payment_plans')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error checking payment_plans:', countError);
  } else if (!existingPlans || existingPlans.length === 0) {
    // Insert seed data
    const { error: seedError } = await supabase.from('payment_plans').insert([
      // Brand deal plans
      {
        name: 'Basic Brand Deal',
        description: 'List your brand deal for 30 days with basic visibility',
        price: 49.99,
        currency: 'USD',
        duration_days: 30,
        type: 'brand-deal',
        features: ['30-day listing', 'Basic analytics', 'Email support'],
        is_featured: false,
      },
      {
        name: 'Premium Brand Deal',
        description: 'Enhanced visibility and longer listing for your brand deal',
        price: 99.99,
        currency: 'USD',
        duration_days: 60,
        type: 'brand-deal',
        features: ['60-day listing', 'Featured placement', 'Detailed analytics', 'Priority support'],
        is_featured: true,
      },
      // Discount deal plans
      {
        name: 'Basic Discount Code',
        description: 'List your discount code for 30 days with basic visibility',
        price: 29.99,
        currency: 'USD',
        duration_days: 30,
        type: 'discount-deal',
        features: ['30-day listing', 'Basic analytics', 'Email support'],
        is_featured: false,
      },
      {
        name: 'Premium Discount Code',
        description: 'Enhanced visibility and longer listing for your discount code',
        price: 79.99,
        currency: 'USD',
        duration_days: 60,
        type: 'discount-deal',
        features: ['60-day listing', 'Featured placement', 'Detailed analytics', 'Priority support'],
        is_featured: true,
      },
    ]);

    if (seedError) {
      console.error('Error seeding payment_plans:', seedError);
    } else {
      console.log('✅ Seeded payment_plans table with initial data');
    }
  } else {
    console.log('✅ payment_plans table already has data, skipping seed');
  }

  console.log('Migrations completed');
}

// Run the migrations
runMigrations()
  .then(() => {
    console.log('Database setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  }); 