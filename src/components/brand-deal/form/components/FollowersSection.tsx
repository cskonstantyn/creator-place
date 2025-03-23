
import React from "react";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { BrandDealFormData } from "../types/BrandDealTypes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FollowersSectionProps {
  formData: BrandDealFormData;
  updateFormData: (data: Partial<BrandDealFormData>) => void;
}

const FollowersSection: React.FC<FollowersSectionProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Min Followers */}
        <div className="space-y-2">
          <div className="flex items-center">
            <label htmlFor="minFollowers" className="block text-sm font-medium">
              Minimum Followers <span className="text-red-500">*</span>
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 ml-2 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Minimum number of followers required for creators to apply</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="minFollowers"
            type="number"
            min={0}
            value={formData.minFollowers}
            onChange={(e) => updateFormData({ minFollowers: parseInt(e.target.value) || 0 })}
            placeholder="Enter minimum followers required"
            className="bg-afghan-background-dark border-white/10 focus:border-afghan-purple"
          />
        </div>

        {/* Creators Needed */}
        <div className="space-y-2">
          <div className="flex items-center">
            <label htmlFor="creatorsNeeded" className="block text-sm font-medium">
              Creators Needed <span className="text-red-500">*</span>
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 ml-2 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Total number of creators you want for this campaign</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="creatorsNeeded"
            type="number"
            min={1}
            value={formData.creatorsNeeded}
            onChange={(e) => updateFormData({ creatorsNeeded: parseInt(e.target.value) || 1 })}
            placeholder="Enter number of creators needed"
            className="bg-afghan-background-dark border-white/10 focus:border-afghan-purple"
          />
        </div>
      </div>
    </section>
  );
};

export default FollowersSection;
