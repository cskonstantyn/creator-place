import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Link, useParams } from "react-router-dom";
import { Search, Utensils, Scissors, Building2, Tag, Award, Store, Briefcase, Grid, Heart } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import ListingCard from "@/components/ListingCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBrandDeals } from "@/services/brandDealService";
import Layout from "@/components/Layout";

const categories = [
  {
    id: "all",
    title: "All Categories",
    description: "Explore all brand deals",
    icon: <Grid className="h-6 w-6 text-white" />,
    color: "bg-blue-500",
    link: "/browse"
  },
  {
    id: "restaurants",
    title: "Restaurants",
    description: "Food & dining deals",
    icon: <Utensils className="h-6 w-6 text-white" />,
    color: "bg-purple-500",
    link: "/category/restaurants"
  },
  {
    id: "beauty",
    title: "Beauty",
    description: "Salons & spas",
    icon: <Scissors className="h-6 w-6 text-white" />,
    color: "bg-emerald-500",
    link: "/category/beauty"
  },
  {
    id: "sports",
    title: "Sports",
    description: "Clubs & equipment",
    icon: <Award className="h-6 w-6 text-white" />,
    color: "bg-blue-600",
    link: "/category/sports"
  },
  {
    id: "retail",
    title: "Retail",
    description: "Local stores & shops",
    icon: <Store className="h-6 w-6 text-white" />,
    color: "bg-orange-500",
    link: "/category/retail"
  },
  {
    id: "wellness",
    title: "Wellness",
    description: "Health & fitness",
    icon: <Heart className="h-6 w-6 text-white" />,
    color: "bg-cyan-400",
    link: "/category/wellness"
  },
  {
    id: "jobs",
    title: "Jobs",
    description: "Career opportunities",
    icon: <Briefcase className="h-6 w-6 text-white" />,
    color: "bg-green-500",
    link: "/category/jobs"
  }
];

const Index = () => {
  const isMobile = useIsMobile();
  const { category } = useParams<{ category: string }>();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  
  // Fetch brand deals with React Query
  const { data: brandDeals = [], isLoading } = useQuery({
    queryKey: ["indexBrandDeals", category],
    queryFn: () => getBrandDeals(category),
  });

  // Apply featured sorting
  const sortedDeals = [...brandDeals].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return 0;
  });
  
  // Limit to 8 deals for display on homepage
  const displayDeals = sortedDeals.slice(0, 8);
  
  const activeCategory = category 
    ? categories.find(cat => cat.id === category) 
    : categories[0];

  return (
    <Layout>
      <div className="min-h-screen bg-afghan-background-dark relative">
        <section className="py-6 sm:py-8 text-center bg-afghan-background-dark mt-6">
          <div className="container mx-auto px-6 sm:px-4 overflow-visible">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Find Brand Deals for Creators
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              Discover exclusive partnerships with restaurants, beauty salons, sports clubs, retail stores and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-full overflow-visible">
              <Button asChild className="bg-afghan-purple hover:bg-afghan-purple-light text-white rounded-full px-6 py-2 min-w-fit whitespace-nowrap">
                <Link to="/post-ad">Post a Deal</Link>
              </Button>
              <Button asChild variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500/10 rounded-full min-w-fit whitespace-nowrap">
                <Link to="/browse">Browse Deals</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="content-section bg-afghan-background-dark">
          <div className="container mx-auto px-6 sm:px-4">
            <div className="text-center mb-3">
              <h2 className="text-xl sm:text-2xl font-bold mb-1">
                Browse Categories
              </h2>
              <p className="text-gray-400 mb-3 max-w-2xl mx-auto text-sm">
                Find deals by category
              </p>
            </div>
            
            <div className="px-1">
              <Carousel 
                className="w-full" 
                opts={{ 
                  align: 'start', 
                  loop: false, 
                  containScroll: 'trimSnaps',
                  slidesToScroll: 1
                }}
                onScrollProgress={(api) => {
                  if (api) {
                    setActiveSlideIndex(api.selectedScrollSnap());
                  }
                }}
              >
                <CarouselContent className="-ml-2 -mr-2">
                  {categories.map((category, index) => (
                    <CarouselItem key={category.id} className="pl-2 pr-2 basis-1/3 md:basis-1/5 lg:basis-1/7">
                      <CategoryCard
                        icon={category.icon}
                        title={category.title}
                        description={category.description}
                        color={category.color}
                        link={category.link}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-2">
                  <div className="flex space-x-1">
                    {categories.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 w-4 rounded-full ${i === activeSlideIndex ? 'bg-purple-500' : 'bg-gray-700'}`}
                      />
                    ))}
                  </div>
                </div>
              </Carousel>
            </div>
          </div>
        </section>
        
        <section className="content-section pb-6 bg-afghan-background-dark">
          <div className="container mx-auto px-6 sm:px-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">
                {category ? `${activeCategory?.title}` : 'Featured Deals'}
              </h2>
              <Link to="/browse" className="text-sm text-afghan-purple hover:text-purple-400">
                View All
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-64 bg-gray-800/50 animate-pulse rounded-xl"></div>
                ))}
              </div>
            ) : displayDeals.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {displayDeals.map((deal) => (
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
            ) : (
              <div className="col-span-full text-center py-6">
                <p className="text-gray-400">No brand deals found in this category.</p>
              </div>
            )}
          </div>
        </section>

        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="scroll-to-top"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="absolute inset-0 bg-gradient-radial from-transparent to-afghan-background-dark opacity-80 pointer-events-none z-[-1]"></div>
      </div>
    </Layout>
  );
};

export default Index;
