# CreatorDeals Frontend-Only Mode

This project has been configured to run in a "frontend-only" mode, removing all dependencies on Supabase and backend services. This configuration is perfect for frontend development or when you want to use a different backend solution.

## Overview

In this mode, the application uses mock data for all its functionality:
- User authentication
- Brand and discount deals
- User profiles and credits
- Subscriptions and payment plans

All API calls are simulated with appropriate delays to mimic real network requests, but no actual backend calls are made.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Access the application**:
   Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Mock Data

The mock data is defined in the following files:
- `src/mockData/deals.ts`: Contains brand and discount deals data
- `src/mockData/users.ts`: Contains user profiles, credits, and subscription data

You can modify these files to add, update, or remove mock data as needed for your development.

## API Service

The frontend communicates with a mock API service defined in `src/services/api.ts`. This service simulates all backend operations with appropriate delays to mimic real network requests.

If you want to connect to a real backend in the future, you only need to update the implementation of this service without changing your components.

## Environment Variables

The following environment variables are set to enable mock mode:

- `VITE_USE_MOCK_DATA=true`: Enables using mock data for all API calls
- `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_mock`: Mock Stripe publishable key
- `VITE_USE_MOCK_PAYWALL=true`: Enables mock paywall functionality

## Features Available in Mock Mode

All features of the application are available in mock mode:

- **Authentication**: Sign up, sign in, and sign out (with mock user data)
- **Deals**: Browse brand and discount deals, search, and filter
- **User Profile**: View and update profile information
- **Credits**: View and use credits for deal submissions
- **Subscriptions**: View subscription information and payment plans

## Transitioning to a Real Backend

When you're ready to connect to a real backend:

1. Implement a new API service that connects to your backend
2. Update the environment variables to disable mock mode
3. Replace the mock imports in your components with your real service

## Troubleshooting

If you encounter any issues with the frontend-only mode:

1. **Make sure all environment variables are set correctly**: Check `.env` and `.env.local` files
2. **Verify that all dependencies are installed**: Run `npm install` again
3. **Clear browser cache and local storage**: This can help if you're experiencing authentication issues
4. **Check the console for errors**: Open the browser's developer tools to see any error messages 