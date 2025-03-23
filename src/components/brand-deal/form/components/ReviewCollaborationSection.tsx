
import React from "react";
import { BrandDealFormData } from "../types/BrandDealTypes";

interface ReviewCollaborationSectionProps {
  formData: BrandDealFormData;
}

const ReviewCollaborationSection: React.FC<ReviewCollaborationSectionProps> = ({ formData }) => {
  return (
    <div className="glassmorphism rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Collaboration Info</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-400">Platform</p>
          <p className="font-medium capitalize">{formData.platform || "Not selected"}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-400">Collaboration Type</p>
          <p className="font-medium capitalize">{formData.collaborationType || "Not selected"}</p>
        </div>
        
        {formData.collaborationType === "offline" && (
          <div>
            <p className="text-sm text-gray-400">Offline Type</p>
            <p className="font-medium capitalize">{formData.offlineCollaborationType?.replace("_", " ") || "Not selected"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCollaborationSection;
