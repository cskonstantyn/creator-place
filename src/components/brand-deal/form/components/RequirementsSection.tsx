
import React from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { BrandDealFormData } from "../types/BrandDealTypes";

interface RequirementsSectionProps {
  formData: BrandDealFormData;
  updateFormData: (data: Partial<BrandDealFormData>) => void;
  error?: string;
}

const RequirementsSection: React.FC<RequirementsSectionProps> = ({
  formData,
  updateFormData,
  error
}) => {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Address */}
        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium">
            Address {formData.collaborationType === "offline" && <span className="text-red-500">*</span>}
          </label>
          <Input
            id="address"
            value={formData.address || ""}
            onChange={(e) => updateFormData({ address: e.target.value })}
            placeholder="Enter address (for offline collaborations)"
            className="bg-afghan-background-dark border-white/10 focus:border-afghan-purple"
          />
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;
