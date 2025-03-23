import { useEffect } from "react";
import CategoryCard from "@/components/CategoryCard";
import ListingCard from "@/components/ListingCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Search, Users, Award, Percent, QrCode, Handshake, Check, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

// Add more categories for better browsing
const categories = [
  {
    id: "all",
    title: "All Opportunities",
    description: "Browse all brand deals & discounts",
    icon: <Award className="h-5 w-5 text-white" />,
    color: "bg-blue-600",
    link: "/browse"
  },
  {
    id: "brand-deals",
    title: "Brand Deals",
    description: "Collaborate with brands",
    icon: <Handshake className="h-5 w-5 text-white" />,
    color: "bg-purple-600",
    link: "/category/brand-deals"
  },
  {
    id: "discount-deals",
    title: "Discount Deals",
    description: "Exclusive creator discounts",
    icon: <Percent className="h-5 w-5 text-white" />,
    color: "bg-emerald-600",
    link: "/category/discount-deals"
  },
  {
    id: "events",
    title: "Events",
    description: "Special creator events",
    icon: <Users className="h-5 w-5 text-white" />,
    color: "bg-amber-600",
    link: "/category/events"
  },
  {
    id: "restaurants",
    title: "Restaurants",
    description: "Food & dining deals",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>,
    color: "bg-red-600",
    link: "/category/restaurants"
  },
  {
    id: "beauty",
    title: "Beauty",
    description: "Cosmetics & skincare",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M8 3h8a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"></path><path d="M16 10c0 2.5-4 2.5-4 5m-4-3v3m8 0v-3M6 10h12M6 19v-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"></path></svg>,
    color: "bg-pink-600",
    link: "/category/beauty"
  },
  {
    id: "sports",
    title: "Sports",
    description: "Athletic gear & events",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path><circle cx="12" cy="12" r="4"></circle></svg>,
    color: "bg-green-600",
    link: "/category/sports"
  },
  {
    id: "retail",
    title: "Retail",
    description: "Shopping & merchandise",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>,
    color: "bg-indigo-600",
    link: "/category/retail"
  },
  {
    id: "tech",
    title: "Technology",
    description: "Gadgets & software",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>,
    color: "bg-cyan-600",
    link: "/category/tech"
  },
  {
    id: "travel",
    title: "Travel",
    description: "Hotels & destinations",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M20.38 3.46 16 2a4 4 0 0 1 1.46 3.46c0 .56-.22 1.1-.6 1.5L4 20.5 6 22l13.5-13.5c.4-.4.94-.6 1.5-.6A4 4 0 0 1 22 16l-1.5-4.38"></path></svg>,
    color: "bg-blue-500",
    link: "/category/travel"
  }
];

// Mock featured deals
const featuredListings = [
  {
    id: "1",
    title: "50% Off Premium Menu",
    price: 250,
    location: "Kabul",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    category: "Discount Deal",
    isFeatured: true,
    createdAt: "2023-09-05T10:30:00Z",
    dealValue: "$500",
    brandName: "Golden Palace Restaurant",
    expires: "Dec 31, 2023",
    views: 7
  },
  {
    id: "2",
    title: "Beauty Brand Ambassador",
    price: 500,
    location: "Kabul",
    imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    category: "Brand Deal",
    isFeatured: true,
    createdAt: "2023-09-06T14:20:00Z",
    dealValue: "$1000",
    brandName: "Glamour Beauty",
    expires: "Nov 30, 2023",
    views: 6
  },
  {
    id: "3",
    title: "Sports Promotion Deal",
    price: 750,
    location: "Kabul",
    imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    category: "Brand Deal",
    isFeatured: true,
    createdAt: "2023-09-07T09:15:00Z",
    dealValue: "$1500",
    brandName: "Eagle Sports",
    expires: "Jan 15, 2024",
    views: 4
  },
  {
    id: "4",
    title: "Restaurant Discount Code",
    price: 100,
    location: "Kabul",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    category: "Discount Deal",
    isFeatured: true,
    createdAt: "2023-09-09T11:20:00Z",
    dealValue: "$200",
    brandName: "Spice Route",
    expires: "Dec 10, 2023",
    views: 7
  }
];

