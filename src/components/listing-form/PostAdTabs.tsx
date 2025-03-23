import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Percent, Handshake } from "lucide-react";
import { PaymentForm } from "../payment/PaymentForm";
import { PaymentPlan } from "../../services/paymentService";
import { PaywallPlans } from "../payment/PaywallPlans";
import ListingForm from "./ListingForm";
import BrandDealForm from "../brand-deal/form/BrandDealForm";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

interface PostAdTabsProps {
  currentTab?: string;
  setCurrentTab?: (tab: string) => void;
  className?: string;
}

export function PostAdTabs({ className, currentTab, setCurrentTab }: PostAdTabsProps) {
  // Core state tracking for tabs and payment
  const [activeTab, setActiveTab] = useState<"discount" | "brand-deal">("discount");
  
  // Separate and independent payment states for each tab
  const [discountPaymentComplete, setDiscountPaymentComplete] = useState(false);
  const [brandDealPaymentComplete, setBrandDealPaymentComplete] = useState(false);
  
  // Payment form states
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payingForTab, setPayingForTab] = useState<"discount" | "brand-deal" | null>(null);
  
  // Reset payment state for a specific tab
  const resetPaymentState = (tabType: "discount" | "brand-deal" | "all") => {
    console.log(`Resetting payment state for ${tabType}`);
    
    if (tabType === "discount" || tabType === "all") {
      setDiscountPaymentComplete(false);
    }
    
    if (tabType === "brand-deal" || tabType === "all") {
      setBrandDealPaymentComplete(false);
    }
    
    setSelectedPlan(null);
    setShowPaymentForm(false);
    setPayingForTab(null);
  };
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    // Don't reset payment state when changing tabs
    // This allows us to keep track of which tabs have completed payment
    setActiveTab(value as "discount" | "brand-deal");
    
    if (setCurrentTab) {
      setCurrentTab(value);
    }
  };
  
  // Handle plan selection
  const handleSelectPlan = (plan: PaymentPlan, tabType: "discount" | "brand-deal") => {
    console.log(`Selecting plan for ${tabType} tab:`, plan);
    setSelectedPlan(plan);
    setPayingForTab(tabType);
    setShowPaymentForm(true);
  };
  
  // Handle payment success
  const handlePaymentSuccess = () => {
    console.log(`Payment successful for ${payingForTab} tab`);
    
    if (payingForTab === "discount") {
      console.log("Setting discount payment as complete");
      setDiscountPaymentComplete(true);
      toast.success("Payment successful! You can now create your discount deal.");
    } else if (payingForTab === "brand-deal") {
      console.log("Setting brand deal payment as complete");
      setBrandDealPaymentComplete(true);
      toast.success("Payment successful! You can now create your brand deal.");
    }
    
    // We keep the payment state after success but clear the form variables
    setSelectedPlan(null);
    setShowPaymentForm(false);
  };
  
  return (
    <Tabs 
      defaultValue="discount" 
      value={activeTab} 
      onValueChange={handleTabChange}
      className={cn("w-full", className)}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="discount" className="flex items-center gap-1">
          <Percent className="h-4 w-4" />
          <span>Advertise Discount</span>
        </TabsTrigger>
        <TabsTrigger value="brand-deal" className="flex items-center gap-1">
          <Handshake className="h-4 w-4" />
          <span>Create Brand Deal</span>
        </TabsTrigger>
      </TabsList>
      
      {/* Discount Tab Content */}
      <TabsContent value="discount" className="mt-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Advertise Your Discount</h1>
          <p className="text-gray-400">
            Create a discount deal for creators to purchase and use at your business.
          </p>
        </div>
        
        {discountPaymentComplete ? (
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Payment Complete!</h2>
              <p className="text-white/90">
                Please complete the form below to create your discount deal.
              </p>
            </div>
            <ListingForm />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Choose a Plan</h2>
              <p className="text-muted-foreground">
                Select a plan to advertise your discount deal
              </p>
            </div>
            <PaywallPlans 
              type="credit"
              onSelectPlan={(plan) => handleSelectPlan(plan, "discount")}
            />
          </div>
        )}
      </TabsContent>

      {/* Brand Deal Tab Content */}
      <TabsContent value="brand-deal" className="mt-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Create a Brand Deal</h1>
          <p className="text-gray-400">
            Create a brand partnership opportunity for creators to apply and collaborate with you.
          </p>
        </div>
        
        {brandDealPaymentComplete ? (
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Payment Complete!</h2>
              <p className="text-white/90">
                Please complete the form below to create your brand partnership.
              </p>
            </div>
            <BrandDealForm />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Choose a Plan</h2>
              <p className="text-muted-foreground">
                Select a plan to create your brand deal listing
              </p>
            </div>
            <PaywallPlans 
              type="subscription"
              onSelectPlan={(plan) => handleSelectPlan(plan, "brand-deal")}
            />
          </div>
        )}
      </TabsContent>
      
      {/* Payment Form */}
      {selectedPlan && showPaymentForm ? (
        <div className="mt-8">
          <PaymentForm
            selectedPlan={selectedPlan}
            isOpen={showPaymentForm}
            onClose={() => setShowPaymentForm(false)}
            onSuccess={handlePaymentSuccess}
            tabType={payingForTab || undefined}
          />
        </div>
      ) : null}
    </Tabs>
  );
}

export default PostAdTabs;
