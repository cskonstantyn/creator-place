import { create } from 'zustand';
import { 
  Product, 
  Price, 
  Customer, 
  Subscription, 
  Payment, 
  UserCredit, 
  CreditCurrency,
  UserAchievement,
  Achievement
} from '@/types';

interface PaywallState {
  // Data
  products: Product[];
  prices: Price[];
  customer: Customer | null;
  subscriptions: Subscription[];
  payments: Payment[];
  userCredits: UserCredit[];
  availableCurrencies: CreditCurrency[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  activeModal: 'subscription' | 'payment' | 'credit' | 'success' | 'error' | null;
  selectedPrice: Price | null;
  
  // Actions
  setProducts: (products: Product[]) => void;
  setPrices: (prices: Price[]) => void;
  setCustomer: (customer: Customer | null) => void;
  setSubscriptions: (subscriptions: Subscription[]) => void;
  setPayments: (payments: Payment[]) => void;
  setUserCredits: (userCredits: UserCredit[]) => void;
  setAvailableCurrencies: (currencies: CreditCurrency[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setUserAchievements: (userAchievements: UserAchievement[]) => void;
  
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveModal: (modal: PaywallState['activeModal']) => void;
  setSelectedPrice: (price: Price | null) => void;
  
  // Computed
  getProductById: (id: string) => Product | undefined;
  getPriceById: (id: string) => Price | undefined;
  getActiveSubscriptions: () => Subscription[];
  getUserCreditBalance: (currencyId: string) => number;
  hasUserUnlockedAchievement: (achievementId: string) => boolean;
  
  // Reset
  reset: () => void;
}

export const usePaywallStore = create<PaywallState>((set, get) => ({
  // Initial data state
  products: [],
  prices: [],
  customer: null,
  subscriptions: [],
  payments: [],
  userCredits: [],
  availableCurrencies: [],
  achievements: [],
  userAchievements: [],
  
  // Initial UI state
  isLoading: false,
  error: null,
  activeModal: null,
  selectedPrice: null,
  
  // Actions for updating data
  setProducts: (products) => set({ products }),
  setPrices: (prices) => set({ prices }),
  setCustomer: (customer) => set({ customer }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  setPayments: (payments) => set({ payments }),
  setUserCredits: (userCredits) => set({ userCredits }),
  setAvailableCurrencies: (availableCurrencies) => set({ availableCurrencies }),
  setAchievements: (achievements) => set({ achievements }),
  setUserAchievements: (userAchievements) => set({ userAchievements }),
  
  // Actions for updating UI state
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setSelectedPrice: (selectedPrice) => set({ selectedPrice }),
  
  // Computed values
  getProductById: (id) => get().products.find(product => product.id === id),
  getPriceById: (id) => get().prices.find(price => price.id === id),
  getActiveSubscriptions: () => get().subscriptions.filter(
    subscription => ['active', 'trialing'].includes(subscription.status)
  ),
  getUserCreditBalance: (currencyId) => {
    const userCredit = get().userCredits.find(credit => credit.currency_id === currencyId);
    return userCredit?.balance || 0;
  },
  hasUserUnlockedAchievement: (achievementId) => {
    return get().userAchievements.some(ua => ua.achievement_id === achievementId);
  },
  
  // Reset the entire store
  reset: () => set({
    products: [],
    prices: [],
    customer: null,
    subscriptions: [],
    payments: [],
    userCredits: [],
    availableCurrencies: [],
    achievements: [],
    userAchievements: [],
    isLoading: false,
    error: null,
    activeModal: null,
    selectedPrice: null,
  }),
})); 