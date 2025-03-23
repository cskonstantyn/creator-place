
import React from "react";
import { BrandDealFormData } from "../types/BrandDealTypes";
import { Check } from "lucide-react";

interface ReviewGeneralInfoSectionProps {
  formData: BrandDealFormData;
}

const ReviewGeneralInfoSection: React.FC<ReviewGeneralInfoSectionProps> = ({ formData }) => {
  return (
    <div className="glassmorphism rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">General Info</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-400">Brand Deal Name</p>
          <p className="font-medium">{formData.title || "Not provided"}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-400">Industry</p>
          <p className="font-medium">{formData.industry || "Not selected"}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-400">Promotion Type</p>
          <p className="font-medium">{formData.promotionType || "Not selected"}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewGeneralInfoSection;
