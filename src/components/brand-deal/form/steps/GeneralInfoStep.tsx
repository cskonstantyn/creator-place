
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrandDealFormData } from "../types/BrandDealTypes";
import { InfoIcon, User, BriefcaseBusiness, MessageSquare } from "lucide-react";

interface GeneralInfoStepProps {
  formData: BrandDealFormData;
  updateFormData: (data: Partial<BrandDealFormData>) => void;
}

// Mock industry options
const industryOptions = [
  "Fashion & Apparel",
  "Food & Beverage",
  "Beauty & Cosmetics",
  "Technology",
  "Health & Wellness",
  "Travel & Hospitality",
  "Entertainment",
  "Home & Decor",
  "Sports & Fitness",
  "Education",
  "Finance"
];

// Mock promotion options
const promotionOptions = [
  "Product Review",
  "Brand Awareness",
  "Event Promotion",
  "Product Launch",
  "Discount Code",
  "Giveaway/Contest",
  "Tutorial/How-To",
  "Behind the Scenes",
  "Day in the Life"
];

const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center">
          <InfoIcon className="mr-3 h-7 w-7 text-purple-500" />
          General Info
        </h2>
        <p className="text-gray-400">
          This section is for you to define what you want to promote with creator efforts
        </p>
      </div>
      
      <div className="glassmorphism rounded-xl p-7 space-y-7">
        {/* Brand Deal Name */}
        <div className="space-y-3">
          <label htmlFor="dealTitle" className="flex items-center text-sm font-medium">
            <User className="h-4 w-4 mr-2 text-purple-500" />
            Brand Deal Name
          </label>
          <Input
            id="dealTitle"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="Insert a catchy unique name for your brand deal"
            className="bg-gray-900/60 border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
        
        {/* Industry */}
        <div className="space-y-3">
          <label htmlFor="industry" className="flex items-center text-sm font-medium">
            <BriefcaseBusiness className="h-4 w-4 mr-2 text-purple-500" />
            What industry are you in?
          </label>
          <Select
            value={formData.industry}
            onValueChange={(value) => updateFormData({ industry: value })}
          >
            <SelectTrigger id="industry" className="bg-gray-900/60 border-gray-700 h-11 px-4 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
              <SelectValue placeholder="Please select..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {industryOptions.map((industry) => (
                <SelectItem key={industry} value={industry} className="focus:bg-purple-900/60 focus:text-white">
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Promotion Type */}
        <div className="space-y-3">
          <label htmlFor="promotionType" className="flex items-center text-sm font-medium">
            <MessageSquare className="h-4 w-4 mr-2 text-purple-500" />
            What are you willing to promote?
          </label>
          <Select
            value={formData.promotionType}
            onValueChange={(value) => updateFormData({ promotionType: value })}
          >
            <SelectTrigger id="promotionType" className="bg-gray-900/60 border-gray-700 h-11 px-4 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
              <SelectValue placeholder="Please select..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {promotionOptions.map((type) => (
                <SelectItem key={type} value={type} className="focus:bg-purple-900/60 focus:text-white">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Description */}
        <div className="space-y-3">
          <label htmlFor="description" className="flex items-center text-sm font-medium">
            <InfoIcon className="h-4 w-4 mr-2 text-purple-500" />
            Description
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Provide details about what you're promoting"
            className="min-h-24 bg-gray-900/60 border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoStep;
