
import React from "react";
import { BrandDealFormData } from "../types/BrandDealTypes";
import { Info, Hash, AtSign } from "lucide-react";

interface ReviewBriefSectionProps {
  formData: BrandDealFormData;
}

const ReviewBriefSection: React.FC<ReviewBriefSectionProps> = ({ formData }) => {
  return (
    <div className="glassmorphism rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Brief Details</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-400 flex items-center">
            <Info className="h-4 w-4 mr-1 text-purple-400" />
            Brief Description
          </p>
          <p className="font-medium line-clamp-2">{formData.brief || "Not provided"}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-400 flex items-center">
            <Hash className="h-4 w-4 mr-1 text-purple-400" />
            Hashtags
          </p>
          <p className="font-medium line-clamp-2">{formData.hashtags || "Not provided"}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-400 flex items-center">
            <AtSign className="h-4 w-4 mr-1 text-purple-400" />
            Accounts to Mention
          </p>
          <p className="font-medium line-clamp-2">{formData.socialAccounts || "Not provided"}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewBriefSection;
