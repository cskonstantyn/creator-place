import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Heart, Calendar, Users, Clock, Copy, Store, Check, MapPin, Clock as ClockIcon, CreditCard, Apple, X, CreditCard as CreditCardIcon, CheckCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getDiscountDealById, incrementDiscountDealViews, DiscountDeal } from "@/services/discountDealService";
import { QRCode } from "@/components/ui/qr-code";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow, format } from "date-fns";
import { supabase } from "@/lib/supabase/client";

// Payment plans
const paymentPlans = [
  { id: 'pay-per-use', name: 'Pay per use', price: 1.99, description: 'Pay for each deal you purchase' },
  { id: 'subscription', name: 'Monthly Subscription', price: 9.99, description: 'Unlimited deals for a monthly fee' }
];

const DiscountDealPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "apple">("card");
  const [selectedPlan, setSelectedPlan] = useState(paymentPlans[0].id);
  
  // New state for purchase success
  const [purchaseSuccessful, setPurchaseSuccessful] = useState(false);
  const [purchasedDeal, setPurchasedDeal] = useState<any>(null);
  
  // Handle card input formatting
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  
  const { data: discountDeal, isLoading, error } = useQuery({
    queryKey: ["discountDeal", id],
    queryFn: async () => {
      if (!id) throw new Error("Deal ID is required");
      const data = await getDiscountDealById(id);
      if (!data) throw new Error("Discount deal not found");
      return data;
    },
    enabled: !!id,
  });

  // Increment view count when the page loads
  useEffect(() => {
    if (id) {
      incrementDiscountDealViews(id);
    }
  }, [id]);

  const handleToggleFavorite = () => {
    if (!discountDeal) return;
    
    const favoriteItem = {
      id: discountDeal.id,
      type: 'discount-deal' as const,
      title: discountDeal.title,
      imageUrl: discountDeal.image_url,
      createdAt: new Date().toISOString()
    };
    
    toggleFavorite(favoriteItem);
  };

  const copyDiscountCode = () => {
    if (!discountDeal?.coupon_code) return;
    
    navigator.clipboard.writeText(discountDeal.coupon_code).then(() => {
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 2000);
      toast("Code copied", {
        description: "Discount code has been copied to clipboard"
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast("Failed to copy", {
        description: "Could not copy the discount code to clipboard"
      });
    });
  };

  const handlePurchase = (method: "card" | "apple") => {
    setSelectedPaymentMethod(method);
    setIsPaymentSheetOpen(true);
  };

  const processPayment = async () => {
    // Validate card details if using card payment
    if (selectedPaymentMethod === "card") {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
        toast.error("Please enter a valid card number");
        return;
      }
      
      if (!cardExpiry.trim() || !cardExpiry.includes('/')) {
        toast.error("Please enter a valid expiry date");
        return;
      }
      
      if (!cardCvc.trim() || cardCvc.length < 3) {
        toast.error("Please enter a valid CVC");
        return;
      }
      
      if (!cardName.trim()) {
        toast.error("Please enter the name on your card");
        return;
      }
    }
    
    setIsProcessing(true);
    
    // Check if we're using mock data
    const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    
    try {
      if (useMockData) {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a mock purchased deal
        const now = new Date();
        const expiryDate = new Date(now);
        expiryDate.setDate(expiryDate.getDate() + 30); // Expiry in 30 days
        
        const purchasedDealData = {
          id: `pd-${Math.random().toString(36).substr(2, 9)}`,
          discount_deal_id: discountDeal.id,
          user_id: "mock-user-id",
          purchase_date: now.toISOString(),
          expiry_date: expiryDate.toISOString(),
          status: 'unredeemed',
          title: discountDeal.title,
          description: discountDeal.description,
          discount_value: `${discountDeal.discount_percentage}%`,
          brand_name: discountDeal.brand_name,
          store_name: discountDeal.store_name || discountDeal.brand_name,
          coupon_code: discountDeal.coupon_code,
          image_url: discountDeal.image_url,
          tags: discountDeal.tags || []
        };
        
        // Store in localStorage for frontend-only mode
        const storedPurchases = JSON.parse(localStorage.getItem('purchasedDeals') || '[]');
        localStorage.setItem('purchasedDeals', JSON.stringify([...storedPurchases, purchasedDealData]));
        
        setPurchasedDeal(purchasedDealData);
      } else {
        // Real payment processing would go here
        const user = (await supabase.auth.getUser()).data.user;
        
        if (!user) {
          toast.error("You must be logged in to make a purchase");
          setIsProcessing(false);
          return;
        }
        
        // Process payment (this would be integrated with a payment provider)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create record of purchase in Supabase
        const now = new Date();
        const expiryDate = new Date(now);
        expiryDate.setDate(expiryDate.getDate() + 30); // Expiry in 30 days
        
        const { data, error } = await supabase
          .from('purchased_deals')
          .insert({
            discount_deal_id: discountDeal.id,
            user_id: user.id,
            purchase_date: now.toISOString(),
            expiry_date: expiryDate.toISOString(),
            status: 'unredeemed',
            // Add any other necessary fields
          })
          .select('*')
          .single();
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Fetch the full deal details
        const purchasedDealData = {
          ...data,
          title: discountDeal.title,
          description: discountDeal.description,
          discount_value: `${discountDeal.discount_percentage}%`,
          brand_name: discountDeal.brand_name,
          store_name: discountDeal.store_name || discountDeal.brand_name,
          coupon_code: discountDeal.coupon_code,
          image_url: discountDeal.image_url,
          tags: discountDeal.tags || []
        };
        
        setPurchasedDeal(purchasedDealData);
      }
      
      // Show success state
      setPurchaseSuccessful(true);
    } catch (err) {
      console.error('Payment error:', err);
      toast.error("Payment failed", {
        description: "There was an error processing your payment. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Format card number as user types
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces for readability
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formattedValue += ' ';
      formattedValue += value[i];
    }
    
    setCardNumber(formattedValue);
  };
  
  // Format expiry date as user types
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    setCardExpiry(value);
  };
  
  // Restrict CVC to numbers only
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setCardCvc(value);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="ml-2">Loading discount deal...</span>
        </div>
      </Layout>
    );
  }

  if (error || !discountDeal) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error ? (error as Error).message : "Discount deal not found"}
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate("/browse")}>Browse Other Deals</Button>
        </div>
      </Layout>
    );
  }

  // Format date for display
  const formatPeriod = () => {
    try {
      const startDate = new Date(discountDeal.campaign_period_start);
      const endDate = new Date(discountDeal.campaign_period_end);
      return `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
    } catch (e) {
      return 'Date not available';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col space-y-6">
              {/* Category badges */}
              <div className="flex space-x-2">
                {discountDeal.tags && discountDeal.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Title */}
              <h1 className="text-4xl font-bold">{discountDeal.title}</h1>
              
              {/* Brand */}
              <div className="flex items-center space-x-2">
                <Store className="h-5 w-5 text-purple-400" />
                <span className="text-xl text-purple-400">{discountDeal.store_name}</span>
              </div>
              
              {/* Main image */}
              <div className="relative flex justify-center">
                <img 
                  src={discountDeal.image_url} 
                  alt={discountDeal.title} 
                  className="w-full max-w-2xl max-h-[400px] object-contain rounded-xl"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {discountDeal.discount_percentage}% OFF
                </div>
                <button 
                  onClick={handleToggleFavorite}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Heart className={`h-5 w-5 ${isFavorite(discountDeal.id, 'discount-deal') ? "fill-red-500 text-red-500" : "text-white"}`} />
                </button>
              </div>
              
              {/* Price display for mobile */}
              <div className="flex items-center justify-between lg:hidden">
                <div>
                  <div className="flex items-center">
                    <span className="text-gray-400 line-through mr-2">${discountDeal.original_price}</span>
                    <span className="text-2xl font-bold text-green-400">${discountDeal.discounted_price}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handlePurchase("card")}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600"
                >
                  Purchase This Deal
                </Button>
              </div>
              
              {/* Location and period */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                  <span>{discountDeal.location} - {discountDeal.store_address || ''}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2 text-purple-400" />
                  <span>Valid: {formatPeriod()}</span>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="mt-4">
                <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 bg-afghan-background-dark">
                    <TabsTrigger value="details" className="rounded-none">Details</TabsTrigger>
                    <TabsTrigger value="whats-included" className="rounded-none">What's Included</TabsTrigger>
                    <TabsTrigger value="how-to-redeem" className="rounded-none">How to Redeem</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="pt-6">
                    <p className="text-gray-300">{discountDeal.description}</p>
                    
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="glassmorphism p-4 flex items-start space-x-3 rounded-lg">
                        <Calendar className="h-6 w-6 text-purple-400" />
                        <div>
                          <h3 className="font-semibold mb-1">Expiration</h3>
                          <p className="text-sm text-gray-300">
                            {discountDeal.redeem_policy?.expiration || 'No expiration'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="glassmorphism p-4 flex items-start space-x-3 rounded-lg">
                        <Users className="h-6 w-6 text-purple-400" />
                        <div>
                          <h3 className="font-semibold mb-1">Purchase Limit</h3>
                          <p className="text-sm text-gray-300">
                            {discountDeal.redeem_policy?.purchase_limit || 'No limit'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="glassmorphism p-4 flex items-start space-x-3 rounded-lg">
                        <Clock className="h-6 w-6 text-purple-400" />
                        <div>
                          <h3 className="font-semibold mb-1">Usage Time</h3>
                          <p className="text-sm text-gray-300">
                            {discountDeal.redeem_policy?.usage_time || 'Any time'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="glassmorphism p-4 flex items-start space-x-3 rounded-lg">
                        <Store className="h-6 w-6 text-purple-400" />
                        <div>
                          <h3 className="font-semibold mb-1">Store</h3>
                          <p className="text-sm text-gray-300">{discountDeal.store_name}</p>
                        </div>
                      </div>
                    </div>
                    
                    {discountDeal.special_instructions && discountDeal.special_instructions.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3">Special Instructions</h3>
                        <ul className="space-y-2">
                          {discountDeal.special_instructions.map((instruction, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                              <span className="text-gray-300">{instruction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="whats-included" className="pt-6">
                    <p className="text-gray-300">{discountDeal.package_details}</p>
                  </TabsContent>
                  
                  <TabsContent value="how-to-redeem" className="pt-6">
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        To redeem this discount deal, follow these steps:
                      </p>
                      
                      <ol className="list-decimal pl-5 space-y-2 text-gray-300">
                        <li>Purchase this deal on our platform</li>
                        <li>Show the coupon code to the vendor at the time of purchase</li>
                        <li>Enjoy your discount!</li>
                      </ol>
                      
                      <div className="mt-6 p-4 glassmorphism rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold mb-1">Your Coupon Code</h3>
                            <p className="font-mono text-lg text-white">{discountDeal.coupon_code}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={copyDiscountCode}
                            className="flex items-center"
                          >
                            {isCodeCopied ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Purchase */}
          <div className="lg:w-80 sticky top-24 h-fit hidden lg:block">
            <div className="glassmorphism p-6 rounded-xl">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Original price</span>
                    <span className="text-gray-400 line-through">${discountDeal.original_price}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">Discount</span>
                    <span className="text-green-400">{discountDeal.discount_percentage}% OFF</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="font-semibold">Final price</span>
                    <span className="text-2xl font-bold text-green-400">${discountDeal.discounted_price}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Copy className="h-4 w-4 mr-2 text-purple-400" />
                    <span className="text-sm">Coupon code: <span className="font-mono">{discountDeal.coupon_code}</span></span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-purple-400" />
                    <span className="text-sm">{discountDeal.items_sold} people bought this</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-purple-400" />
                    <span className="text-sm">Usage limit: {discountDeal.usage_limit} per person</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => handlePurchase("card")}
                    className="w-full flex items-center justify-center"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay with Card
                  </Button>
                  
                  <Button 
                    onClick={() => handlePurchase("apple")}
                    variant="outline"
                    className="w-full flex items-center justify-center bg-black text-white border-none hover:bg-black/90"
                  >
                    <Apple className="h-4 w-4 mr-2" />
                    Apple Pay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Sheet */}
      <Sheet open={isPaymentSheetOpen} onOpenChange={(open) => {
        // Only allow closing if not in processing state
        if (!isProcessing) {
          setIsPaymentSheetOpen(open);
          
          // Reset success state when sheet is closed
          if (!open) {
            setPurchaseSuccessful(false);
          }
        }
      }}>
        <SheetContent className="sm:max-w-md p-0 overflow-y-auto">
          {!purchaseSuccessful ? (
            <>
              <SheetHeader className="p-6 border-b border-white/10">
                <SheetTitle>Complete Purchase</SheetTitle>
                {!isProcessing && (
                  <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                )}
              </SheetHeader>
              <div className="p-6 space-y-6">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{discountDeal.title}</h3>
                  <p className="text-sm text-gray-400">{discountDeal.store_name || discountDeal.brand_name}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Original price</span>
                    <span className="text-gray-400 line-through">${discountDeal.original_price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span className="text-green-400">{discountDeal.discount_percentage}% OFF</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="font-semibold">Final price</span>
                    <span className="text-xl font-bold text-green-400">${discountDeal.discounted_price}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Select payment plan</h4>
                    <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-3">
                      {paymentPlans.map(plan => (
                        <div key={plan.id} className="flex items-start space-x-3 p-3 rounded-lg border border-white/10">
                          <RadioGroupItem value={plan.id} id={plan.id} />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <Label htmlFor={plan.id} className="font-medium">{plan.name}</Label>
                              <span className="font-bold">${plan.price}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Payment method</h4>
                    <div className="space-y-3">
                      <div
                        className={`p-3 rounded-lg border cursor-pointer flex items-center space-x-3 ${
                          selectedPaymentMethod === "card" 
                            ? "border-purple-500 bg-purple-500/10" 
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => setSelectedPaymentMethod("card")}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === "card" ? "border-purple-500" : "border-white/30"
                        }`}>
                          {selectedPaymentMethod === "card" && (
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          )}
                        </div>
                        <CreditCardIcon className="h-5 w-5 text-gray-400" />
                        <span>Credit / Debit Card</span>
                      </div>
                      
                      <div
                        className={`p-3 rounded-lg border cursor-pointer flex items-center space-x-3 ${
                          selectedPaymentMethod === "apple" 
                            ? "border-purple-500 bg-purple-500/10" 
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => setSelectedPaymentMethod("apple")}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === "apple" ? "border-purple-500" : "border-white/30"
                        }`}>
                          {selectedPaymentMethod === "apple" && (
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          )}
                        </div>
                        <Apple className="h-5 w-5 text-white" />
                        <span>Apple Pay</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedPaymentMethod === "card" && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card number</Label>
                        <Input 
                          id="card-number" 
                          placeholder="1234 5678 9012 3456" 
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry date</Label>
                          <Input 
                            id="expiry" 
                            placeholder="MM/YY" 
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input 
                            id="cvc" 
                            placeholder="123" 
                            value={cardCvc}
                            onChange={handleCvcChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name on card</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={processPayment} 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Purchase (${discountDeal.discounted_price})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-8 w-8 text-black" />
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
                <p className="text-gray-400 mb-8">
                  Your discount has been added to your account
                </p>
                
                <div className="w-full max-w-sm mx-auto mb-8">
                  <QRCode 
                    value={purchasedDeal?.coupon_code || discountDeal.coupon_code}
                    title={`${discountDeal.discount_percentage}% Off`}
                    description={`Code: ${discountDeal.coupon_code}`}
                    logo={discountDeal.image_url}
                  />
                </div>
                
                <Card className="w-full mb-6 bg-secondary/30 border-none">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Discount code:</span>
                        <code className="bg-background px-2 py-0.5 rounded-md">
                          {discountDeal.coupon_code}
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Expires on:</span>
                        <span>
                          {purchasedDeal?.expiry_date 
                            ? format(new Date(purchasedDeal.expiry_date), 'MMM dd, yyyy')
                            : format(new Date(new Date().setDate(new Date().getDate() + 30)), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Value:</span>
                        <span className="font-semibold text-green-400">
                          {discountDeal.discount_percentage}% OFF
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col w-full gap-3">
                  <Button onClick={() => {
                    setIsPaymentSheetOpen(false);
                    navigate('/profile', { state: { activeTab: 'purchases' } });
                  }} className="w-full">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View in My Purchases
                  </Button>
                  
                  <Button variant="outline" onClick={() => {
                    setIsPaymentSheetOpen(false);
                  }}>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default DiscountDealPage;
