import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import ListingTitleSection from "./ListingTitleSection";
import ListingDescriptionSection from "./ListingDescriptionSection";
import ListingLocationSection from "./ListingLocationSection";
import ListingImagesSection from "./ListingImagesSection";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase/client";
import { discountCategories } from "./ListingCategories";
import { Input } from "../ui/input";
import { CalendarIcon, Info, Tag, DollarSign, MapPin, Store, Clock, Calendar, Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { format } from "date-fns";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getUserPaymentHistory } from "../../services/paymentService";

// Add this interface near the top of the file, after imports
interface PaymentHistoryItem {
  id: string;
  planType: string; // 'credit' or 'subscription'
  isExpired: boolean;
  credits?: number;
  name?: string;
  price?: number;
  date?: string;
}

const ListingForm = () => {
  const navigate = useNavigate();
  
  // State for plan limits
  const [userCredits, setUserCredits] = useState(0);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [isLoadingPlanInfo, setIsLoadingPlanInfo] = useState(true);
  
  // Load user payment information
  useEffect(() => {
    const fetchUserPaymentInfo = async () => {
      try {
        setIsLoadingPlanInfo(true);
        
        // In mock mode, we'll simulate having credits and an active plan
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
          console.log("Mock mode: Setting default credits and active plan");
          setUserCredits(5);
          setHasActivePlan(true);
          setIsLoadingPlanInfo(false);
          return;
        }
        
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error("No user ID found in localStorage");
          setIsLoadingPlanInfo(false);
          return;
        }

        // Fetch the user's payment history and cast properly
        const paymentHistory = await getUserPaymentHistory(userId);
        
        // Since we're dealing with mock data, we'll just cast it to our expected format
        // In a real app, this would be handled by proper API interfaces
        const typedPaymentHistory = paymentHistory as unknown as PaymentHistoryItem[];
        
        // Calculate the number of credits based on credit purchases
        const creditPurchases = typedPaymentHistory.filter(payment => 
          payment.planType === 'credit' && !payment.isExpired
        );
        
        const totalCredits = creditPurchases.reduce(
          (total, payment) => total + (payment.credits || 0), 
          0
        );
        
        // Check if there's an active subscription
        const hasSubscription = typedPaymentHistory.some(payment => 
          payment.planType === 'subscription' && !payment.isExpired
        );
        
        setUserCredits(totalCredits);
        setHasActivePlan(hasSubscription);
      } catch (error) {
        console.error("Error fetching user payment info:", error);
        // For demo purposes, default to allowing access
        setUserCredits(1);
        setHasActivePlan(true);
      } finally {
        setIsLoadingPlanInfo(false);
      }
    };
    
    fetchUserPaymentInfo();
  }, []);
  
  // State for form
  const [title, setTitle] = useState("");
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [packageDetails, setPackageDetails] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [campaignStartDate, setCampaignStartDate] = useState<Date | undefined>(undefined);
  const [campaignEndDate, setCampaignEndDate] = useState<Date | undefined>(undefined);
  const [usageLimit, setUsageLimit] = useState("");
  const [redeemExpiration, setRedeemExpiration] = useState("");
  const [purchaseLimit, setPurchaseLimit] = useState("");
  const [usageTime, setUsageTime] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    if (originalPrice && discountedPrice) {
      const original = parseFloat(originalPrice);
      const discounted = parseFloat(discountedPrice);
      
      if (original > 0 && discounted > 0 && discounted < original) {
        const percentage = Math.round(((original - discounted) / original) * 100);
        setDiscountPercentage(percentage.toString());
      }
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).slice(0, 5); // Max 5 images
      
      if (fileArray.length > 0) {
        setImages([...images, ...fileArray].slice(0, 5));
        
        const newPreviewUrls = fileArray.map(file => URL.createObjectURL(file));
        setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls].slice(0, 5));
      }
    }
  };

  // Remove image from preview
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newImagePreviewUrls = [...imagePreviewUrls];
    
    newImages.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);
    
    setImages(newImages);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (title.length < 10) newErrors.title = "Title must be at least 10 characters";
    if (!brandName) newErrors.brandName = "Please enter your brand name";
    if (!category) newErrors.category = "Please select a category";
    if (description.length < 30) newErrors.description = "Description must be at least 30 characters";
    if (!originalPrice) newErrors.originalPrice = "Please enter the original price";
    if (!discountedPrice) newErrors.discountedPrice = "Please enter the discounted price";
    if (!discountCode) newErrors.discountCode = "Please enter a discount code";
    if (!campaignEndDate) newErrors.campaignEndDate = "Please select an end date for the campaign";
    if (images.length === 0) newErrors.images = "Please upload at least one image";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Process image uploads
  const uploadImages = async (): Promise<string[]> => {
    const imageUrls: string[] = [];
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `discount_listings/${fileName}`;
      
      try {
        // Upload image to Supabase Storage (placeholder for now)
        // Will replace with actual storage code once bucket is set up
        imageUrls.push(`https://example.com/${filePath}`);
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    }
    
    return imageUrls;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has available credits or active plan
    if (!hasActivePlan) {
      toast.error("You need to purchase a plan or credits to create a listing");
      navigate("/post-ad");
      return;
    }
    
    if (userCredits <= 0 && !hasActivePlan) {
      toast.error("You have used all your credits. Please purchase more to continue");
      navigate("/post-ad");
      return;
    }
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Check if we're in mock mode
        const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
        
        // Generate mock image URLs
        const imageUrls = images.map(() => 
          `https://source.unsplash.com/random/800x600/?${encodeURIComponent(category.toLowerCase())}`
        );
        
        if (useMockData) {
          // In mock mode, just log the data and simulate success
          console.log("Creating discount listing in mock mode:", {
            title,
            brand_name: brandName,
            category,
            description,
            location,
            discount_code: discountCode,
            discount_percentage: discountPercentage,
            image_url: imageUrls[0]
          });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Deduct credits in mock mode too
          if (!hasActivePlan && userCredits > 0) {
            setUserCredits(userCredits - 1);
          }
          
          toast.success("Discount listing created! Your discount has been posted and is now live for creators to view.");
          navigate("/browse");
        } else {
          // Real Supabase implementation for when not using mock data
          const { data, error } = await supabase
            .from('discount_listings')
            .insert({
              title,
              brand_name: brandName,
              category,
              description,
              location: location || null,
              store_address: storeAddress || null,
              original_price: parseFloat(originalPrice),
              discounted_price: discountedPrice ? parseFloat(discountedPrice) : null,
              discount_code: discountCode || null,
              discount_percentage: discountPercentage ? parseInt(discountPercentage) : null,
              campaign_period_start: campaignStartDate?.toISOString() || null,
              campaign_period_end: campaignEndDate?.toISOString() || null,
              usage_limit: usageLimit ? parseInt(usageLimit) : null,
              package_details: packageDetails || null,
              special_instructions: specialInstructions ? specialInstructions.split('\n').filter(item => item.trim()) : [],
              redeem_policy: {
                expiration: redeemExpiration || null,
                purchase_limit: purchaseLimit || null,
                usage_time: usageTime || null
              },
              image_url: imageUrls[0] || null,
              reference_images: imageUrls,
              user_id: localStorage.getItem('userId') || 'guest'
            })
            .select();

          if (error) {
            throw error;
          }
          
          // Deduct one credit if the user is using credits
          if (!hasActivePlan && userCredits > 0) {
            setUserCredits(userCredits - 1);
          }
          
          toast.success("Discount listing created! Your discount has been posted and is now live for creators to view.");
          navigate("/browse");
        }
      } catch (error) {
        console.error("Error submitting discount listing:", error);
        toast.error("There was a problem creating your discount listing. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Always show the form in mock mode - bypass any payment checks
  const shouldShowForm = () => {
    // If we're in mock mode, always show the form
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return true;
    }
    
    // Otherwise, show the form if the user has an active plan or credits
    return hasActivePlan || userCredits > 0;
  };

  // Display a loading spinner while checking payment info
  if (isLoadingPlanInfo) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin h-10 w-10 border-4 border-afghan-purple border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading your subscription information...</p>
      </div>
    );
  }

  // Show the no plan message if the user doesn't have a plan or credits
  if (!shouldShowForm()) {
    return (
      <div className="text-center py-10 space-y-4">
        <h3 className="text-xl font-bold">No Active Plan</h3>
        <p>You need to purchase a subscription or credits to create a listing</p>
        <Button 
          onClick={() => navigate("/post-ad")}
          className="bg-gradient-to-r from-purple-500 to-indigo-600"
        >
          View Available Plans
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-t-lg">
          <TabsTrigger value="basic" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md">Pricing</TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md">Details</TabsTrigger>
          <TabsTrigger value="media" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md">Media</TabsTrigger>
        </TabsList>
        
        <div className="px-6 py-4">
          <TabsContent value="basic" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="space-y-1 mb-4">
              <h3 className="text-xl font-semibold">Basic Information</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enter the basic details about your discount deal</p>
            </div>
            
            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Deal Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your discount deal"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-purple-500"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            
            {/* Brand Name */}
            <div className="mb-6">
              <label htmlFor="brandName" className="block text-sm font-medium mb-2">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter your brand or business name"
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-purple-500"
                />
              </div>
              {errors.brandName && <p className="text-red-500 text-xs mt-1">{errors.brandName}</p>}
            </div>
            
            {/* Category */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-purple-500 rounded-md p-2.5"
              >
                <option value="">Select a category</option>
                {discountCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-purple-500 rounded-md p-2.5 min-h-[120px]"
                placeholder="Describe your discount deal in detail"
              ></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              <p className="text-xs text-gray-500 mt-1">Minimum 30 characters</p>
            </div>
            
            {/* Location */}
            <div className="mb-6">
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State, Country"
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-purple-500"
                />
              </div>
            </div>
            
            {/* Store Address */}
            <div className="mb-6">
              <label htmlFor="storeAddress" className="block text-sm font-medium mb-2">
                Store Address
              </label>
              <Input
                id="storeAddress"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                placeholder="Full address of your store (optional)"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-purple-500"
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={() => setActiveTab("pricing")}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                Continue to Pricing
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="pricing" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="space-y-1 mb-4">
              <h3 className="text-xl font-semibold">Pricing Information</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Set the pricing details for your discount deal</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Price */}
              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium mb-2">
                  Original Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="originalPrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => {
                      setOriginalPrice(e.target.value);
                      if (discountedPrice) calculateDiscountPercentage();
                    }}
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-purple-500"
                    placeholder="0.00"
                  />
                </div>
                {errors.originalPrice && <p className="text-red-500 text-xs mt-1">{errors.originalPrice}</p>}
              </div>
              
              {/* Discounted Price */}
              <div>
                <label htmlFor="discountedPrice" className="block text-sm font-medium mb-2">
                  Discounted Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="discountedPrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={discountedPrice}
                    onChange={(e) => {
                      setDiscountedPrice(e.target.value);
                      if (originalPrice) calculateDiscountPercentage();
                    }}
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-purple-500"
                    placeholder="0.00"
                  />
                </div>
                {errors.discountedPrice && <p className="text-red-500 text-xs mt-1">{errors.discountedPrice}</p>}
                {discountPercentage && (
                  <p className="text-green-500 text-xs mt-1">
                    {discountPercentage}% discount
                  </p>
                )}
              </div>
            </div>
            
            {/* Discount Code */}
            <div className="mb-6">
              <label htmlFor="discountCode" className="block text-sm font-medium mb-2">
                Discount Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="discountCode"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="e.g. SUMMER20"
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-purple-500"
                />
              </div>
              {errors.discountCode && <p className="text-red-500 text-xs mt-1">{errors.discountCode}</p>}
              <p className="text-xs text-gray-500 mt-1">The code creators will use to claim the discount</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Start Date */}
              <div>
                <label htmlFor="campaignStartDate" className="block text-sm font-medium mb-2">
                  Campaign Start Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex justify-between bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-left font-normal"
                    >
                      {campaignStartDate ? (
                        <span>{format(campaignStartDate, "PPP")}</span>
                      ) : (
                        <span className="text-gray-400">Select start date</span>
                      )}
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={campaignStartDate}
                      onSelect={setCampaignStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Campaign End Date */}
              <div>
                <label htmlFor="campaignEndDate" className="block text-sm font-medium mb-2">
                  Campaign End Date <span className="text-red-500">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex justify-between bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-left font-normal"
                    >
                      {campaignEndDate ? (
                        <span>{format(campaignEndDate, "PPP")}</span>
                      ) : (
                        <span className="text-gray-400">Select end date</span>
                      )}
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={campaignEndDate}
                      onSelect={setCampaignEndDate}
                      disabled={(date) => campaignStartDate ? date < campaignStartDate : date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.campaignEndDate && <p className="text-red-500 text-xs mt-1">{errors.campaignEndDate}</p>}
              </div>
            </div>
            
            {/* Usage Limit */}
            <div className="mb-6">
              <label htmlFor="usageLimit" className="block text-sm font-medium mb-2">
                Usage Limit
              </label>
              <Input
                id="usageLimit"
                type="number"
                min="1"
                step="1"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="Maximum number of times this deal can be used"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited usage</p>
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab("basic")}
                className="border-purple-500 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                Back to Basic Info
              </Button>
              <Button 
                type="button" 
                onClick={() => setActiveTab("details")}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                Continue to Details
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="space-y-1 mb-4">
              <h3 className="text-xl font-semibold">Additional Details</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Provide more information about your discount deal</p>
            </div>
            
            {/* Package Details */}
            <div className="mb-6">
              <label htmlFor="packageDetails" className="block text-sm font-medium mb-2">
                What's Included
              </label>
              <textarea
                id="packageDetails"
                value={packageDetails}
                onChange={(e) => setPackageDetails(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-purple-500 rounded-md p-2.5 min-h-[120px]"
                placeholder="Describe what's included in this deal package"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">List all items, services, or benefits included in this deal</p>
            </div>
            
            {/* Redemption Policy */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-4">
                Redemption Policy
              </label>
              
              <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <label htmlFor="redeemExpiration" className="block text-sm font-medium mb-2">
                    Expiration Terms
                  </label>
                  <Input
                    id="redeemExpiration"
                    value={redeemExpiration}
                    onChange={(e) => setRedeemExpiration(e.target.value)}
                    placeholder="e.g. Must be redeemed within 30 days of purchase"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="purchaseLimit" className="block text-sm font-medium mb-2">
                    Purchase Limit
                  </label>
                  <Input
                    id="purchaseLimit"
                    value={purchaseLimit}
                    onChange={(e) => setPurchaseLimit(e.target.value)}
                    placeholder="e.g. Limit 2 per customer"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="usageTime" className="block text-sm font-medium mb-2">
                    Usage Time
                  </label>
                  <Input
                    id="usageTime"
                    value={usageTime}
                    onChange={(e) => setUsageTime(e.target.value)}
                    placeholder="e.g. Valid Monday-Thursday, not valid on holidays"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Special Instructions */}
            <div className="mb-6">
              <label htmlFor="specialInstructions" className="block text-sm font-medium mb-2">
                Special Instructions
              </label>
              <textarea
                id="specialInstructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-purple-500 rounded-md p-2.5 min-h-[120px]"
                placeholder="Add any special instructions or terms (one per line)"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Enter each instruction on a new line</p>
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab("pricing")}
                className="border-purple-500 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                Back to Pricing
              </Button>
              <Button 
                type="button" 
                onClick={() => setActiveTab("media")}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                Continue to Media
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="space-y-1 mb-4">
              <h3 className="text-xl font-semibold">Media</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload images for your discount deal</p>
            </div>
            
            <ListingImagesSection 
              images={images}
              imagePreviewUrls={imagePreviewUrls}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
              error={errors.images}
            />
            
            <div className="flex justify-between mt-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab("details")}
                className="border-purple-500 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                Back to Details
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-lg font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Listing..." : "Post Discount Deal"}
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </form>
  );
};

export default ListingForm;
