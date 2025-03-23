# CreatorDeals Scripts

This directory contains utility scripts for the CreatorDeals application.

## Database Setup Scripts

### Setup Supabase Database

The `setup-supabase.js` script automates the creation of necessary tables and data in your Supabase database.

#### Prerequisites

1. Node.js installed (v16 or later)
2. A Supabase project with the following:
   - URL and API keys configured in `.env.local` file
   - Supabase service role key (for admin operations)

#### Installation

Before running the script, install the required dependencies:

```bash
npm install @supabase/supabase-js dotenv
```

#### Usage

To set up your Supabase database:

1. Make sure your `.env.local` file has the following variables configured:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the setup script:
   ```bash
   node scripts/setup-supabase.js
   ```

The script will:
1. Create the required tables if they don't exist:
   - `payment_plans`
   - `payment_intents`
   - `user_subscriptions`
   - `user_credits`
   - `brand_deals`
   - `discount_deals`
   - `favorites`
2. Set up Row Level Security (RLS) policies for each table
3. Insert sample data for testing (if the tables are empty)

#### Troubleshooting

- **Permission errors**: Make sure you're using the service role key, not the anon key.
- **Connection errors**: Verify your Supabase URL is correct and that your IP is allowed in Supabase.
- **SQL errors**: If you encounter SQL-related errors, check the Supabase logs for details.

## Development Notes

- The script checks for existing tables before creating new ones, so it's safe to run multiple times.
- To reset your database completely, delete the tables in Supabase before running the script again.
- For production use, you may want to modify the sample data insertion or disable it completely. 