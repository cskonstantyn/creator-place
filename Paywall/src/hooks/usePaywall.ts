import { useCallback, useEffect, useState } from 'react';
import { usePaywallStore } from '@/store/paywallStore';
import { supabase } from '@/lib/supabase/client';
import { redirectToCheckout } from '@/lib/stripe/client';
import { Price, PaymentType, Product } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const usePaywall = () => {
  const {
    products,
    prices,
    customer,
    subscriptions,
    userCredits,
    availableCurrencies,
    isLoading,
    error,
    activeModal,
    selectedPrice,
    setProducts,
    setPrices,
    setCustomer,
    setSubscriptions,
    setUserCredits,
    setAvailableCurrencies,
    setIsLoading,
    setError,
    setActiveModal,
    setSelectedPrice,
    getProductById,
    getActiveSubscriptions,
    getUserCreditBalance,
    hasUserUnlockedAchievement,
  } = usePaywallStore();

  // Fetch all data needed for the paywall
  const fetchPaywallData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);
      
      if (productsError) throw productsError;
      setProducts(productsData || []);
      
      // Fetch prices
      const { data: pricesData, error: pricesError } = await supabase
        .from('prices')
        .select('*')
        .eq('active', true);
      
      if (pricesError) throw pricesError;
      setPrices(pricesData || []);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch customer
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (customerError && customerError.code !== 'PGRST116') {
          throw customerError;
        }
        
        setCustomer(customerData || null);
        
        // Fetch subscriptions
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('customer_id', user.id);
        
        if (subscriptionsError) throw subscriptionsError;
        setSubscriptions(subscriptionsData || []);
        
        // Fetch user credits
        const { data: userCreditsData, error: userCreditsError } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id);
        
        if (userCreditsError) throw userCreditsError;
        setUserCredits(userCreditsData || []);
      }
      
      // Fetch available credit currencies
      const { data: currenciesData, error: currenciesError } = await supabase
        .from('credit_currencies')
        .select('*');
      
      if (currenciesError) throw currenciesError;
      setAvailableCurrencies(currenciesData || []);
      
    } catch (err: any) {
      console.error('Error fetching paywall data:', err);
      setError(err.message || 'Failed to load paywall data');
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    setError,
    setProducts,
    setPrices,
    setCustomer,
    setSubscriptions,
    setUserCredits,
    setAvailableCurrencies,
  ]);

  // Handle one-time purchase
  const handlePurchase = useCallback(async (price: Price) => {
    if (!customer) {
      setError('You must be logged in to make a purchase');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call API route to create a checkout session
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: price.id,
          mode: 'payment',
          successUrl: window.location.origin + '/checkout/success',
          cancelUrl: window.location.origin + '/checkout/canceled',
        }),
      });
      
      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      await redirectToCheckout(sessionId);
      
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  }, [customer, setIsLoading, setError]);

  // Handle subscription
  const handleSubscribe = useCallback(async (price: Price) => {
    if (!customer) {
      setError('You must be logged in to subscribe');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call API route to create a subscription checkout session
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: price.id,
          mode: 'subscription',
          successUrl: window.location.origin + '/checkout/success',
          cancelUrl: window.location.origin + '/checkout/canceled',
          trialDays: price.trial_period_days,
        }),
      });
      
      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      await redirectToCheckout(sessionId);
      
    } catch (err: any) {
      console.error('Error creating subscription session:', err);
      setError(err.message || 'Failed to create subscription session');
    } finally {
      setIsLoading(false);
    }
  }, [customer, setIsLoading, setError]);

  // Handle credit purchase
  const handleCreditPurchase = useCallback(async (price: Price, creditAmount: number) => {
    if (!customer) {
      setError('You must be logged in to purchase credits');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call API route to create a checkout session for credits
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: price.id,
          mode: 'payment',
          successUrl: window.location.origin + '/checkout/success',
          cancelUrl: window.location.origin + '/checkout/canceled',
          metadata: {
            creditAmount: creditAmount.toString(),
            creditType: price.metadata?.creditType || 'default',
            currencyId: price.metadata?.currencyId || 'default',
          },
        }),
      });
      
      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      await redirectToCheckout(sessionId);
      
    } catch (err: any) {
      console.error('Error creating credit purchase session:', err);
      setError(err.message || 'Failed to create credit purchase session');
    } finally {
      setIsLoading(false);
    }
  }, [customer, setIsLoading, setError]);

  // Generate a unique client reference ID for tracking purposes
  const generateClientReferenceId = useCallback(() => {
    return uuidv4();
  }, []);

  // Check if a product is locked (requires purchase)
  const isProductLocked = useCallback((productId: string): boolean => {
    // Check if the user has an active subscription for this product
    const activeSubscriptions = getActiveSubscriptions();
    const productPrices = prices.filter(price => price.product_id === productId);
    const hasActiveSubscription = activeSubscriptions.some(sub => 
      productPrices.some(price => price.id === sub.price_id)
    );
    
    if (hasActiveSubscription) {
      return false;
    }
    
    // If the product requires credits, check if the user has enough
    const product = getProductById(productId);
    if (product?.metadata?.requiresCredits === 'true') {
      const currencyId = product.metadata?.currencyId;
      const requiredAmount = Number(product.metadata?.creditAmount || '0');
      
      if (currencyId && requiredAmount > 0) {
        const balance = getUserCreditBalance(currencyId);
        return balance < requiredAmount;
      }
    }
    
    // By default, consider the product locked if it has prices
    return productPrices.length > 0;
  }, [prices, getActiveSubscriptions, getProductById, getUserCreditBalance]);

  // Spend credits for a product
  const spendCredits = useCallback(async (productId: string): Promise<boolean> => {
    if (!customer) {
      setError('You must be logged in to spend credits');
      return false;
    }
    
    const product = getProductById(productId);
    if (!product || product.metadata?.requiresCredits !== 'true') {
      setError('This product does not support credit spending');
      return false;
    }
    
    const currencyId = product.metadata?.currencyId;
    const requiredAmount = Number(product.metadata?.creditAmount || '0');
    
    if (!currencyId || requiredAmount <= 0) {
      setError('Invalid credit configuration for this product');
      return false;
    }
    
    const balance = getUserCreditBalance(currencyId);
    if (balance < requiredAmount) {
      setError(`Insufficient credits. You need ${requiredAmount} credits, but have ${balance}`);
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Record a credit transaction
      const transactionId = uuidv4();
      
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          id: transactionId,
          user_id: customer.id,
          currency_id: currencyId,
          amount: -requiredAmount, // Negative amount for spending
          type: 'redemption',
          reference_id: productId,
          created_at: new Date().toISOString(),
          metadata: {
            product_id: productId,
            product_name: product.name,
          },
        });
      
      if (transactionError) throw transactionError;
      
      // Update the user's credit balance
      const newBalance = balance - requiredAmount;
      
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ balance: newBalance })
        .eq('user_id', customer.id)
        .eq('currency_id', currencyId);
      
      if (updateError) throw updateError;
      
      // Update local state
      setUserCredits(prevCredits => 
        prevCredits.map(credit => 
          credit.user_id === customer.id && credit.currency_id === currencyId
            ? { ...credit, balance: newBalance }
            : credit
        )
      );
      
      return true;
    } catch (err: any) {
      console.error('Error spending credits:', err);
      setError(err.message || 'Failed to spend credits');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [customer, getProductById, getUserCreditBalance, setIsLoading, setError, setUserCredits]);

  // Get all prices for a specific product
  const getPricesForProduct = useCallback((productId: string): Price[] => {
    return prices.filter(price => price.product_id === productId);
  }, [prices]);

  // Get a formatted price string
  const formatPrice = useCallback((price: Price): string => {
    const amount = price.unit_amount / 100; // Convert cents to dollars/euros/etc.
    
    let formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency.toUpperCase(),
    }).format(amount);
    
    if (price.type === PaymentType.SUBSCRIPTION && price.interval) {
      const intervalCount = price.interval_count || 1;
      const intervalStr = intervalCount === 1 ? price.interval : `${intervalCount} ${price.interval}s`;
      formattedPrice += `/${intervalStr}`;
    }
    
    return formattedPrice;
  }, []);

  // Get products by category (from metadata)
  const getProductsByCategory = useCallback((category: string): Product[] => {
    return products.filter(product => 
      product.metadata?.category === category && product.active
    );
  }, [products]);

  // Effect to fetch data on initial load
  useEffect(() => {
    fetchPaywallData();
  }, [fetchPaywallData]);

  return {
    // State
    products,
    prices,
    customer,
    subscriptions,
    userCredits,
    availableCurrencies,
    isLoading,
    error,
    activeModal,
    selectedPrice,
    
    // Actions
    setActiveModal,
    setSelectedPrice,
    handlePurchase,
    handleSubscribe,
    handleCreditPurchase,
    fetchPaywallData,
    isProductLocked,
    spendCredits,
    
    // Utilities
    getPricesForProduct,
    formatPrice,
    getProductsByCategory,
    generateClientReferenceId,
    getUserCreditBalance,
    hasUserUnlockedAchievement,
  };
}; 