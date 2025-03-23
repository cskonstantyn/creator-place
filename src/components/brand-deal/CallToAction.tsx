
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface CallToActionProps {
  handleApply: () => void;
  isDiscountDeal?: boolean;
  price?: number;
}

export const CallToAction: React.FC<CallToActionProps> = ({ 
  handleApply, 
  isDiscountDeal = false,
  price
}) => {
  const handleApplePay = () => {
    toast({
      title: "Apple Pay Integration",
      description: "In a production app, this would open the Apple Pay interface.",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      {isDiscountDeal ? (
        <Button 
          className="w-full bg-[#000000] hover:bg-[#1a1a1a] text-white flex items-center justify-center gap-2 py-6"
          onClick={handleApplePay}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M11 2a4 4 0 0 1 5 4"></path>
          </svg>
          Pay ${price?.toFixed(2)} with Apple Pay
        </Button>
      ) : (
        <Button 
          variant="gradient"
          size="lg"
          rounded="xl"
          className="flex-1 text-base font-medium"
          onClick={handleApply}
        >
          Apply Now
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="lg"
        rounded="xl"
        className="flex-1 btn-outline-gradient text-base font-medium"
        onClick={() => {
          toast({
            title: "Saved for later",
            description: isDiscountDeal ? "This discount deal has been saved to your list" : "This brand deal has been saved to your list",
          });
        }}
      >
        Save for Later
      </Button>
    </div>
  );
};
