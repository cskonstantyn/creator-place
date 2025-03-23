import { supabase } from "@/integrations/supabase/client";
import { mockDiscountDeals } from "../mockData/deals";

// Check if mock data should be used
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// TypeScript interface for discount deals
export interface DiscountDeal {
  id: string;
  title: string;
  description: string;
  company_name: string;
  discount_code: string;
  discount_percentage: number;
  discount_flat_amount: number | null;
  expiry_date: string;
  terms_conditions: string;
  product_url: string;
  views: number;
  is_active: boolean;
  category: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  
  // Additional fields used in UI components
  store_name?: string;
  brand_name?: string;
  coupon_code?: string;
  original_price?: number;
  discounted_price?: number;
  location?: string;
  store_address?: string;
  items_sold?: number;
  usage_limit?: number | string;
  tags?: string[];
  campaign_period_start?: string;
  campaign_period_end?: string;
  redeem_policy?: string;
  special_instructions?: string;
}

// Get all discount deals
export async function getDiscountDeals(category?: string): Promise<DiscountDeal[]> {
  if (useMockData) {
    console.log("Using mock data for discount deals");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    let filteredDeals = mockDiscountDeals;
    
    if (category && category !== 'all') {
      // Format category to match our database (capitalize first letter)
      const formattedCategory = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      filteredDeals = mockDiscountDeals.filter(deal => deal.category === formattedCategory);
    }
    
    // Enhance mock data with image URLs and additional fields for the UI
    return filteredDeals.map(deal => ({
      ...deal,
      image_url: deal.image_url || `https://source.unsplash.com/random/300x300/?${deal.company_name.toLowerCase()},product`,
      store_name: deal.company_name,
      coupon_code: deal.discount_code,
      original_price: deal.price || Math.round(Math.random() * 100) + 50,
      discounted_price: deal.price ? deal.price * (1 - deal.discount_percentage / 100) : Math.round(Math.random() * 50) + 20,
      tags: [deal.category, "Discount"],
      items_sold: Math.floor(Math.random() * 50),
      usage_limit: Math.floor(Math.random() * 5) + 1,
      campaign_period_start: new Date().toISOString(),
      campaign_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }
  
  let query = supabase.from('discount_deals').select('*');
  
  if (category && category !== 'all') {
    // Format category to match our database (capitalize first letter)
    const formattedCategory = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    query = query.eq('category', formattedCategory);
  }
  
  // Sort by creation date
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching discount deals:', error);
    return [];
  }
  
  return data as DiscountDeal[] || [];
}

// Get a discount deal by id
export async function getDiscountDealById(id: string): Promise<DiscountDeal | null> {
  if (useMockData) {
    console.log("Using mock data for discount deal by ID");
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
    
    const mockDeal = mockDiscountDeals.find(deal => deal.id === id);
    if (!mockDeal) return null;
    
    return {
      ...mockDeal,
      image_url: mockDeal.image_url || `https://source.unsplash.com/random/300x300/?${mockDeal.company_name.toLowerCase()},product`,
      store_name: mockDeal.company_name,
      coupon_code: mockDeal.discount_code,
      original_price: mockDeal.price || Math.round(Math.random() * 100) + 50,
      discounted_price: mockDeal.price ? mockDeal.price * (1 - mockDeal.discount_percentage / 100) : Math.round(Math.random() * 50) + 20,
      tags: [mockDeal.category, "Discount"],
      items_sold: Math.floor(Math.random() * 50),
      usage_limit: Math.floor(Math.random() * 5) + 1,
      campaign_period_start: new Date().toISOString(),
      campaign_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
  
  const { data, error } = await supabase
    .from('discount_deals')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching discount deal:', error);
    return null;
  }
  
  return data as DiscountDeal || null;
}

// Increment view count
export async function incrementDiscountDealViews(id: string): Promise<void> {
  if (useMockData) {
    console.log("Using mock data for incrementing discount deal views");
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    const dealIndex = mockDiscountDeals.findIndex(deal => deal.id === id);
    if (dealIndex >= 0) {
      mockDiscountDeals[dealIndex].views += 1;
    }
    return;
  }
  
  const { error } = await supabase.rpc('increment_discount_deal_views', { deal_id: id });
  
  if (error) {
    console.error('Error incrementing discount deal views:', error);
  }
}
