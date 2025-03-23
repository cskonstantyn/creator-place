# Supabase Integration Guide

This document provides instructions for setting up and utilizing Supabase within the CreatorDeals application.

## Prerequisites

- Supabase account (create one at [supabase.com](https://supabase.com) if you don't have one)
- API keys from your Supabase Dashboard

## Environment Setup

1. Add your Supabase API keys to your `.env.local` file:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key # For migrations and admin operations
```

## Database Schema

The application requires several database tables:

### Payment Plans Table

Stores information about available payment plans.

```sql
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
```

### Payment Intents Table

Stores information about payment intents.

```sql
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
```

## Row Level Security (RLS)

Supabase uses PostgreSQL's Row Level Security to control data access. Set up RLS policies:

```sql
-- Enable RLS on tables
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read payment_plans
CREATE POLICY "Anyone can read payment_plans"
    ON public.payment_plans
    FOR SELECT USING (true);

-- Allow authenticated users to read their own payment_intents
CREATE POLICY "Users can read their own payment_intents"
    ON public.payment_intents
    FOR SELECT USING (auth.uid() = user_id);
```

## Database Migrations

The project includes a migration script to set up your database tables:

1. Ensure you have the necessary environment variables set in `.env.local`
2. Run the migration script:

```bash
npm run db:setup
```

This will:
- Create the required tables if they don't exist
- Set up RLS policies
- Seed initial payment plans data if the table is empty

## Using Supabase in the Application

### Authentication

Supabase provides built-in authentication. The app uses a simplified mock authentication in development, but can be upgraded to use Supabase Auth:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Sign in with email and password
const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Sign up new user
const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

// Sign out
const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}
```

### Database Operations

The application uses Supabase for database operations. Here's how to perform common operations:

#### Check if a Table Exists

```typescript
const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('information_schema.tables')
      .select('table_name', { count: 'exact', head: true })
      .eq('table_schema', 'public')
      .eq('table_name', tableName);
    
    if (error) throw error;
    return count !== null && count > 0;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};
```

#### Fetching Data with Fallbacks

```typescript
const getPaymentPlans = async (): Promise<PaymentPlan[]> => {
  // Check if table exists
  const exists = await tableExists('payment_plans');
  
  if (!exists || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    console.log('Using mock payment plans data');
    return mockPaymentPlans;
  }
  
  try {
    const { data, error } = await supabase
      .from('payment_plans')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching payment plans:', error);
    return mockPaymentPlans; // Fallback to mock data on error
  }
};
```

## Development vs. Production

### Development Mode

In development mode, the application can use mock data:

- Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in your `.env.local` file
- The application will use mock data instead of making real database calls
- This allows development without requiring a fully set up database

### Production Mode

For production:

1. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in your environment
2. Ensure all required database tables exist in your Supabase project
3. Configure proper Supabase API keys
4. Set up correct RLS policies for security

## Deployment Considerations

When deploying with Supabase:

1. **Environment Variables**: Ensure all Supabase-related environment variables are set in your hosting environment
2. **CORS Settings**: Configure CORS in your Supabase project to allow requests from your deployment URL
3. **Authentication Redirect**: Update any OAuth redirect URLs in your Supabase project settings
4. **RLS Policies**: Review and test all RLS policies to ensure proper security in production

## Troubleshooting

Common issues:

1. **API Key Issues**: Ensure your API keys are correctly formatted and have the right permissions
2. **RLS Blocking Access**: Check RLS policies if data isn't accessible when it should be
3. **CORS Errors**: Configure CORS settings in your Supabase dashboard
4. **Missing Tables**: Run the migration script to create required tables

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) 