// Payment Types
export enum PaymentType {
  ONE_TIME = 'one_time',
  SUBSCRIPTION = 'subscription',
  CREDIT = 'credit',
}

export enum SubscriptionInterval {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum CreditType {
  SINGLE = 'single',
  MULTI = 'multi',
}

// Product Definition
export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  active: boolean;
  metadata?: Record<string, string>;
}

// Price Definition
export interface Price {
  id: string;
  product_id: string;
  currency: string;
  unit_amount: number;
  type: PaymentType;
  interval?: SubscriptionInterval;
  interval_count?: number;
  trial_period_days?: number;
  metadata?: Record<string, string>;
  active: boolean;
}

// Credit System Types
export interface CreditSystem {
  id: string;
  name: string;
  type: CreditType;
  currencies?: CreditCurrency[];
  exchange_rates?: ExchangeRate[];
  metadata?: Record<string, string>;
}

export interface CreditCurrency {
  id: string;
  name: string;
  symbol: string;
  system_id: string;
  metadata?: Record<string, string>;
}

export interface ExchangeRate {
  from_currency_id: string;
  to_currency_id: string;
  rate: number;
  metadata?: Record<string, string>;
}

export interface UserCredit {
  user_id: string;
  currency_id: string;
  balance: number;
  metadata?: Record<string, string>;
}

// Customer Types
export interface Customer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
  stripe_customer_id?: string;
}

// Subscription Types
export interface Subscription {
  id: string;
  customer_id: string;
  price_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  metadata?: Record<string, string>;
  stripe_subscription_id?: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
  UNPAID = 'unpaid',
}

// Payment Types
export interface Payment {
  id: string;
  customer_id: string;
  price_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
  metadata?: Record<string, string>;
  stripe_payment_id?: string;
}

export enum PaymentStatus {
  SUCCEEDED = 'succeeded',
  PENDING = 'pending',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Transaction Types
export interface CreditTransaction {
  id: string;
  user_id: string;
  currency_id: string;
  amount: number;
  type: CreditTransactionType;
  reference_id?: string;
  created_at: string;
  metadata?: Record<string, string>;
}

export enum CreditTransactionType {
  PURCHASE = 'purchase',
  REDEMPTION = 'redemption',
  REWARD = 'reward',
  EXPIRY = 'expiry',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
}

// Achievement and Gamification Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  image?: string;
  points: number;
  conditions: AchievementCondition[];
  metadata?: Record<string, string>;
}

export interface AchievementCondition {
  type: AchievementConditionType;
  value: number | string;
  operator: ConditionOperator;
  metadata?: Record<string, string>;
}

export enum AchievementConditionType {
  PURCHASE_COUNT = 'purchase_count',
  SUBSCRIPTION_DURATION = 'subscription_duration',
  CREDIT_BALANCE = 'credit_balance',
  CREDIT_SPENT = 'credit_spent',
  CUSTOM = 'custom',
}

export enum ConditionOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  metadata?: Record<string, string>;
}

// Paywall Component Props
export interface PaywallProps {
  products: Product[];
  prices: Price[];
  onPurchase?: (price: Price) => void;
  onSubscribe?: (price: Price) => void;
  onCreditPurchase?: (price: Price, credits: number) => void;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  theme?: 'light' | 'dark' | 'system';
  layout?: 'cards' | 'list' | 'compact';
  featuredPriceId?: string;
  customComponents?: {
    Header?: React.ComponentType<any>;
    Footer?: React.ComponentType<any>;
    ProductCard?: React.ComponentType<ProductCardProps>;
    SubscriptionCard?: React.ComponentType<SubscriptionCardProps>;
    CreditCard?: React.ComponentType<CreditCardProps>;
  };
}

export interface ProductCardProps {
  product: Product;
  price: Price;
  onPurchase: () => void;
  featured?: boolean;
}

export interface SubscriptionCardProps {
  product: Product;
  price: Price;
  onSubscribe: () => void;
  featured?: boolean;
}

export interface CreditCardProps {
  product: Product;
  price: Price;
  onPurchase: (credits: number) => void;
  featured?: boolean;
} 