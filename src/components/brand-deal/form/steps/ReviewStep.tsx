
import React from "react";
import { BrandDealFormData } from "../types/BrandDealTypes";
import { Check, X, Info, Sparkles, Edit } from "lucide-react";
import { useFormContext } from "../context/FormContext";
import { Button } from "@/components/ui/button";
import ReviewGeneralInfoSection from "../components/ReviewGeneralInfoSection";
import ReviewCollaborationSection from "../components/ReviewCollaborationSection";
import ReviewRequirementsSection from "../components/ReviewRequirementsSection";
import ReviewBriefSection from "../components/ReviewBriefSection";
import ReviewGuestSection from "../components/ReviewGuestSection";

interface ReviewStepProps {
  formData: BrandDealFormData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  const { isAIGenerated, setCurrentStep } = useFormContext();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center">
          <Check className="mr-2 h-6 w-6 text-green-500" />
          Review Brand Deal
        </h2>
        <p className="text-gray-400">
          Please review all the information before submitting your brand deal
        </p>
      </div>
      
      {isAIGenerated && (
        <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
            <p className="text-purple-200">
              This form was generated with AI assistance. Review all fields carefully before submitting.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-transparent border-purple-500 text-purple-400 hover:bg-purple-900/50"
            onClick={() => setCurrentStep(1)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Form
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Info */}
        <ReviewGeneralInfoSection formData={formData} />
        
        {/* Collaboration Info */}
        <ReviewCollaborationSection formData={formData} />
        
        {/* Requirements */}
        <ReviewRequirementsSection formData={formData} />
        
        {/* Brief Details */}
        <ReviewBriefSection formData={formData} />
        
        {/* Guest Info */}
        <ReviewGuestSection formData={formData} />
      </div>
      
      <div className="p-4 border border-yellow-600/30 bg-yellow-900/20 rounded-lg">
        <p className="flex items-start text-yellow-200">
          <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          Please review all information carefully. Once submitted, your brand deal will be posted and visible to creators.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
