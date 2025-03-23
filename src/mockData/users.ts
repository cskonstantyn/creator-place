export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  email: string;
  user_type: 'creator' | 'brand' | 'admin';
  is_verified: boolean;
  social_links: Record<string, string> | null;
  settings: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface UserCredits {
  id: string;
  user_id: string;
  credits_remaining: number;
  credits_used: number;
  credits_purchased: number;
  last_purchase_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string | null;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  interval_count: number;
  credits_per_cycle: number;
  plan_type: 'creator' | 'brand';
  created_at: string;
  updated_at: string;
}

// Mock current user
export const mockCurrentUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "demo@example.com",
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
};

// Mock user profile
export const mockUserProfile: UserProfile = {
  id: mockCurrentUser.id,
  username: "demo_user",
  display_name: "Demo User",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
  bio: "Content creator passionate about technology and gaming.",
  website: "https://example.com",
  email: mockCurrentUser.email,
  user_type: "creator",
  is_verified: true,
  social_links: {
    instagram: "https://instagram.com/demo_user",
    twitter: "https://twitter.com/demo_user",
    youtube: "https://youtube.com/demo_user"
  },
  settings: {
    notifications: {
      email: true,
      deals: true
    },
    privacy: {
      showEmail: false
    }
  },
  created_at: mockCurrentUser.created_at,
  updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
};

// Mock user credits
export const mockUserCredits: UserCredits = {
  id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  user_id: mockCurrentUser.id,
  credits_remaining: 85,
  credits_used: 15,
  credits_purchased: 100,
  last_purchase_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
};

// Mock payment plans
export const mockPaymentPlans: PaymentPlan[] = [
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    name: "Creator Basic",
    description: "Basic plan for creators with 10 credits per month",
    price: 9.99,
    currency: "usd",
    interval: "month",
    interval_count: 1,
    credits_per_cycle: 10,
    plan_type: "creator",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    name: "Creator Pro",
    description: "Pro plan for creators with 50 credits per month",
    price: 19.99,
    currency: "usd",
    interval: "month",
    interval_count: 1,
    credits_per_cycle: 50,
    plan_type: "creator",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
    name: "Brand Basic",
    description: "Basic plan for brands with 20 credits per month",
    price: 29.99,
    currency: "usd",
    interval: "month",
    interval_count: 1,
    credits_per_cycle: 20,
    plan_type: "brand",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "6ba7b813-9dad-11d1-80b4-00c04fd430c8",
    name: "Brand Pro",
    description: "Pro plan for brands with 100 credits per month",
    price: 49.99,
    currency: "usd",
    interval: "month",
    interval_count: 1,
    credits_per_cycle: 100,
    plan_type: "brand",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock user subscription
export const mockUserSubscription: Subscription = {
  id: "9be7e315-0d7c-4f51-9a12-3fcbd5c31cb5",
  user_id: mockCurrentUser.id,
  stripe_subscription_id: "sub_1234567890",
  stripe_customer_id: "cus_1234567890",
  plan_id: mockPaymentPlans[1].id, // Creator Pro plan
  status: "active",
  current_period_start: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  current_period_end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  cancel_at_period_end: false,
  metadata: {
    referral: "direct"
  },
  created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
};

// Mock function to get user profile
export const getUserProfile = (userId: string): UserProfile | null => {
  if (userId === mockCurrentUser.id) {
    return mockUserProfile;
  }
  return null;
};

// Mock function to get user credits
export const getUserCredits = (userId: string): UserCredits | null => {
  if (userId === mockCurrentUser.id) {
    return mockUserCredits;
  }
  return null;
};

// Mock function to get user subscription
export const getUserSubscription = (userId: string): Subscription | null => {
  if (userId === mockCurrentUser.id) {
    return mockUserSubscription;
  }
  return null;
};

// Mock function to get all payment plans
export const getPaymentPlans = (): PaymentPlan[] => {
  return mockPaymentPlans;
};

// Mock function to use credits
export const useCredits = (userId: string, amount: number, description: string): boolean => {
  if (userId !== mockCurrentUser.id) {
    return false;
  }
  
  if (mockUserCredits.credits_remaining < amount) {
    return false;
  }
  
  // In a real implementation, this would update the database
  // Here we just update our mock object
  mockUserCredits.credits_remaining -= amount;
  mockUserCredits.credits_used += amount;
  mockUserCredits.updated_at = new Date().toISOString();
  
  return true;
}; 