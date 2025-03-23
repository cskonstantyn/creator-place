import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePaywall } from "../../lib/paywall/PaywallProvider";
import { getPaywallProductsByType, findPaymentPlanFromPrice, Product, Price } from "../../lib/paywall/adapter";
import { PaymentPlan } from "../../services/paymentService";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Check } from "lucide-react";

// Create a simple loading spinner component directly in this file
function LoadingSpinner({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div 
      className={`animate-spin rounded-full border-solid border-purple-500 border-t-transparent ${sizeClasses[size]}`} 
      role="status" 
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Create a custom ProductCard component
const ProductCard = ({ product, price, onPurchase, featured }: {
  product: Product;
  price: Price;
  onPurchase: () => void;
  featured?: boolean;
}) => {
  const { formatPrice } = usePaywall();

  return (
    <Card 
      key={price.id} 
      className={`glassmorphism border-2 transition-all ${
        featured 
          ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{product.name}</span>
          <span className="text-2xl font-bold text-purple-400">{formatPrice(price)}</span>
        </CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {product.metadata?.features?.split(',').map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
              <span>{feature.trim()}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${
            featured 
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
              : ''
          }`}
          variant={featured ? "default" : "outline"}
          onClick={onPurchase}
        >
          Select Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

// Create a custom Paywall component
const CustomPaywall = ({ 
  products, 
  prices, 
  onPurchase,
  className,
  theme = 'dark',
  featuredPriceId,
}: {
  products: Product[];
  prices: Price[];
  onPurchase: (price: Price) => void;
  className?: string;
  theme?: 'light' | 'dark';
  featuredPriceId?: string;
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`} data-theme={theme}>
      {products.map(product => {
        // Find prices for this product
        const productPrices = prices.filter(price => price.product_id === product.id);
        
        // Render a card for each price
        return productPrices.map(price => (
          <ProductCard
            key={price.id}
            product={product}
            price={price}
            onPurchase={() => onPurchase(price)}
            featured={price.id === featuredPriceId}
          />
        ));
      })}
    </div>
  );
};

interface PaywallPlansProps {
  type: 'subscription' | 'credit' | 'one_time';
  onSelectPlan: (plan: PaymentPlan) => void;
}

export function PaywallPlans({ type, onSelectPlan }: PaywallPlansProps) {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [localPrices, setLocalPrices] = useState<Price[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
  // Initialize with our adapter since we're not using the database yet
  useEffect(() => {
    setIsLocalLoading(true);
    const { products, prices } = getPaywallProductsByType(type);
    setLocalProducts(products);
    setLocalPrices(prices);
    setIsLocalLoading(false);
  }, [type]);
  
  // Handle purchase selection
  const handlePurchaseSelection = (price: Price) => {
    const paymentPlan = findPaymentPlanFromPrice(price);
    if (paymentPlan) {
      onSelectPlan(paymentPlan);
    } else {
      toast.error("Error selecting plan. Please try again.");
    }
  };
  
  if (isLocalLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose a Plan</h2>
        <p className="text-gray-400 mt-2">
          Select a plan to publish your {type === 'subscription' ? 'subscription' : type === 'credit' ? 'credits' : 'one-time purchase'}
        </p>
      </div>
      
      <CustomPaywall
        products={localProducts}
        prices={localPrices}
        onPurchase={handlePurchaseSelection}
        className="paywall-container"
        theme="dark"
        featuredPriceId={
          // Find the featured plan ID
          localProducts.find(product => product.metadata?.is_featured === 'true')?.id
        }
      />
    </div>
  );
} 