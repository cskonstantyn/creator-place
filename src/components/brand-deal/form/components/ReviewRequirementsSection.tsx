
import React from "react";
import { BrandDealFormData } from "../types/BrandDealTypes";
import { MapPin, Calendar, Users } from "lucide-react";
import { format } from "date-fns";

interface ReviewRequirementsSectionProps {
  formData: BrandDealFormData;
}

const ReviewRequirementsSection: React.FC<ReviewRequirementsSectionProps> = ({ formData }) => {
  return (
    <div className="glassmorphism rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Requirements</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-400 flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-purple-400" />
            Address
          </p>
          <p className="font-medium">{formData.address || "Not provided"}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-400 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-purple-400" />
            Deadline to Apply
          </p>
          <p className="font-medium">
            {formData.deadlineToApply 
              ? format(formData.deadlineToApply, "PPP") 
              : "Not selected"}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-400 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-purple-400" />
            Deadline to Post
          </p>
          <p className="font-medium">
            {formData.deadlineToPost 
              ? format(formData.deadlineToPost, "PPP") 
              : "Not selected"}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-400 flex items-center">
            <Users className="h-4 w-4 mr-1 text-purple-400" />
            Minimum Followers
          </p>
          <p className="font-medium">{formData.minFollowers.toLocaleString()}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-400 flex items-center">
            <Users className="h-4 w-4 mr-1 text-purple-400" />
            Creators Needed
          </p>
          <p className="font-medium">{formData.creatorsNeeded}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewRequirementsSection;
