import { mockPaymentPlans, PaymentPlan } from '../../services/paymentService';

// Define PaymentType enum locally to avoid import errors
export enum PaymentType {
  ONE_TIME = 'one_time',
  SUBSCRIPTION = 'subscription',
  CREDIT = 'credit',
}

// Define Product and Price types locally
export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  active: boolean;
  metadata?: Record<string, string>;
}

export interface Price {
  id: string;
  product_id: string;
  currency: string;
  unit_amount: number;
  type: PaymentType;
  interval?: string;
  interval_count?: number;
  trial_period_days?: number;
  metadata?: Record<string, string>;
  active: boolean;
}

// Convert our existing PaymentPlan to Paywall's Product and Price format
export function convertPaymentPlanToPaywall(plan: PaymentPlan): { product: Product; price: Price } {
  // Create a product from the payment plan
  const product: Product = {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    active: true,
    metadata: {
      type: plan.type || 'one_time',
      is_featured: plan.popular ? 'true' : 'false',
      category: plan.type === 'subscription' ? 'subscriptions' : 'credits',
      // Convert features array to comma-separated string
      features: plan.features.join(', ')
    },
  };

  // Determine payment type based on plan type
  let paymentType = PaymentType.ONE_TIME;
  if (plan.type === 'subscription') {
    paymentType = PaymentType.SUBSCRIPTION;
  } else if (plan.type === 'credit') {
    paymentType = PaymentType.CREDIT;
  }

  // Create a price from the payment plan
  const price: Price = {
    id: plan.id, // Using same ID as product for simplicity
    product_id: plan.id,
    currency: 'usd',
    unit_amount: Math.round(plan.price * 100), // Convert to cents
    type: paymentType,
    interval: plan.interval,
    active: true,
    metadata: {
      credit_amount: plan.credit_amount?.toString() || '',
    },
  };

  return { product, price };
}

// Convert all our payment plans to Paywall format
export function getAllPaywallProducts(): { products: Product[]; prices: Price[] } {
  const products: Product[] = [];
  const prices: Price[] = [];

  // Convert each payment plan
  mockPaymentPlans.forEach(plan => {
    const { product, price } = convertPaymentPlanToPaywall(plan);
    products.push(product);
    prices.push(price);
  });

  return { products, prices };
}

// Filter paywall products by type
export function getPaywallProductsByType(type: 'subscription' | 'credit' | 'one_time'): { products: Product[]; prices: Price[] } {
  const filteredPlans = mockPaymentPlans.filter(plan => plan.type === type);
  const products: Product[] = [];
  const prices: Price[] = [];

  filteredPlans.forEach(plan => {
    const { product, price } = convertPaymentPlanToPaywall(plan);
    products.push(product);
    prices.push(price);
  });

  return { products, prices };
}

// Find a PaymentPlan from a Paywall Price
export function findPaymentPlanFromPrice(price: Price): PaymentPlan | null {
  return mockPaymentPlans.find(plan => plan.id === price.id) || null;
} 