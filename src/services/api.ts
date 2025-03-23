import { 
  mockBrandDeals, 
  mockDiscountDeals, 
  searchDeals, 
  type SearchResult,
  type BrandDeal,
  type DiscountDeal
} from '../mockData/deals';

import {
  mockCurrentUser,
  mockUserProfile,
  mockUserCredits,
  mockUserSubscription,
  mockPaymentPlans,
  getUserProfile,
  getUserCredits,
  getUserSubscription,
  getPaymentPlans,
  useCredits,
  type User,
  type UserProfile,
  type UserCredits,
  type Subscription,
  type PaymentPlan
} from '../mockData/users';

// Mock API service
class ApiService {
  // Auth methods
  async getCurrentUser(): Promise<User | null> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCurrentUser;
  }

  async signIn(email: string, password: string): Promise<User | null> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Always return the mock user for demonstration
    return mockCurrentUser;
  }

  async signUp(email: string, password: string): Promise<User | null> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Always return the mock user for demonstration
    return mockCurrentUser;
  }

  async signOut(): Promise<void> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  // User profile methods
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return getUserProfile(userId);
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // In a real implementation, this would update the database
    // Here we just update our mock object
    const updatedProfile = {
      ...mockUserProfile,
      ...profile,
      updated_at: new Date().toISOString()
    };
    
    return updatedProfile;
  }

  // Deal methods
  async getBrandDeals(): Promise<BrandDeal[]> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBrandDeals;
  }

  async getDiscountDeals(): Promise<DiscountDeal[]> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDiscountDeals;
  }

  async searchDeals(
    searchTerm?: string,
    categories?: string[],
    dealType?: 'brand_deal' | 'discount_deal',
    limit: number = 10
  ): Promise<SearchResult[]> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 700));
    return searchDeals(searchTerm, categories, dealType, limit);
  }

  async getDealById(id: string, dealType: 'brand_deal' | 'discount_deal'): Promise<BrandDeal | DiscountDeal | null> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (dealType === 'brand_deal') {
      return mockBrandDeals.find(deal => deal.id === id) || null;
    } else {
      return mockDiscountDeals.find(deal => deal.id === id) || null;
    }
  }

  async incrementDealViews(id: string, dealType: 'brand_deal' | 'discount_deal'): Promise<boolean> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real implementation, this would update the database
    // Here we just update our mock array
    if (dealType === 'brand_deal') {
      const dealIndex = mockBrandDeals.findIndex(deal => deal.id === id);
      if (dealIndex >= 0) {
        mockBrandDeals[dealIndex].views += 1;
        return true;
      }
    } else {
      const dealIndex = mockDiscountDeals.findIndex(deal => deal.id === id);
      if (dealIndex >= 0) {
        mockDiscountDeals[dealIndex].views += 1;
        return true;
      }
    }
    
    return false;
  }

  // Credit methods
  async getUserCredits(userId: string): Promise<UserCredits | null> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return getUserCredits(userId);
  }

  async useCredits(userId: string, amount: number, description: string): Promise<boolean> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return useCredits(userId, amount, description);
  }

  // Subscription methods
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getUserSubscription(userId);
  }

  async getPaymentPlans(): Promise<PaymentPlan[]> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return getPaymentPlans();
  }

  async createCheckoutSession(planId: string): Promise<{ sessionId: string }> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, this would call Stripe
    // Here we just return a mock session ID
    return {
      sessionId: `cs_test_${Math.random().toString(36).substring(2, 15)}`
    };
  }

  async createCustomerPortalSession(): Promise<{ url: string }> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // In a real implementation, this would call Stripe
    // Here we just return a mock URL
    return {
      url: `https://billing.stripe.com/p/session/${Math.random().toString(36).substring(2, 15)}`
    };
  }
}

// Create and export a single instance of the API service
export const api = new ApiService(); 