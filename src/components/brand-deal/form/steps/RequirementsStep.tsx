
import React from "react";
import { BrandDealFormData } from "../types/BrandDealTypes";
import RequirementsSection from "../components/RequirementsSection";
import DeadlinesSection from "../components/DeadlinesSection";
import FollowersSection from "../components/FollowersSection";
import BookingSection from "../components/BookingSection";

interface RequirementsStepProps {
  formData: BrandDealFormData;
  updateFormData: (data: Partial<BrandDealFormData>) => void;
}

const RequirementsStep: React.FC<RequirementsStepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Requirements</h2>
        <p className="text-gray-400">
          Set the key requirements for your brand collaboration
        </p>
      </div>

      <div className="glassmorphism rounded-xl p-7">
        <div className="space-y-10">
          {/* Requirements Sections */}
          <RequirementsSection 
            formData={formData} 
            updateFormData={updateFormData} 
          />
          
          <DeadlinesSection 
            formData={formData} 
            updateFormData={updateFormData} 
          />
          
          <FollowersSection 
            formData={formData} 
            updateFormData={updateFormData} 
          />
          
          <BookingSection 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        </div>
      </div>
    </div>
  );
};

export default RequirementsStep;
