import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { QRCode } from "@/components/ui/qr-code";
import { CheckCircle, Clock, AlertCircle, Tag, Store, Calendar, QrCode, ArrowRight } from "lucide-react";
import { format } from 'date-fns';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

// Define types for purchased deals
export interface PurchasedDeal {
  id: string;
  discount_deal_id: string;
  user_id: string;
  purchase_date: string;
  expiry_date: string;
  status: 'redeemed' | 'unredeemed' | 'expired';
  redemption_date?: string;
  title: string;
  description: string;
  discount_value: string;
  brand_name: string;
  store_name?: string;
  coupon_code: string;
  image_url?: string;
  tags?: string[];
}

export function PurchasedDeals() {
  const [activeTab, setActiveTab] = useState<string>('unredeemed');
  const [purchasedDeals, setPurchasedDeals] = useState<PurchasedDeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDeal, setSelectedDeal] = useState<PurchasedDeal | null>(null);
  const [qrSheetOpen, setQrSheetOpen] = useState<boolean>(false);

  // Get mock data flag
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

  // Filter deals based on active tab
  const filteredDeals = useMemo(() => {
    return purchasedDeals.filter(deal => deal.status === activeTab);
  }, [purchasedDeals, activeTab]);

  // Fetch purchased deals from Supabase or mock data
  useEffect(() => {
    async function fetchPurchasedDeals() {
      setLoading(true);
      
      if (useMockData) {
        // Get mock data from localStorage if available, or generate new mock data
        const storedPurchases = localStorage.getItem('purchasedDeals');
        
        if (storedPurchases) {
          try {
            const parsedPurchases = JSON.parse(storedPurchases);
            // Process the deals - check for expired items
            const now = new Date();
            const processedDeals = parsedPurchases.map((deal: PurchasedDeal) => {
              const expiryDate = new Date(deal.expiry_date);
              if (expiryDate < now && deal.status === 'unredeemed') {
                return { ...deal, status: 'expired' as const };
              }
              return deal;
            });
            
            setPurchasedDeals(processedDeals);
            setLoading(false);
            return;
          } catch (err) {
            console.error('Error parsing stored purchases:', err);
          }
        }
        
        // Generate mock purchased deals as fallback
        const mockDeals = generateMockPurchasedDeals();
        setPurchasedDeals(mockDeals);
        // Save to localStorage for future use
        localStorage.setItem('purchasedDeals', JSON.stringify(mockDeals));
        setLoading(false);
        return;
      }
      
      try {
        const user = (await supabase.auth.getUser()).data.user;
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('purchased_deals')
          .select(`
            *,
            discount_deals:discount_deal_id (
              title,
              description,
              discount_value,
              brand_name,
              store_name,
              coupon_code,
              image_url,
              tags
            )
          `)
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching purchased deals:', error);
          toast.error('Failed to load your purchases');
          setLoading(false);
          return;
        }
        
        // Transform data to match our PurchasedDeal interface
        const formattedDeals: PurchasedDeal[] = data.map(item => ({
          id: item.id,
          discount_deal_id: item.discount_deal_id,
          user_id: item.user_id,
          purchase_date: item.purchase_date,
          expiry_date: item.expiry_date,
          status: item.status,
          redemption_date: item.redemption_date,
          title: item.discount_deals.title,
          description: item.discount_deals.description,
          discount_value: item.discount_deals.discount_value,
          brand_name: item.discount_deals.brand_name,
          store_name: item.discount_deals.store_name,
          coupon_code: item.discount_deals.coupon_code,
          image_url: item.discount_deals.image_url,
          tags: item.discount_deals.tags
        }));
        
        setPurchasedDeals(formattedDeals);
      } catch (err) {
        console.error('Error:', err);
        toast.error('Failed to load your purchases');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPurchasedDeals();
  }, [useMockData]);

  // Function to mark a deal as redeemed
  const markAsRedeemed = async (dealId: string) => {
    if (useMockData) {
      // Update local state for mock data
      setPurchasedDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.id === dealId 
            ? { 
                ...deal, 
                status: 'redeemed' as const,
                redemption_date: new Date().toISOString()
              } 
            : deal
        )
      );
      
      toast.success('Deal marked as redeemed!');
      setActiveTab('redeemed');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('purchased_deals')
        .update({ 
          status: 'redeemed',
          redemption_date: new Date().toISOString()
        })
        .eq('id', dealId);
        
      if (error) {
        console.error('Error redeeming deal:', error);
        toast.error('Failed to mark deal as redeemed');
        return;
      }
      
      // Update local state
      setPurchasedDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.id === dealId 
            ? { 
                ...deal, 
                status: 'redeemed' as const,
                redemption_date: new Date().toISOString()
              } 
            : deal
        )
      );
      
      toast.success('Deal marked as redeemed!');
      setActiveTab('redeemed');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to mark deal as redeemed');
    }
  };

  // Handle showing QR code
  const showQRCode = (deal: PurchasedDeal) => {
    setSelectedDeal(deal);
    setQrSheetOpen(true);
  };

  // Generate mock purchased deals data
  const generateMockPurchasedDeals = (): PurchasedDeal[] => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastMonth = new Date(now);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    return [
      {
        id: '1',
        discount_deal_id: 'dd-1',
        user_id: 'user-1',
        purchase_date: yesterday.toISOString(),
        expiry_date: nextWeek.toISOString(),
        status: 'unredeemed',
        title: '50% Off Nike Running Shoes',
        description: 'Get half off on all Nike running shoes with this exclusive discount',
        discount_value: '50%',
        brand_name: 'Nike',
        store_name: 'Nike Online Store',
        coupon_code: 'NIKE50RUN',
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        tags: ['Shoes', 'Sports', 'Running']
      },
      {
        id: '2',
        discount_deal_id: 'dd-2',
        user_id: 'user-1',
        purchase_date: lastWeek.toISOString(),
        expiry_date: yesterday.toISOString(),
        status: 'expired',
        title: '30% Off Apple AirPods',
        description: 'Limited-time offer on Apple AirPods',
        discount_value: '30%',
        brand_name: 'Apple',
        store_name: 'Apple Store',
        coupon_code: 'AIRPODS30',
        image_url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb',
        tags: ['Electronics', 'Audio', 'Apple']
      },
      {
        id: '3',
        discount_deal_id: 'dd-3',
        user_id: 'user-1',
        purchase_date: lastMonth.toISOString(),
        redemption_date: lastWeek.toISOString(),
        expiry_date: nextWeek.toISOString(),
        status: 'redeemed',
        title: '$20 Off Adidas Originals',
        description: 'Save $20 on Adidas Originals collection',
        discount_value: '$20',
        brand_name: 'Adidas',
        store_name: 'Adidas Official',
        coupon_code: 'ADIDAS20OFF',
        image_url: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f',
        tags: ['Clothing', 'Sports', 'Casual']
      },
      {
        id: '4',
        discount_deal_id: 'dd-4',
        user_id: 'user-1',
        purchase_date: yesterday.toISOString(),
        expiry_date: nextWeek.toISOString(),
        status: 'unredeemed',
        title: 'BOGO 50% Off at Starbucks',
        description: 'Buy one drink, get another at half price',
        discount_value: '50% BOGO',
        brand_name: 'Starbucks',
        store_name: 'Starbucks Coffee',
        coupon_code: 'SBUXBOGO50',
        image_url: 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e',
        tags: ['Coffee', 'Food', 'Drinks']
      }
    ];
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading your purchases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Your Purchased Deals</h2>
        <p className="text-muted-foreground">
          View and manage all the discount deals you've purchased.
        </p>
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md flex items-start gap-2 text-sm">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground">
            <span className="font-medium text-blue-500">New:</span> Businesses can now scan your QR codes directly from their devices. 
            Show the QR code when redeeming your discount in-store!
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="unredeemed" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="unredeemed" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Unredeemed</span>
          </TabsTrigger>
          <TabsTrigger value="redeemed" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            <span>Redeemed</span>
          </TabsTrigger>
          <TabsTrigger value="expired" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>Expired</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="unredeemed" className="mt-6">
          {filteredDeals.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No unredeemed deals</h3>
                <p className="text-muted-foreground mt-2">
                  You don't have any unredeemed deals at the moment. Browse our marketplace to find great offers!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDeals.map(deal => (
                <Card key={deal.id} className="overflow-hidden">
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={deal.image_url || 'https://via.placeholder.com/400x200?text=No+Image'} 
                      alt={deal.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="font-bold">
                        {deal.discount_value}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{deal.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Store className="h-3 w-3" />
                      <span>{deal.store_name || deal.brand_name}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Code:</span>
                        <code className="bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                          {deal.coupon_code}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Expires:</span>
                        <span>{format(new Date(deal.expiry_date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => showQRCode(deal)}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      QR Code
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => markAsRedeemed(deal.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Redeem
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="redeemed" className="mt-6">
          {filteredDeals.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No redeemed deals</h3>
                <p className="text-muted-foreground mt-2">
                  You haven't redeemed any deals yet. Check your unredeemed deals to find offers ready to use!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDeals.map(deal => (
                <Card key={deal.id} className="overflow-hidden">
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={deal.image_url || 'https://via.placeholder.com/400x200?text=No+Image'} 
                      alt={deal.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="font-bold">
                        {deal.discount_value}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Badge variant="default" className="text-lg py-1 px-3">
                        <CheckCircle className="h-5 w-5 mr-2" /> Redeemed
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{deal.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Store className="h-3 w-3" />
                      <span>{deal.store_name || deal.brand_name}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Code:</span>
                        <code className="bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                          {deal.coupon_code}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Redeemed on:</span>
                        <span>
                          {deal.redemption_date 
                            ? format(new Date(deal.redemption_date), 'MMM dd, yyyy') 
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => showQRCode(deal)}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Show QR Code
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="expired" className="mt-6">
          {filteredDeals.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No expired deals</h3>
                <p className="text-muted-foreground mt-2">
                  You don't have any expired deals. Great job at using your discounts on time!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDeals.map(deal => (
                <Card key={deal.id} className="overflow-hidden">
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={deal.image_url || 'https://via.placeholder.com/400x200?text=No+Image'} 
                      alt={deal.title}
                      className="w-full h-full object-cover grayscale opacity-70"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="font-bold">
                        {deal.discount_value}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg py-1 px-3">
                        <AlertCircle className="h-5 w-5 mr-2" /> Expired
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-muted-foreground">{deal.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Store className="h-3 w-3" />
                      <span>{deal.store_name || deal.brand_name}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span className="font-medium">Code:</span>
                        <code className="bg-secondary/50 px-2 py-0.5 rounded">
                          {deal.coupon_code}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Expired on:</span>
                        <span>{format(new Date(deal.expiry_date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* QR Code Sheet */}
      <Sheet open={qrSheetOpen} onOpenChange={setQrSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Discount QR Code</SheetTitle>
            <SheetDescription>
              Show this QR code to the business to redeem your discount at {selectedDeal?.store_name || selectedDeal?.brand_name}.
              They can scan it with any QR code scanner.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            {selectedDeal && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold">{selectedDeal.title}</h3>
                  <p className="text-muted-foreground">{selectedDeal.description}</p>
                </div>
                
                <Separator />
                
                <div className="flex justify-center">
                  <QRCode 
                    value={selectedDeal.coupon_code}
                    title={`${selectedDeal.discount_value} Off`}
                    description={`Code: ${selectedDeal.coupon_code}`}
                    logo={selectedDeal.image_url}
                  />
                </div>
                
                <div className="bg-secondary p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Discount Code:</span>
                    <code className="bg-background px-2 py-0.5 rounded font-bold">
                      {selectedDeal.coupon_code}
                    </code>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Expires On:</span>
                    <span>{format(new Date(selectedDeal.expiry_date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge variant={
                      selectedDeal.status === 'redeemed' ? "default" : 
                      selectedDeal.status === 'expired' ? "destructive" : 
                      "secondary"
                    } className={selectedDeal.status === 'redeemed' ? "bg-green-500 hover:bg-green-600 text-white" : ""}>
                      {selectedDeal.status.charAt(0).toUpperCase() + selectedDeal.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                {selectedDeal.status === 'unredeemed' && (
                  <div className="flex justify-center">
                    <Button onClick={() => {
                      markAsRedeemed(selectedDeal.id);
                      setQrSheetOpen(false);
                    }}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Redeemed
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 