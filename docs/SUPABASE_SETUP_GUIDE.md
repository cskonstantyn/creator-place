# Supabase Setup Guide for CreatorDeals

This guide provides step-by-step instructions for setting up Supabase as the backend database for the CreatorDeals application.

## Table of Contents

1. [Creating a Supabase Project](#1-creating-a-supabase-project)
2. [Setting up Environment Variables](#2-setting-up-environment-variables)
3. [Database Setup](#3-database-setup)
4. [Authentication Configuration](#4-authentication-configuration)
5. [Testing the Connection](#5-testing-the-connection)
6. [Troubleshooting](#6-troubleshooting)

## 1. Creating a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Click on "New Project" to create a new project.
3. Enter a name for your project (e.g., "CreatorDeals").
4. Set a secure database password and store it safely.
5. Choose a region closest to your target audience for better performance.
6. Click "Create new project" and wait for the project to be provisioned.

## 2. Setting up Environment Variables

Once your Supabase project is created, you need to update your environment variables:

1. In your Supabase project dashboard, go to "Settings" > "API".
2. Copy the following values:
   - **URL**: `https://[your-project-id].supabase.co`
   - **anon/public key**: This is used for client-side requests
   - **service_role key**: This is for server-side operations (keep it secure!)

3. Update your `.env.local` file in the root of your CreatorDeals project:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Keep existing variables like Stripe configuration
```

## 3. Database Setup

### Automatic Setup (Recommended)

We provide a script to automatically set up all required tables:

1. Make sure you have Node.js installed.
2. Install required dependencies:
   ```bash
   npm install @supabase/supabase-js dotenv
   ```
3. Run the database setup script:
   ```bash
   node scripts/setup-supabase.js
   ```
4. Verify the script ran successfully by checking the output messages.

### Manual Setup

If you prefer to set up the database manually:

1. Go to the SQL Editor in your Supabase dashboard.
2. Run the SQL scripts from the `migrations/create_payment_plans.sql` file.
3. Manually set up Row Level Security (RLS) for each table as described in the `scripts/setup-supabase.js` file.

## 4. Authentication Configuration

CreatorDeals uses Supabase Auth. Configure authentication settings:

1. In your Supabase dashboard, go to "Authentication" > "Providers".
2. Enable the authentication methods you want to support:
   - Email (recommended)
   - Social providers (optional): Google, Facebook, Twitter, etc.

3. Configure redirect URLs:
   - Add your site URL (e.g., `http://localhost:5173` for development)
   - Add the URLs for redirects after login/logout

4. Customize email templates (optional):
   - Go to "Authentication" > "Email Templates"
   - Update the templates to match your brand

## 5. Testing the Connection

Before fully deploying, test your Supabase connection:

1. Run the connection check script:
   ```bash
   node scripts/check-supabase.js
   ```

2. The script will output:
   - Connection status
   - Authentication system status
   - Table existence and row counts

3. You can also verify by running the application locally:
   ```bash
   npm run dev
   ```

4. Try signing up, logging in, and creating some test entries.

## 6. Troubleshooting

### Common Issues

**Connection Errors**:
- Verify your environment variables are correct
- Check if your IP is allowed in Supabase settings
- Make sure your service role key has the necessary permissions

**Authentication Issues**:
- Check authorized domains in Supabase authentication settings
- Verify redirect URLs are configured correctly
- Check browser console for CORS errors

**Database Access Issues**:
- Review RLS policies for each table
- Check user permissions for database operations
- Verify SQL queries are correctly formatted

### Getting Help

If you encounter issues not covered here:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review error messages in the browser console and server logs
3. Visit our project repository for specific issues

## Next Steps

- Set up regular backups of your Supabase database
- Configure monitoring and alerts
- Consider setting up staging and production environments with separate Supabase projects

---

Remember to never commit your service role key to version control. Always use environment variables for sensitive credentials. 