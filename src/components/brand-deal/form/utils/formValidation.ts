
import { BrandDealFormData } from "../types/BrandDealTypes";
import { toast } from "@/hooks/use-toast";

export const validateStep = (
  currentStep: number, 
  formData: BrandDealFormData
): boolean => {
  // Basic validation based on step
  switch (currentStep) {
    case 1: // General Info
      if (!formData.title.trim()) {
        toast({
          title: "Missing information",
          description: "Please enter a brand deal name",
          variant: "destructive"
        });
        return false;
      }
      if (!formData.industry) {
        toast({
          title: "Missing information",
          description: "Please select an industry",
          variant: "destructive"
        });
        return false;
      }
      return true;

    case 2: // Collaboration
      if (!formData.platform) {
        toast({
          title: "Missing information",
          description: "Please select a platform",
          variant: "destructive"
        });
        return false;
      }
      return true;

    case 3: // Requirements
      if (!formData.address.trim()) {
        toast({
          title: "Missing information",
          description: "Please enter an address",
          variant: "destructive"
        });
        return false;
      }
      if (!formData.deadlineToApply) {
        toast({
          title: "Missing information",
          description: "Please select a deadline to apply",
          variant: "destructive"
        });
        return false;
      }
      return true;

    case 4: // Brief Details
      if (!formData.brief.trim()) {
        toast({
          title: "Missing information",
          description: "Please provide a brief description",
          variant: "destructive"
        });
        return false;
      }
      return true;

    case 5: // Guest Info
      if (!formData.guestsAllowed) {
        toast({
          title: "Missing information",
          description: "Please specify if guests are allowed",
          variant: "destructive"
        });
        return false;
      }
      return true;

    default:
      return true;
  }
};
