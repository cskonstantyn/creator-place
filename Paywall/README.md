# Reusable Paywall Solution

A flexible and customizable paywall solution for your applications, with support for one-time purchases, subscriptions, and credit systems. This solution integrates Supabase for the database and user authentication, and Stripe for payment processing.

## Features

- 💰 **Multiple Payment Models**: Support for one-time purchases, subscriptions of different lengths, and credit/token systems
- 🔄 **Subscription Management**: Create, update, and cancel subscriptions with trial periods
- 💳 **Credit Systems**: Implement single or multiple credit currencies with exchange rates
- 🎮 **Gamification**: Achievement system to reward users and drive engagement
- 🔒 **Secure**: Built with best security practices using Supabase and Stripe
- 🎨 **Customizable**: Easily customize the UI and behavior to match your brand
- 📱 **Responsive**: Works great on all devices
- 🔌 **Easy Integration**: Designed to be easily added to any application

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Supabase](https://supabase.io/) account
- [Stripe](https://stripe.com/) account

## Setup

### 1. Supabase Setup

1. Create a new Supabase project
2. Set up the database schema using the `schema.sql` file in this repository
3. Configure authentication (Email, OAuth providers, etc.)
4. Get your Supabase URL and anon key from the API settings

### 2. Stripe Setup

1. Create a Stripe account if you don't have one
2. Get your Stripe API keys (publishable and secret)
3. Set up webhook endpoints to point to your deployed application at `/api/webhooks/stripe`
4. Create products and prices in the Stripe dashboard or using the Stripe API

### 3. Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### 4. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/paywall-solution.git

# Navigate to the project directory
cd paywall-solution

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

### 1. Integrate with Your Application

#### Option A: Using the Components Directly

```jsx
import { Paywall, usePaywall } from 'paywall-solution';

function YourComponent() {
  const { 
    products, 
    prices, 
    handlePurchase, 
    handleSubscribe, 
    handleCreditPurchase 
  } = usePaywall();

  return (
    <Paywall
      products={products}
      prices={prices}
      onPurchase={handlePurchase}
      onSubscribe={handleSubscribe}
      onCreditPurchase={handleCreditPurchase}
      theme="light"
      layout="cards"
      showHeader={true}
      showFooter={true}
    />
  );
}
```

#### Option B: Using the Hooks Only

```jsx
import { usePaywall } from 'paywall-solution';

function YourCustomPaywall() {
  const { 
    products, 
    prices, 
    handlePurchase, 
    isProductLocked, 
    formatPrice 
  } = usePaywall();

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          
          {prices
            .filter(price => price.product_id === product.id)
            .map(price => (
              <button 
                key={price.id} 
                onClick={() => handlePurchase(price)}
              >
                Buy for {formatPrice(price)}
              </button>
            ))
          }
        </div>
      ))}
    </div>
  );
}
```

### 2. Credit System Usage

```jsx
import { usePaywall } from 'paywall-solution';
import { CreditBalance } from 'paywall-solution/components';

function YourCreditsPage() {
  const { 
    userCredits, 
    availableCurrencies, 
    getUserCreditBalance, 
    spendCredits 
  } = usePaywall();

  // Example: Spend credits to unlock content
  const unlockContent = async (productId) => {
    const success = await spendCredits(productId);
    if (success) {
      // Handle successful unlock
    }
  };

  return (
    <div>
      <h1>Your Credits</h1>
      
      {userCredits.map(credit => {
        const currency = availableCurrencies.find(c => c.id === credit.currency_id);
        if (!currency) return null;
        
        return (
          <CreditBalance
            key={credit.currency_id}
            userCredit={credit}
            currency={currency}
            size="lg"
          />
        );
      })}
      
      <button onClick={() => unlockContent('premium-article-123')}>
        Unlock Premium Article (5 credits)
      </button>
    </div>
  );
}
```

### 3. Gamification Usage

```jsx
import { usePaywall } from 'paywall-solution';
import { AchievementBadge } from 'paywall-solution/components';

function YourAchievementsPage() {
  const { 
    achievements, 
    hasUserUnlockedAchievement 
  } = usePaywall();

  return (
    <div>
      <h1>Your Achievements</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(achievement => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            unlocked={hasUserUnlockedAchievement(achievement.id)}
            showDetails={true}
          />
        ))}
      </div>
    </div>
  );
}
```

## Customization

### 1. Theming

You can customize the appearance of the paywall components by:

1. **Theme Prop**: Set the `theme` prop to `'light'`, `'dark'`, or `'system'`
2. **Custom CSS**: Override the styles in your CSS files
3. **Custom Components**: Provide your own components through the `customComponents` prop

### 2. Custom Components

```jsx
import { Paywall } from 'paywall-solution';

// Your custom component implementations
function CustomProductCard({ product, price, onPurchase, featured }) {
  return (
    <div className="your-custom-card">
      <h3>{product.name}</h3>
      <button onClick={onPurchase}>Buy Now</button>
    </div>
  );
}

function YourComponent() {
  // ...
  
  return (
    <Paywall
      products={products}
      prices={prices}
      onPurchase={handlePurchase}
      customComponents={{
        ProductCard: CustomProductCard,
        // You can also provide custom Header, Footer, SubscriptionCard, and CreditCard
      }}
    />
  );
}
```

## Database Schema

The database schema is defined in the `schema.sql` file and includes tables for:

- Products and prices
- Customers
- Subscriptions
- Payments
- Credit systems
- Achievements and gamification

## Webhook Handling

The project includes a webhook handler at `/api/webhooks/stripe` that processes Stripe events and updates the database accordingly. This ensures that your application stays in sync with Stripe for events like successful payments, subscription changes, etc.

## Security Considerations

- All sensitive operations are performed server-side
- Supabase Row Level Security (RLS) policies are set up to protect your data
- Environment variables are used for API keys
- Authentication is required for sensitive operations

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fpaywall-solution)

1. Set up your environment variables in Vercel
2. Deploy your application
3. Configure your Stripe webhook to point to your deployed application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 