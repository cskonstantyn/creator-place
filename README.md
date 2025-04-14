# Welcome to your Lovable project

## Project info



**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/eb4b4be3-2133-4a6d-9fbe-7bd1bbb2d939) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

# CreatorDeals Platform

This repository contains the source code for the CreatorDeals platform - a marketplace connecting content creators with brand deals and discount codes.

## Features

- Browse and search brand deals and discount codes
- User profiles for creators and brands
- Subscription plans with credit allocation
- Submit and manage brand deals and discount codes
- Admin approval workflow for submissions
- Payment processing with Stripe
- Personalized recommendations based on user activity

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Functions)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL via Supabase
- **Payment Processing**: Stripe
- **State Management**: React Context + Hooks
- **Styling**: Tailwind CSS with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase CLI
- Stripe account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/creator-deals.git
cd creator-deals
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory with the following variables (use `.env.example` as a template):

```
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_PROJECT_REF=your-project-ref

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
APP_URL=http://localhost:3000
APP_ENVIRONMENT=development
```

4. Start the Supabase local development environment

```bash
supabase start
```

5. Run migrations to set up the database

```bash
./supabase/run_migrations.sh
```

6. Start the development server

```bash
npm run dev
```

## Supabase Database Structure

The application uses a comprehensive database schema in Supabase:

### Core Tables

1. **brand_deals** - Brand collaboration opportunities
2. **discount_deals** - Discount code offers
3. **deal_submissions** - Pending deal submissions

### User-related Tables

4. **user_profiles** - Extended user information
5. **user_credits** - Credit system for users
6. **payment_intents** - Payment transaction records
7. **payment_plans** - Available credit packages
8. **subscriptions** - User subscription information
9. **purchase_history** - Record of user purchases
10. **favorites** - User's saved items
11. **creator_feedback** - Reviews and ratings
12. **app_settings** - Application configuration

### Database Functions

The database includes several powerful functions for managing the application:

1. **Search and Filter** - Complex search capabilities for deals
2. **Recommendation Engine** - Personalized deal recommendations
3. **Submission Workflow** - Functions for deal submission and approval
4. **Subscription Management** - Handling subscriptions and credits
5. **Security Policies** - Row Level Security for data protection

For full details on the database structure, see the [Supabase README](./supabase/README.md).

## Testing

The project includes comprehensive test scripts for the database:

```bash
# Run all database tests
./supabase/test_scripts/run_all_tests.sh

# Run specific test scripts
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f supabase/test_scripts/test_deal_workflow.sql
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f supabase/test_scripts/test_subscription_workflow.sql
```

## Stripe Integration

The project integrates with Stripe for payment processing and subscription management:

1. **Edge Functions** - Handle payment processing securely
2. **Subscription Plans** - Map to database payment plans
3. **Webhook Integration** - Process Stripe events for payments and subscriptions

### Deploying Edge Functions

Edge Functions handle the Stripe integration. Deploy them with:

```bash
./supabase/functions/deploy.sh
```

## Production Deployment

For production deployment:

1. Create a production Supabase project
2. Set up environment variables for production
3. Link to your Supabase project:

```bash
supabase link --project-ref your-project-ref
```

4. Push database changes:

```bash
supabase db push
```

5. Deploy Edge Functions:

```bash
./supabase/functions/deploy.sh
```

## Development/Production Toggle

The application includes a testing/production toggle for payment processing:

- In testing mode, payments are simulated without actual charges
- In production mode, real payments are processed through Stripe

Toggle between modes using the SQL function:

```sql
-- Enable testing mode
SELECT toggle_app_environment('testing');

-- Enable production mode
SELECT toggle_app_environment('production');
```

## Directory Structure

```
├── src/                  # Frontend application code
├── supabase/             # Supabase configuration
│   ├── migrations/       # Database migration files
│   ├── functions/        # Edge Functions for Stripe integration
│   ├── test_scripts/     # Test scripts for database functionality
│   └── README.md         # Supabase documentation
├── .env.example          # Example environment variables
└── README.md             # Main documentation
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Frontend-Only Mode

This project can run in frontend-only mode, which removes all dependencies on backend services. This is useful for:

- Frontend development without setting up the backend
- Demonstrating UI/UX without connecting to real APIs
- Testing with mock data

### Running in Frontend-Only Mode

```bash
# Start the development server in frontend-only mode
npm run frontend-only

# Build the project in frontend-only mode
npm run build:frontend-only
```

All API calls will use mock data defined in `src/mockData/` directory. See [FRONTEND_ONLY.md](FRONTEND_ONLY.md) for more details.

# CreatorDeals

A platform connecting content creators with brands to enable authentic partnerships and monetization opportunities.

## Features

- **Landing Page** - Modern, responsive landing page that explains the platform for different user types
- **Stripe Integration** - Seamless payment processing for posting discount deals and brand deals
- **Content Browse** - Explore deals from creators and brands
- **Separate Interfaces** - Tailored experiences for regular users, content creators, and brands

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase CLI (for Edge Functions)
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd creator-place
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file based on `.env.example` with your own values:
   ```
   VITE_USE_MOCK_DATA=false
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_PAYMENT_SUCCESS_URL=/payment-success
   VITE_PAYMENT_CANCEL_URL=/payment-cancel
   VITE_USE_MOCK_PAYWALL=false
   VITE_SUPABASE_FUNCTIONS_URL=https://your-project-ref.supabase.co/functions/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Supabase Edge Functions

The project uses Supabase Edge Functions for Stripe integration. See the [Supabase README](./supabase/README.md) for details on deploying the Edge Functions.

### Deployment Steps

1. Install the Supabase CLI
2. Set up environment variables in your Supabase project
3. Deploy the Edge Functions:
   ```bash
   cd supabase/functions
   ./deploy.sh
   ```

## Payment Flow

The payment process works as follows:

1. User selects a plan (discount deal or brand deal)
2. Frontend calls the Supabase Edge Function to create a Stripe checkout session
3. User is redirected to Stripe for payment
4. After payment completion, user is redirected back to the success page
5. Platform credits are added to the user's account

## Development

### Code Structure

- `/src` - Frontend React application
  - `/components` - Reusable UI components
  - `/lib` - Utilities and helpers
  - `/pages` - Page components
- `/supabase` - Supabase Edge Functions
  - `/functions` - Edge function implementations

### Running Tests

```bash
npm test
# or
yarn test
```

## Deployment

The frontend can be deployed to any static hosting service (Vercel, Netlify, etc.):

```bash
npm run build
# or
yarn build
```

## Technology Stack

- **Frontend:** React, TypeScript, TailwindCSS
- **Backend:** Supabase
- **Payments:** Stripe
- **Authentication:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **Edge Functions:** Supabase Edge Functions (Deno)
