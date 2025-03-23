import { supabase } from "@/integrations/supabase/client";
import { api } from "./api";
import { mockBrandDeals } from "../mockData/deals";

// Check if mock data should be used
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Define TypeScript interface for brand deals
export interface BrandDeal {
  id: string;
  title: string;
  brand_name: string;
  industry: string;
  category: string;
  description: string;
  benefits: string;
  promotion_type: string;
  platform: string;
  collaboration_type: string;
  location: string;
  address?: string;
  followers_required: number;
  creators_needed: number;
  price: number;
  deal_value: string;
  expires: string;
  created_at: string;
  status: string;
  is_featured: boolean;
  image_url: string;
  views: number;
  dos_and_donts: string[];
  hashtags: string[];
  accounts_to_mention: string[];
  content_type: string;
  special_instructions?: string;
  guests_allowed: number;
  deadline_to_apply: string;
  deadline_to_post: string;
  reference_images: string[];
  reference_videos: any; // Changed from any[] to any to accommodate Json type
}

// Map mock data to our BrandDeal interface
const mapMockToAppFormat = (mockDeal: any): BrandDeal => {
  return {
    id: mockDeal.id,
    title: mockDeal.title,
    brand_name: mockDeal.company_name,
    industry: 'Technology',
    category: mockDeal.category,
    description: mockDeal.description,
    benefits: mockDeal.compensation,
    promotion_type: 'Paid',
    platform: 'Instagram',
    collaboration_type: 'Post',
    location: 'Remote',
    followers_required: 1000,
    creators_needed: 5,
    price: parseInt(mockDeal.compensation.replace(/[^0-9]/g, '')) || 100,
    deal_value: mockDeal.compensation,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: mockDeal.created_at,
    status: 'active',
    is_featured: Math.random() > 0.7, // 30% chance of being featured
    image_url: `https://source.unsplash.com/random/300x300/?${mockDeal.category.toLowerCase()}`,
    views: mockDeal.views,
    dos_and_donts: ['Do tag our brand', 'Do use our hashtag', 'Don\'t use competitors\' products'],
    hashtags: ['#sponsored', '#ad', `#${mockDeal.company_name.replace(/\s/g, '')}`],
    accounts_to_mention: [`@${mockDeal.company_name.replace(/\s/g, '').toLowerCase()}`],
    content_type: 'Image',
    guests_allowed: 0,
    deadline_to_apply: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    deadline_to_post: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    reference_images: [
      `https://source.unsplash.com/random/600x400/?${mockDeal.category.toLowerCase()}`,
      `https://source.unsplash.com/random/600x400/?${mockDeal.company_name.toLowerCase()}`
    ],
    reference_videos: []
  };
};

// Get all brand deals with optional filtering by category
export async function getBrandDeals(category?: string): Promise<BrandDeal[]> {
  if (useMockData) {
    // If using mock data, filter locally and apply the mapping
    console.log("Using mock data for brand deals");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    let filteredDeals = mockBrandDeals;
    
    if (category && category !== 'all') {
      // Format category to match our database (capitalize first letter)
      const formattedCategory = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      filteredDeals = mockBrandDeals.filter(deal => deal.category === formattedCategory);
    }
    
    // Map the mock data to match our application's interface
    return filteredDeals.map(mapMockToAppFormat);
  }
  
  // If not using mock data, use Supabase
  let query = supabase.from('brand_deals').select('*');
  
  if (category && category !== 'all') {
    // Format category to match our database (capitalize first letter)
    const formattedCategory = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    query = query.eq('category', formattedCategory);
  }
  
  // Sort by is_featured and then creation date
  query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching brand deals:', error);
    return [];
  }
  
  return data as BrandDeal[] || [];
}

// Get a single brand deal by id
export async function getBrandDealById(id: string): Promise<BrandDeal | null> {
  if (useMockData) {
    console.log("Using mock data for brand deal by ID");
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
    
    const mockDeal = mockBrandDeals.find(deal => deal.id === id);
    if (!mockDeal) return null;
    
    return mapMockToAppFormat(mockDeal);
  }
  
  const { data, error } = await supabase
    .from('brand_deals')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching brand deal:', error);
    return null;
  }
  
  return data as BrandDeal || null;
}

// Increment view count
export async function incrementBrandDealViews(id: string): Promise<void> {
  if (useMockData) {
    console.log("Using mock data for incrementing brand deal views");
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    const dealIndex = mockBrandDeals.findIndex(deal => deal.id === id);
    if (dealIndex >= 0) {
      mockBrandDeals[dealIndex].views += 1;
    }
    return;
  }
  
  const { error } = await supabase.rpc('increment_brand_deal_views', { deal_id: id });
  
  if (error) {
    console.error('Error incrementing brand deal views:', error);
  }
}

// Get distinct categories
export async function getBrandDealCategories(): Promise<string[]> {
  if (useMockData) {
    console.log("Using mock data for brand deal categories");
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    // Get unique categories using Set
    const categories = mockBrandDeals.map(item => item.category);
    return [...new Set(categories)];
  }
  
  const { data, error } = await supabase
    .from('brand_deals')
    .select('category');
  
  if (error) {
    console.error('Error fetching brand deal categories:', error);
    return [];
  }
  
  // Filter out duplicates and ensure we only have strings
  const categories: string[] = [];
  data?.forEach(item => {
    if (item && typeof item.category === 'string') {
      categories.push(item.category);
    }
  });
  
  return [...new Set(categories)];
}
