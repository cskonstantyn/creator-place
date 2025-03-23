
import React from "react";
import { BrandDealFormData } from "../types/BrandDealTypes";
import { Users, Info } from "lucide-react";

interface ReviewGuestSectionProps {
  formData: BrandDealFormData;
}

const ReviewGuestSection: React.FC<ReviewGuestSectionProps> = ({ formData }) => {
  return (
    <div className="glassmorphism rounded-xl p-6 space-y-4 md:col-span-2">
      <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Guest Information</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-400 flex items-center">
            <Users className="h-4 w-4 mr-1 text-purple-400" />
            Guests Allowed
          </p>
          <p className="font-medium">
            {formData.guestsAllowed 
              ? formData.guestsAllowed === "unlimited" 
                ? "Unlimited guests" 
                : `${formData.guestsAllowed} guest(s) per creator` 
              : "Not specified"}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-400 flex items-center">
            <Info className="h-4 w-4 mr-1 text-purple-400" />
            Guest Instructions
          </p>
          <p className="font-medium line-clamp-3">{formData.guestInstructions || "Not provided"}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewGuestSection;
