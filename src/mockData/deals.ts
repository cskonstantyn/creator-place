import { v4 as uuidv4 } from 'uuid';

export interface BrandDeal {
  id: string;
  title: string;
  description: string;
  company_name: string;
  requirements: string;
  compensation: string;
  application_url: string;
  contact_email: string;
  views: number;
  is_active: boolean;
  category: string;
  created_at: string;
  updated_at: string;
  price: number;
  location: string;
  image_url: string;
  is_featured: boolean;
}

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
  price: number;
  location: string;
  image_url: string;
  is_featured: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  company_name: string;
  category: string;
  created_at: string;
  views: number;
  favorites_count: number;
  deal_type: 'brand_deal' | 'discount_deal';
  deal_details: any;
}

// Generate random dates within the last year
const randomDate = () => {
  const now = new Date();
  const pastDate = new Date(
    now.getFullYear() - 1,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  );
  const randomDate = new Date(
    pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime())
  );
  return randomDate.toISOString();
};

// Mock data for brand deals
export const mockBrandDeals: BrandDeal[] = [
  {
    id: uuidv4(),
    title: 'Instagram Promotion for Tech Gadgets',
    description: 'Looking for tech influencers to promote our latest smart home devices.',
    company_name: 'TechWave',
    requirements: 'Minimum 5k followers, tech niche preferred',
    compensation: '$200-$500 depending on engagement',
    application_url: 'https://example.com/apply',
    contact_email: 'partners@techwave.com',
    views: 1245,
    is_active: true,
    category: 'Technology',
    created_at: randomDate(),
    updated_at: randomDate(),
    price: 300,
    location: 'Remote',
    image_url: 'https://source.unsplash.com/random/300x300/?tech,gadgets',
    is_featured: true
  },
  {
    id: uuidv4(),
    title: 'YouTube Review for Fitness Products',
    description: 'Seeking fitness YouTubers to review our new line of home workout equipment.',
    company_name: 'FitLife',
    requirements: 'Minimum 10k subscribers, fitness or health niche',
    compensation: '$300-$800 plus free products',
    application_url: 'https://fitlife.com/creators',
    contact_email: 'creator@fitlife.com',
    views: 789,
    is_active: true,
    category: 'Fitness',
    created_at: randomDate(),
    updated_at: randomDate(),
    price: 500,
    location: 'New York',
    image_url: 'https://source.unsplash.com/random/300x300/?fitness,workout',
    is_featured: false
  },
  {
    id: uuidv4(),
    title: 'Food Blog Content Partnership',
    description: 'Looking for food bloggers to create recipes using our organic ingredients.',
    company_name: 'NatureHarvest',
    requirements: 'Food blog with minimum 3k monthly visitors',
    compensation: '$150 per post plus ingredient supply',
    application_url: 'https://natureharvest.com/bloggers',
    contact_email: 'partnerships@natureharvest.com',
    views: 567,
    is_active: true,
    category: 'Food',
    created_at: randomDate(),
    updated_at: randomDate(),
    price: 150,
    location: 'Los Angeles',
    image_url: 'https://source.unsplash.com/random/300x300/?food,organic',
    is_featured: false
  },
  {
    id: uuidv4(),
    title: 'Gaming Stream Sponsorship',
    description: 'Sponsor opportunity for streamers to feature our gaming peripherals.',
    company_name: 'GameEdge',
    requirements: 'Active gaming streamers with 2k+ followers',
    compensation: '$100-$300 per stream depending on viewership',
    application_url: 'https://gameedge.com/streamers',
    contact_email: 'sponsors@gameedge.com',
    views: 912,
    is_active: true,
    category: 'Gaming',
    created_at: randomDate(),
    updated_at: randomDate(),
    price: 200,
    location: 'Remote',
    image_url: 'https://source.unsplash.com/random/300x300/?gaming,esports',
    is_featured: true
  },
  {
    id: uuidv4(),
    title: 'Fashion Instagram Partnership',
    description: 'Fashion brand looking for influencers to showcase our summer collection.',
    company_name: 'StyleVista',
    requirements: 'Fashion influencers with 8k+ followers and good engagement',
    compensation: '$250-$600 plus free clothing items',
    application_url: 'https://stylevista.com/partner',
    contact_email: 'influencers@stylevista.com',
    views: 1578,
    is_active: true,
    category: 'Fashion',
    created_at: randomDate(),
    updated_at: randomDate(),
    price: 400,
    location: 'Miami',
    image_url: 'https://source.unsplash.com/random/300x300/?fashion,model',
    is_featured: false
  }
];

