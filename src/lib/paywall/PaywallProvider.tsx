import React, { createContext, useContext, useState, useEffect } from 'react';
// Import types from our local adapter
import { getAllPaywallProducts, Product, Price } from './adapter';
import { redirectToCheckout, generateClientReferenceId } from '../stripe/client';
import { toast } from 'sonner';

// Check if we're in mock mode
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Create a context for the paywall
interface PaywallContextType {
  products: Product[];
  prices: Price[];
  isLoading: boolean;
  error: string | null;
  handlePurchase: (price: Price) => Promise<void>;
  handleSubscribe: (price: Price) => Promise<void>;
  handleCreditPurchase: (price: Price, credits: number) => Promise<void>;
  isProductLocked: (productId: string) => boolean;
  formatPrice: (price: Price) => string;
  getPricesForProduct: (productId: string) => Price[];
}

const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

// Create a provider that manages the paywall state
export const PaywallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load mock products and prices
    try {
      const { products: mockProducts, prices: mockPrices } = getAllPaywallProducts();
      setProducts(mockProducts);
      setPrices(mockPrices);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading paywall products:', err);
      setError('Failed to load payment plans');
      setIsLoading(false);
    }
  }, []);

  // Implementation of handlePurchase
  const handlePurchase = async (price: Price): Promise<void> => {
    try {
      // In production, this would call an API endpoint to create a checkout session
      // For development, we'll just log the purchase details
      const isProd = import.meta.env.PROD;
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (isProd && stripeKey && !useMockData) {
        // Here we would call the API to create a checkout session
        // For now, we'll fake a session ID
        const fakeSessionId = `cs_test_${generateClientReferenceId()}`;
        await redirectToCheckout(fakeSessionId);
      } else {
        console.log('Mock purchase:', price);
        
        // In mock mode, simulate adding credits or subscription to local storage
        const product = products.find(p => p.id === price.product_id);
        
        if (product) {
          if (product.metadata?.type === 'credit') {
            const creditAmount = parseInt(product.metadata?.credit_amount || '0', 10);
            const currentCredits = localStorage.getItem('userCredits') ? 
              parseInt(localStorage.getItem('userCredits') || '0', 10) : 0;
            
            localStorage.setItem('userCredits', (currentCredits + creditAmount).toString());
            console.log(`Added ${creditAmount} credits. Total: ${currentCredits + creditAmount}`);
          } else if (product.metadata?.type === 'subscription') {
            localStorage.setItem('userSubscription', JSON.stringify({
              plan: product.name,
              validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
            }));
            console.log(`Activated subscription: ${product.name}`);
          }
        }
      }
      return Promise.resolve();
    } catch (err) {
      console.error('Error handling purchase:', err);
      setError('Failed to process payment');
      return Promise.reject(err);
    }
  };

  // Implementation of handleSubscribe
  const handleSubscribe = async (price: Price): Promise<void> => {
    try {
      // In production, this would call an API endpoint to create a subscription checkout session
      // For development, we'll just log the subscription details
      const isProd = import.meta.env.PROD;
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (isProd && stripeKey && !useMockData) {
        // Here we would call the API to create a checkout session for subscription
        // For now, we'll fake a session ID
        const fakeSessionId = `cs_test_${generateClientReferenceId()}`;
        await redirectToCheckout(fakeSessionId);
      } else {
        console.log('Mock subscribe:', price);
        
        // In mock mode, simulate adding subscription to local storage
        const product = products.find(p => p.id === price.product_id);
        
        if (product) {
          localStorage.setItem('userSubscription', JSON.stringify({
            plan: product.name,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }));
          
          console.log(`Activated subscription: ${product.name}`);
          toast.success(`Subscription activated: ${product.name}`);
        }
      }
      return Promise.resolve();
    } catch (err) {
      console.error('Error handling subscription:', err);
      setError('Failed to process subscription');
      return Promise.reject(err);
    }
  };

  // Implementation of handleCreditPurchase
  const handleCreditPurchase = async (price: Price, credits: number): Promise<void> => {
    try {
      // In production, this would call an API endpoint to create a checkout session with metadata
      // For development, we'll just log the credit purchase details
      const isProd = import.meta.env.PROD;
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (isProd && stripeKey && !useMockData) {
        // Here we would call the API to create a checkout session with credits in metadata
        // For now, we'll fake a session ID
        const fakeSessionId = `cs_test_${generateClientReferenceId()}`;
        await redirectToCheckout(fakeSessionId);
      } else {
        console.log('Mock credit purchase:', price, credits);
        
        // In mock mode, simulate adding credits to local storage
        const currentCredits = localStorage.getItem('userCredits') ? 
          parseInt(localStorage.getItem('userCredits') || '0', 10) : 0;
        
        localStorage.setItem('userCredits', (currentCredits + credits).toString());
        console.log(`Added ${credits} credits. Total: ${currentCredits + credits}`);
        toast.success(`Added ${credits} credits to your account`);
      }
      return Promise.resolve();
    } catch (err) {
      console.error('Error handling credit purchase:', err);
      setError('Failed to process credit purchase');
      return Promise.reject(err);
    }
  };

  // Mock implementation of isProductLocked
  const isProductLocked = (productId: string): boolean => {
    if (useMockData) {
      // For frontend-only mode, always unlock everything
      return false;
    }
    
    // Otherwise, check if the user has purchased the product
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return true;
    }
    
    if (product.metadata?.type === 'subscription') {
      // Check if user has an active subscription
      const subscriptionStr = localStorage.getItem('userSubscription');
      if (!subscriptionStr) return true;
      
      try {
        const subscription = JSON.parse(subscriptionStr);
        const validUntil = new Date(subscription.validUntil);
        return validUntil < new Date();
      } catch (e) {
        return true;
      }
    } else if (product.metadata?.type === 'credit') {
      // Check if user has enough credits
      const currentCredits = localStorage.getItem('userCredits') ? 
        parseInt(localStorage.getItem('userCredits') || '0', 10) : 0;
      
      return currentCredits <= 0;
    }
    
    // Default to locked
    return true;
  };

  // Format price as a string with currency
  const formatPrice = (price: Price): string => {
    const amount = price.unit_amount / 100; // Convert cents to dollars
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency.toUpperCase(),
    }).format(amount);
  };

  // Get all prices for a specific product
  const getPricesForProduct = (productId: string): Price[] => {
    return prices.filter(price => price.product_id === productId);
  };

  // Provide the paywall context to the children
  return (
    <PaywallContext.Provider
      value={{
        products,
        prices,
        isLoading,
        error,
        handlePurchase,
        handleSubscribe,
        handleCreditPurchase,
        isProductLocked,
        formatPrice,
        getPricesForProduct,
      }}
    >
      {children}
    </PaywallContext.Provider>
  );
};

// Custom hook to use the paywall context
export const usePaywall = (): PaywallContextType => {
  const context = useContext(PaywallContext);
  if (context === undefined) {
    throw new Error('usePaywall must be used within a PaywallProvider');
  }
  return context;
}; 