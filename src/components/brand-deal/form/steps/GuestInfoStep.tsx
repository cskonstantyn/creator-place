
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrandDealFormData } from "../types/BrandDealTypes";
import { Users, Info } from "lucide-react";

interface GuestInfoStepProps {
  formData: BrandDealFormData;
  updateFormData: (data: Partial<BrandDealFormData>) => void;
}

const guestOptions = [
  { value: "0", label: "No guests allowed" },
  { value: "1", label: "1 guest per creator" },
  { value: "2", label: "2 guests per creator" },
  { value: "3", label: "3 guests per creator" },
  { value: "unlimited", label: "Unlimited guests" },
];

const GuestInfoStep: React.FC<GuestInfoStepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center">
          <Users className="mr-2 h-6 w-6 text-purple-500" />
          Guest Information
        </h2>
        <p className="text-gray-400">
          This section will help you set the rules for guests coming with the creators to the brand deal
        </p>
      </div>
      
      <div className="glassmorphism rounded-xl p-6 space-y-6">
        {/* Number of Guests */}
        <div className="space-y-2">
          <label htmlFor="guestsAllowed" className="flex items-center text-sm font-medium">
            <Users className="h-4 w-4 mr-2 text-purple-500" />
            How many guests are allowed?
          </label>
          <Select
            value={formData.guestsAllowed}
            onValueChange={(value) => updateFormData({ guestsAllowed: value })}
          >
            <SelectTrigger id="guestsAllowed" className="bg-gray-900/60 border-gray-700">
              <SelectValue placeholder="Please select..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {guestOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Guest Instructions */}
        <div className="space-y-2">
          <label htmlFor="guestInstructions" className="flex items-center text-sm font-medium">
            <Info className="h-4 w-4 mr-2 text-purple-500" />
            Special Instructions for Guests
          </label>
          <Textarea
            id="guestInstructions"
            value={formData.guestInstructions}
            onChange={(e) => updateFormData({ guestInstructions: e.target.value })}
            placeholder="Describe your expectations from guests here..."
            className="min-h-32 bg-gray-900/60 border-gray-700"
          />
          <p className="text-xs text-gray-400">
            Provide any specific rules, dress code, or behavior expectations for guests
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestInfoStep;
