import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronRight, Search } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import DiscountDealCard from "@/components/DiscountDealCard";
import { getBrandDeals, BrandDeal } from "@/services/brandDealService";
import { getDiscountDeals, DiscountDeal } from "@/services/discountDealService";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";

const BrowsePage = () => {
  const [brandDeals, setBrandDeals] = useState<BrandDeal[]>([]);
  const [discountDeals, setDiscountDeals] = useState<DiscountDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { category } = useParams<{ category?: string }>();
  const [activeTab, setActiveTab] = useState("brand-deals");
  const location = useLocation();

  // Parse selected category from URL
  const selectedCategory = category || "all";

  // Parse search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  useEffect(() => {
    async function fetchDeals() {
      setLoading(true);
      
      try {
        // Fetch both types of deals in parallel
        const [brandDealsData, discountDealsData] = await Promise.all([
          getBrandDeals(selectedCategory),
          getDiscountDeals(selectedCategory)
        ]);
        
        // Filter deals by search query if present
        let filteredBrandDeals = brandDealsData;
        let filteredDiscountDeals = discountDealsData;
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredBrandDeals = brandDealsData.filter(deal => 
            deal.title.toLowerCase().includes(query) || 
            deal.brand_name.toLowerCase().includes(query) ||
            deal.description.toLowerCase().includes(query) ||
            deal.category.toLowerCase().includes(query)
          );
          
          filteredDiscountDeals = discountDealsData.filter(deal => 
            deal.title.toLowerCase().includes(query) || 
            (deal.store_name && deal.store_name.toLowerCase().includes(query)) ||
            deal.description.toLowerCase().includes(query) ||
            (deal.tags && deal.tags.some(tag => tag.toLowerCase().includes(query)))
          );
        }
        
        setBrandDeals(filteredBrandDeals);
        setDiscountDeals(filteredDiscountDeals);
      } catch (error) {
        console.error("Error fetching deals:", error);
        setBrandDeals([]);
        setDiscountDeals([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDeals();
  }, [selectedCategory, searchQuery]);

  // Determine tab from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'discount-deals') {
      setActiveTab('discount-deals');
    } else {
      setActiveTab('brand-deals');
    }
  }, [location.search]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL without triggering a page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search query
    const url = new URL(window.location.href);
    if (searchQuery) {
      url.searchParams.set('q', searchQuery);
    } else {
      url.searchParams.delete('q');
    }
    window.history.pushState({}, '', url);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span>Home</span>
            <ChevronRight className="h-4 w-4" />
            <span>Browse</span>
            {selectedCategory !== "all" && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-purple-400 capitalize">
                  {selectedCategory.replace(/-/g, " ")}
                </span>
              </>
            )}
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold">
              {selectedCategory === "all"
                ? "Browse All Deals"
                : `Browse ${selectedCategory.replace(/-/g, " ")} Deals`}
            </h1>
            
            <form onSubmit={handleSearch} className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search deals..."
                className="pl-10 pr-4 py-2 rounded-lg bg-afghan-background-dark border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 max-w-md gap-2">
            <TabsTrigger value="brand-deals" className="text-base">
              Brand Deals {brandDeals.length > 0 && `(${brandDeals.length})`}
            </TabsTrigger>
            <TabsTrigger value="discount-deals" className="text-base">
              Discount Deals {discountDeals.length > 0 && `(${discountDeals.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="brand-deals">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="h-72 rounded-xl bg-gray-800/50 animate-pulse"
                  />
                ))}
              </div>
            ) : brandDeals.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">No brand deals found</h3>
                <p className="text-gray-400 mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.` 
                    : "Try selecting a different category or check back later!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {brandDeals.map((deal) => (
                  <ListingCard 
                    key={deal.id} 
                    id={deal.id}
                    title={deal.title}
                    price={deal.price}
                    location={deal.location}
                    imageUrl={deal.image_url}
                    category={deal.category}
                    isFeatured={deal.is_featured}
                    createdAt={deal.created_at}
                    dealValue={deal.deal_value}
                    brandName={deal.brand_name}
                    expires={deal.expires}
                    views={deal.views}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="discount-deals">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="h-72 rounded-xl bg-gray-800/50 animate-pulse"
                  />
                ))}
              </div>
            ) : discountDeals.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">No discount deals found</h3>
                <p className="text-gray-400 mt-2">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.` 
                    : "Try selecting a different category or check back later!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {discountDeals.map((deal) => (
                  <DiscountDealCard key={deal.id} deal={deal} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BrowsePage;