// Mock data for discount deals
export const mockDiscountDeals: DiscountDeal[] = [
  {
    id: uuidv4(),
    title: '25% Off Premium Editing Software',
    description: 'Exclusive discount on our video editing suite for content creators.',
    company_name: 'EditPro',
    discount_code: 'CREATOR25',
    discount_percentage: 25,
    discount_flat_amount: null,
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    terms_conditions: 'Valid for new and existing customers. Cannot be combined with other offers.',
    product_url: 'https://editpro.com/creator-deal',
    views: 870,
    is_active: true,
    category: 'Software',
    created_at: randomDate(),
    updated_at: randomDate(),
    price: 75,
    location: 'Online',
    image_url: 'https://source.unsplash.com/random/300x300/?software,editing',
    is_featured: true
  },
  {
    id: uuidv4(),
    title: '$50 Off Camera Equipment',
    description: 'Special discount on selected camera accessories for creators.',
    company_name: 'CameraPro',
    discount_code: 'VLOGGER50',
    discount_percentage: 0,
    discount_flat_amount: 50,
    expiry_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    terms_conditions: 'Minimum purchase of $200 required. One use per customer.',
    product_url: 'https://camerapro.com/accessories',
    views: 654,
    is_active: true,
    category: 'Photography',
    created_at: randomDate(),
    updated_at: randomDate(),
    price: 50,
    location: 'San Francisco',
    image_url: 'https://source.unsplash.com/random/300x300/?camera,photography',
    is_featured: false
  },
  {
    id: uuidv4(),
    title: '30% Off Lighting Equipment',
    description: 'Professional lighting kits for streamers and video creators.',
    company_name: 'LightMaster',
    discount_code: 'STREAM30',
    discount_percentage: 30,
    discount_flat_amount: null,
    expiry_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    terms_conditions: 'Valid on selected products only. While supplies last.',
    product_url: 'https://lightmaster.com/creator-kits',
    views: 723,
    is_active: true,
    category: 'Equipment',
    created_at: randomDate(),
    updated_at: randomDate(),
    price: 90,
    location: 'Chicago',
    image_url: 'https://source.unsplash.com/random/300x300/?lighting,studio',
    is_featured: false
  },
  {
    id: uuidv4(),
    title: '20% Off Social Media Management Tools',
    description: 'Discount on our premium social media scheduling and analytics platform.',
    company_name: 'SocialPro',
    discount_code: 'CREATOR20',
    discount_percentage: 20,
    discount_flat_amount: null,
    expiry_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    terms_conditions: 'Valid for all subscription plans. 3-month minimum subscription required.',
    product_url: 'https://socialpro.com/pricing',
    views: 892,
    is_active: true,
    category: 'Software',
    created_at: randomDate(),
    updated_at: randomDate(),
    price: 40,
    location: 'Online',
    image_url: 'https://source.unsplash.com/random/300x300/?social,media',
    is_featured: true
  },
  {
    id: uuidv4(),
    title: '40% Off First Month of Website Hosting',
    description: 'Special hosting package for creator portfolios and blogs.',
    company_name: 'CreatorHost',
    discount_code: 'PORTFOLIO40',
    discount_percentage: 40,
    discount_flat_amount: null,
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    terms_conditions: 'New customers only. Regular price applies after first month.',
    product_url: 'https://creatorhost.com/creator-plan',
    views: 512,
    is_active: true,
    category: 'Web Services',
    created_at: randomDate(),
    updated_at: randomDate(),
    price: 30,
    location: 'Online',
    image_url: 'https://source.unsplash.com/random/300x300/?website,hosting',
    is_featured: false
  }
];

// Mock function to search deals
export const searchDeals = (
  searchTerm?: string,
  categories?: string[],
  dealType?: 'brand_deal' | 'discount_deal',
  limit: number = 10
): SearchResult[] => {
  let results: SearchResult[] = [];
  
  // Filter brand deals
  if (!dealType || dealType === 'brand_deal') {
    const filteredBrandDeals = mockBrandDeals
      .filter(deal => {
        // Filter by search term
        if (searchTerm && !deal.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !deal.description.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !deal.company_name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // Filter by categories
        if (categories && categories.length > 0 && !categories.includes(deal.category)) {
          return false;
        }
        
        return true;
      })
      .map(deal => ({
        id: deal.id,
        title: deal.title,
        description: deal.description,
        company_name: deal.company_name,
        category: deal.category,
        created_at: deal.created_at,
        views: deal.views,
        favorites_count: Math.floor(Math.random() * 50),
        deal_type: 'brand_deal' as const,
        deal_details: {
          compensation: deal.compensation,
          requirements: deal.requirements,
          application_url: deal.application_url,
          contact_email: deal.contact_email
        }
      }));
    
    results = [...results, ...filteredBrandDeals];
  }
  
  // Filter discount deals
  if (!dealType || dealType === 'discount_deal') {
    const filteredDiscountDeals = mockDiscountDeals
      .filter(deal => {
        // Filter by search term
        if (searchTerm && !deal.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !deal.description.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !deal.company_name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // Filter by categories
        if (categories && categories.length > 0 && !categories.includes(deal.category)) {
          return false;
        }
        
        return true;
      })
      .map(deal => ({
        id: deal.id,
        title: deal.title,
        description: deal.description,
        company_name: deal.company_name,
        category: deal.category,
        created_at: deal.created_at,
        views: deal.views,
        favorites_count: Math.floor(Math.random() * 50),
        deal_type: 'discount_deal' as const,
        deal_details: {
          discount_code: deal.discount_code,
          discount_percentage: deal.discount_percentage,
          discount_flat_amount: deal.discount_flat_amount,
          expiry_date: deal.expiry_date,
          terms_conditions: deal.terms_conditions,
          product_url: deal.product_url
        }
      }));
    
    results = [...results, ...filteredDiscountDeals];
  }
  
  // Sort by created_at descending (newest first)
  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  // Apply limit
  return results.slice(0, limit);
}; 