const HomePage = () => {
  useEffect(() => {
    document.title = "CreatorDeals - Connect with Brands";
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero Section - Creator Focused */}
      <section className="bg-afghan-gradient min-h-[90vh] flex items-center justify-center pt-16 relative" id="home">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Connect <span className="gradient-text">Creators</span> with <span className="gradient-text">Brands</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Find exclusive brand deals and discounts for content creators and influencers
          </p>
          
          {/* Search Section */}
          <div className="max-w-2xl mx-auto bg-black/30 backdrop-blur-md rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for brand deals or discounts..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-afghan-background-dark border border-white/10 focus:outline-none focus:ring-2 focus:ring-afghan-purple"
                />
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 px-6 rounded-lg font-medium">
                Search
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonLink 
              to="/browse" 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium"
            >
              Browse Deals
            </ButtonLink>
            <ButtonLink 
              to="/post-ad" 
              className="border border-white/20 bg-black/20 hover:bg-black/30 text-white px-8 py-3 rounded-full text-lg font-medium"
            >
              Post a Deal
            </ButtonLink>
          </div>
          
          <div className="mt-12">
            <a href="#how-it-works" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
              <span>Learn how it works</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m6 9 6 6 6-6"></path></svg>
            </a>
          </div>
        </div>
      </section>
      
      {/* Category Browsing Section */}
      <section className="py-16 bg-afghan-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Browse Categories</h2>
            <Link to="/browse" className="text-sm text-afghan-purple hover:text-purple-400 underline flex items-center gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          
          <div className="relative">
            {/* Category Slider */}
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex gap-4 min-w-max">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    icon={category.icon}
                    title={category.title}
                    description={category.description}
                    color={category.color}
                    link={category.link}
                  />
                ))}
              </div>
            </div>
            
            {/* Gradient overlays to indicate scrolling */}
            <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-afghan-background to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-afghan-background to-transparent pointer-events-none"></div>
          </div>
          
          {/* Replace the style jsx tag with a className approach */}
          <div className="hide-scrollbar-container">
            <style>
              {`
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .hide-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}
            </style>
          </div>
        </div>
      </section>
      
      {/* How It Works Section - For Creators */}
      <section id="how-it-works" className="py-16 bg-afghan-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            For <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Creators</span>
          </h2>
          <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
            How to find and redeem deals as a content creator or influencer
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-afghan-background-dark p-6 rounded-xl border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold">1</div>
                <h3 className="text-xl font-medium">Browse Deals</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Explore different brands and discount deals tailored for creators. Filter by category, location, or deal value.
              </p>
              <div className="flex justify-center">
                <Search className="h-10 w-10 text-purple-500 opacity-60" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-afghan-background-dark p-6 rounded-xl border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold">2</div>
                <h3 className="text-xl font-medium">Apply or Purchase</h3>
              </div>
              <p className="text-gray-400 mb-4">
                For discount deals, purchase directly. For brand deals, apply and wait for brand approval before proceeding.
              </p>
              <div className="flex justify-center">
                <Handshake className="h-10 w-10 text-purple-500 opacity-60" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-afghan-background-dark p-6 rounded-xl border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold">3</div>
                <h3 className="text-xl font-medium">Redeem with QR</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Once approved, scan the QR code at the venue to redeem your deal, receive products, or access exclusive events.
              </p>
              <div className="flex justify-center">
                <QrCode className="h-10 w-10 text-purple-500 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section - For Brands */}
      <section className="py-16 bg-afghan-background-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            For <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Brands</span>
          </h2>
          <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
            How to advertise your brand and connect with content creators
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-afghan-background p-6 rounded-xl border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold">1</div>
                <h3 className="text-xl font-medium">Post Your Deal</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Create a brand deal or discount code listing. Use our brief generator to craft the perfect creator partnership.
              </p>
              <div className="flex justify-center">
                <Award className="h-10 w-10 text-purple-500 opacity-60" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-afghan-background p-6 rounded-xl border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold">2</div>
                <h3 className="text-xl font-medium">Review Applications</h3>
              </div>
              <p className="text-gray-400 mb-4">
                For brand deals, review creator applications and choose the perfect match for your campaign or event.
              </p>
              <div className="flex justify-center">
                <Check className="h-10 w-10 text-purple-500 opacity-60" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-afghan-background p-6 rounded-xl border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold">3</div>
                <h3 className="text-xl font-medium">Track Performance</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Use our dashboard to track redemptions, visits, and the overall performance of your brand partnerships.
              </p>
              <div className="flex justify-center">
                <Users className="h-10 w-10 text-purple-500 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Listings Section */}
      <section className="py-16 bg-afghan-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Deals</h2>
            <Link to="/browse" className="text-sm text-afghan-purple hover:text-purple-400 underline flex items-center gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                location={listing.location}
                imageUrl={listing.imageUrl}
                category={listing.category}
                isFeatured={listing.isFeatured}
                createdAt={listing.createdAt}
                dealValue={listing.dealValue}
                brandName={listing.brandName}
                expires={listing.expires}
                views={listing.views}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-afghan-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to grow your influence?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and brands connecting on our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonLink 
              to="/register" 
              className="bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 text-white px-8 py-3 rounded-full text-lg font-medium"
            >
              Join as Creator
            </ButtonLink>
            <ButtonLink 
              to="/register-brand" 
              className="bg-purple-700/50 hover:bg-purple-700/70 backdrop-blur-sm border border-white/10 text-white px-8 py-3 rounded-full text-lg font-medium"
            >
              Register Brand
            </ButtonLink>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
