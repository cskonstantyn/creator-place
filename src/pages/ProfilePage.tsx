import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, MapPin, Instagram, Twitter, Globe, LogOut, Heart, Tag, Settings, ShoppingBag, Loader2, ExternalLink, Handshake, Percent, Scan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import { supabase } from "@/lib/supabase/client";
import { PurchasedDeals } from "@/components/profile/PurchasedDeals";
import { QrCodeScanner } from "@/components/profile/QrCodeScanner";

// Simple Brand Deal Card component
const SimpleBrandDealCard = ({ 
  deal, 
  isFavorite, 
  onToggleFavorite 
}: { 
  deal: any; 
  isFavorite: boolean; 
  onToggleFavorite: () => void;
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden border border-white/10 hover:border-white/20 transition-all">
      <div className="relative">
        <img 
          src={deal.image_url || "https://placehold.co/600x400/252538/FFFFFF/png?text=Brand+Deal"} 
          alt={deal.title} 
          className="w-full h-48 object-cover"
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-2 right-2 p-2 bg-black/50 rounded-full"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
        </button>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{deal.title}</CardTitle>
        </div>
        <CardDescription>{deal.brand_name}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            {deal.category}
          </Badge>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            {deal.platform}
          </Badge>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{deal.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="text-sm">
          <span className="text-purple-400 font-bold">${deal.price || deal.deal_value}</span>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => navigate(`/brand-deal/${deal.id}`)}
          className="flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          <span>View Deal</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Simple Discount Deal Card component
const SimpleDiscountDealCard = ({ 
  deal, 
  isFavorite, 
  onToggleFavorite 
}: { 
  deal: any; 
  isFavorite: boolean; 
  onToggleFavorite: () => void;
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden border border-white/10 hover:border-white/20 transition-all">
      <div className="relative">
        <img 
          src={deal.image_url || "https://placehold.co/600x400/252538/FFFFFF/png?text=Discount+Deal"} 
          alt={deal.title} 
          className="w-full h-48 object-cover"
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-2 right-2 p-2 bg-black/50 rounded-full"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
        </button>
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-bold">
          {deal.discount_percentage}% OFF
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{deal.title}</CardTitle>
        </div>
        <CardDescription>{deal.store_name || deal.brand_name}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            {deal.category}
          </Badge>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            {deal.location}
          </Badge>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{deal.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="text-sm">
          <span className="text-gray-400 line-through mr-2">${deal.original_price}</span>
          <span className="text-green-400 font-bold">${deal.discounted_price}</span>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => navigate(`/discount-deal/${deal.id}`)}
          className="flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          <span>View Deal</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio?: string;
  location?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const navigate = useNavigate();
  const locationState = useLocation();
  const { favorites, isLoading: favoritesLoading, isFavorite, toggleFavorite } = useFavorites();
  const [brandDeals, setBrandDeals] = useState<any[]>([]);
  const [discountDeals, setDiscountDeals] = useState<any[]>([]);
  const [isFetchingDeals, setIsFetchingDeals] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser) as UserProfile;
      setUser(userData);
      
      // Initialize form state
      setName(userData.name || "");
      setBio(userData.bio || "");
      setLocation(userData.location || "");
      setWebsite(userData.website || "");
      setInstagram(userData.instagram || "");
      setTwitter(userData.twitter || "");
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      name,
      bio,
      location,
      website,
      instagram,
      twitter,
    };
    
    // In a real app, this would be an API call to update the user profile
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  // Effect to fetch favorite deals when active tab is favorites or deals
  useEffect(() => {
    // Skip if favorites are still loading
    if (favoritesLoading || activeTab !== 'favorites') {
      return;
    }
    
    setIsFetchingDeals(true);
    
    const fetchFavoriteItems = async () => {
      try {
        // Check if we're in mock mode
        const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
        
        console.log('Favorites from hook:', favorites);
        
        // Extract IDs for brand deals and discount deals
        const brandDealFavorites = favorites.filter(fav => fav.type === 'brand-deal');
        const discountDealFavorites = favorites.filter(fav => fav.type === 'discount-deal');
        
        const brandDealIds = brandDealFavorites.map(fav => fav.id);
        const discountDealIds = discountDealFavorites.map(fav => fav.id);
        
        console.log('Brand Deal Favorites:', brandDealFavorites);
        console.log('Brand Deal IDs:', brandDealIds);
        console.log('Discount Deal Favorites:', discountDealFavorites);
        console.log('Discount Deal IDs:', discountDealIds);
        
        if (useMockData) {
          // In mock mode, generate mock data for favorites
          console.log("Using mock data for favorites");
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Generate mock brand deals
          if (brandDealIds.length > 0) {
            // Import mock deals from data
            import('../mockData/deals').then(({ mockBrandDeals }) => {
              // Filter to only include favorited deals
              const filteredDeals = mockBrandDeals.filter(deal => 
                brandDealIds.includes(deal.id)
              );
              
              console.log('Mock Brand Deals:', filteredDeals);
              setBrandDeals(filteredDeals || []);
            });
          } else {
            setBrandDeals([]);
          }
          
          // Generate mock discount deals
          if (discountDealIds.length > 0) {
            // Import mock deals from data
            import('../mockData/deals').then(({ mockDiscountDeals }) => {
              // Filter to only include favorited deals
              const filteredDeals = mockDiscountDeals.filter(deal => 
                discountDealIds.includes(deal.id)
              );
              
              console.log('Mock Discount Deals:', filteredDeals);
              setDiscountDeals(filteredDeals || []);
            });
          } else {
            setDiscountDeals([]);
          }
        } else {
          // Use Supabase in non-mock mode
          // Fetch brand deals if there are any favorites
          if (brandDealIds.length > 0) {
            const { data: brandDealsData, error: brandDealsError } = await supabase
              .from('brand_deals')
              .select('*')
              .in('id', brandDealIds);
            
            if (brandDealsError) {
              console.error('Error fetching brand deals:', brandDealsError);
            } else {
              console.log('Fetched Brand Deals:', brandDealsData);
              setBrandDeals(brandDealsData || []);
            }
          } else {
            setBrandDeals([]);
          }
          
          // Fetch discount deals if there are any favorites
          if (discountDealIds.length > 0) {
            const { data: discountDealsData, error: discountDealsError } = await supabase
              .from('discount_deals')
              .select('*')
              .in('id', discountDealIds);
            
            if (discountDealsError) {
              console.error('Error fetching discount deals:', discountDealsError);
            } else {
              console.log('Fetched Discount Deals:', discountDealsData);
              setDiscountDeals(discountDealsData || []);
            }
          } else {
            setDiscountDeals([]);
          }
        }
      } catch (error) {
        console.error('Error fetching favorite items:', error);
      } finally {
        setIsFetchingDeals(false);
      }
    };
    
    fetchFavoriteItems();
  }, [activeTab, favorites, favoritesLoading]);

  const handleToggleFavorite = (id: string, type: 'brand-deal' | 'discount-deal', title: string, imageUrl?: string) => {
    console.log('Toggle favorite called with:', { id, type, title, imageUrl });
    
    const favoriteItem = {
      id,
      type,
      title,
      imageUrl,
      createdAt: new Date().toISOString()
    };
    
    console.log('Created favorite item:', favoriteItem);
    toggleFavorite(favoriteItem);
    // Refresh the UI after toggling the favorite
    setTimeout(() => {
      if (type === 'brand-deal') {
        setBrandDeals(prev => prev.filter(deal => deal.id !== id));
      } else {
        setDiscountDeals(prev => prev.filter(deal => deal.id !== id));
      }
    }, 100);
  };

  // Set active tab from navigation state
  useEffect(() => {
    // Check if there's an activeTab in the location state (coming from another page)
    if (locationState.state && locationState.state.activeTab) {
      setActiveTab(locationState.state.activeTab);
    }
  }, [locationState.state]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Not logged in</h1>
            <p className="text-gray-400 mb-6">Please log in to view your profile</p>
            <Button onClick={() => navigate("/login")}>Log In</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card className="glassmorphism">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.bio && (
                    <p className="text-sm text-gray-400">{user.bio}</p>
                  )}
                  
                  <div className="space-y-2">
                    {user.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    
                    {user.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Globe className="h-4 w-4" />
                        <a 
                          href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-purple-400 transition-colors"
                        >
                          {user.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    
                    {user.instagram && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Instagram className="h-4 w-4" />
                        <a 
                          href={`https://instagram.com/${user.instagram.replace('@', '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-purple-400 transition-colors"
                        >
                          {user.instagram}
                        </a>
                      </div>
                    )}
                    
                    {user.twitter && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Twitter className="h-4 w-4" />
                        <a 
                          href={`https://twitter.com/${user.twitter.replace('@', '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-purple-400 transition-colors"
                        >
                          {user.twitter}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="w-full md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="glassmorphism w-full mb-6">
                <TabsTrigger value="profile" className="flex-1">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="deals" className="flex-1">
                  <Tag className="h-4 w-4 mr-2" />
                  My Deals
                </TabsTrigger>
                <TabsTrigger value="purchases" className="flex-1">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Purchases
                </TabsTrigger>
                <TabsTrigger value="scanner" className="flex-1">
                  <Scan className="h-4 w-4 mr-2" />
                  Scanner
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your profile information
                      </CardDescription>
                    </div>
                    <Button 
                      variant={isEditing ? "default" : "outline"} 
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    >
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            placeholder="Your name"
                            className="pl-10"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={user.email}
                            className="pl-10"
                            disabled
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          placeholder="Tell us about yourself"
                          className="w-full h-24 px-4 py-2 rounded-lg bg-afghan-background-dark border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none resize-none"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="location"
                            placeholder="City, Country"
                            className="pl-10"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="website"
                            placeholder="https://yourwebsite.com"
                            className="pl-10"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram</Label>
                          <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="instagram"
                              placeholder="@username"
                              className="pl-10"
                              value={instagram}
                              onChange={(e) => setInstagram(e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter</Label>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="twitter"
                              placeholder="@username"
                              className="pl-10"
                              value={twitter}
                              onChange={(e) => setTwitter(e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="favorites" className="space-y-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <CardTitle>Favorites</CardTitle>
                    <CardDescription>
                      Deals and discounts you've saved
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {favoritesLoading || isFetchingDeals ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                        <span className="ml-2">Loading your favorites...</span>
                      </div>
                    ) : favorites.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
                        <p className="text-gray-400 mb-6">
                          Save deals and discounts to access them quickly later
                        </p>
                        <Button onClick={() => navigate("/browse")}>
                          Browse Deals
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Brand Deals section */}
                        {favorites.filter(fav => fav.type === 'brand-deal').length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                              <Handshake className="h-5 w-5 mr-2 text-purple-400" />
                              Brand Deals
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {favorites.filter(fav => fav.type === 'brand-deal').map(fav => (
                                <Card key={fav.id} className="overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                                  <div className="relative">
                                    <img 
                                      src={fav.imageUrl || "https://placehold.co/600x400/252538/FFFFFF/png?text=Brand+Deal"} 
                                      alt={fav.title} 
                                      className="w-full h-48 object-cover"
                                    />
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleFavorite(fav.id, fav.type, fav.title, fav.imageUrl);
                                      }}
                                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-full"
                                    >
                                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                    </button>
                                  </div>
                                  
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                      <CardTitle className="text-lg">{fav.title}</CardTitle>
                                    </div>
                                  </CardHeader>
                                  
                                  <CardContent className="pb-2">
                                    <p className="text-sm text-gray-400">Added on {new Date(fav.createdAt).toLocaleDateString()}</p>
                                  </CardContent>
                                  
                                  <CardFooter className="flex justify-between pt-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => navigate(`/brand-deal/${fav.id}`)}
                                      className="flex items-center gap-1 ml-auto"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      <span>View Deal</span>
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Discount Deals section */}
                        {favorites.filter(fav => fav.type === 'discount-deal').length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                              <Percent className="h-5 w-5 mr-2 text-green-400" />
                              Discount Deals
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {favorites.filter(fav => fav.type === 'discount-deal').map(fav => (
                                <Card key={fav.id} className="overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                                  <div className="relative">
                                    <img 
                                      src={fav.imageUrl || "https://placehold.co/600x400/252538/FFFFFF/png?text=Discount+Deal"} 
                                      alt={fav.title} 
                                      className="w-full h-48 object-cover"
                                    />
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleFavorite(fav.id, fav.type, fav.title, fav.imageUrl);
                                      }}
                                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-full"
                                    >
                                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                    </button>
                                  </div>
                                  
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                      <CardTitle className="text-lg">{fav.title}</CardTitle>
                                    </div>
                                  </CardHeader>
                                  
                                  <CardContent className="pb-2">
                                    <p className="text-sm text-gray-400">Added on {new Date(fav.createdAt).toLocaleDateString()}</p>
                                  </CardContent>
                                  
                                  <CardFooter className="flex justify-between pt-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => navigate(`/discount-deal/${fav.id}`)}
                                      className="flex items-center gap-1 ml-auto"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      <span>View Deal</span>
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="deals" className="space-y-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <CardTitle>My Deals</CardTitle>
                    <CardDescription>
                      Discount deals you've saved
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {favoritesLoading || isFetchingDeals ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                        <span className="ml-2">Loading your deals...</span>
                      </div>
                    ) : favorites.filter(fav => fav.type === 'discount-deal').length === 0 ? (
                      <div className="text-center py-12">
                        <Tag className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No deals yet</h3>
                        <p className="text-gray-400 mb-6">
                          Save discount deals to access them quickly here
                        </p>
                        <Button onClick={() => navigate("/browse")}>
                          Browse Deals
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Discount Deals section */}
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <Percent className="h-5 w-5 mr-2 text-green-400" />
                            Discount Deals
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favorites.filter(fav => fav.type === 'discount-deal').map(fav => (
                              <Card key={fav.id} className="overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                                <div className="relative">
                                  <img 
                                    src={fav.imageUrl || "https://placehold.co/600x400/252538/FFFFFF/png?text=Discount+Deal"} 
                                    alt={fav.title} 
                                    className="w-full h-48 object-cover"
                                  />
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleFavorite(fav.id, fav.type, fav.title, fav.imageUrl);
                                    }}
                                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full"
                                  >
                                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                  </button>
                                </div>
                                
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{fav.title}</CardTitle>
                                  </div>
                                </CardHeader>
                                
                                <CardContent className="pb-2">
                                  <p className="text-sm text-gray-400">Added on {new Date(fav.createdAt).toLocaleDateString()}</p>
                                </CardContent>
                                
                                <CardFooter className="flex justify-between pt-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => navigate(`/discount-deal/${fav.id}`)}
                                    className="flex items-center gap-1 ml-auto"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>View Deal</span>
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="purchases" className="space-y-6">
                <PurchasedDeals />
              </TabsContent>
              
              <TabsContent value="scanner" className="space-y-6">
                <QrCodeScanner />
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
                        <p className="text-gray-400 mb-4">
                          Manage your email notification preferences
                        </p>
                        <div className="space-y-2">
                          {/* Notification settings would go here */}
                          <p className="text-gray-400">
                            Notification settings coming soon
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Password</h3>
                        <p className="text-gray-400 mb-4">
                          Change your password
                        </p>
                        <Button variant="outline">
                          Change Password
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2 text-red-500">Danger Zone</h3>
                        <p className="text-gray-400 mb-4">
                          Permanently delete your account and all your data
                        </p>
                        <Button variant="destructive">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
