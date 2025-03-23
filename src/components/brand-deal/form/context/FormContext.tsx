
import React, { createContext, useContext, useState } from "react";
import { BrandDealFormData } from "../types/BrandDealTypes";

interface FormContextType {
  formData: BrandDealFormData;
  updateFormData: (data: Partial<BrandDealFormData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  steps: string[];
  showAITools: boolean;
  setShowAITools: (show: boolean) => void;
  isAIGenerated: boolean;
  setIsAIGenerated: (isGenerated: boolean) => void;
  jumpToReview: () => void;
}

const defaultFormData: BrandDealFormData = {
  title: "",
  industry: "",
  promotionType: "",
  description: "",
  platform: "",
  collaborationType: "",
  offlineCollaborationType: "",
  address: "",
  deadlineToApply: undefined,
  deadlineToPost: undefined,
  minFollowers: 500,
  creatorsNeeded: 1,
  bookingLink: "",
  brief: "",
  instructions: "",
  hashtags: "",
  socialAccounts: "",
  dosAndDonts: "",
  guestsAllowed: "",
  guestInstructions: "",
  images: []
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<BrandDealFormData>(defaultFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAITools, setShowAITools] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  const steps = [
    "General Info",
    "Collaboration",
    "Requirements",
    "Brief Details",
    "Guest Info",
    "Review"
  ];

  const updateFormData = (data: Partial<BrandDealFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  // Helper function to jump to the review step (last step)
  const jumpToReview = () => {
    setCurrentStep(6); // Assuming 6 is the review step
  };

  return (
    <FormContext.Provider value={{ 
      formData, 
      updateFormData, 
      currentStep, 
      setCurrentStep, 
      steps,
      showAITools,
      setShowAITools,
      isAIGenerated,
      setIsAIGenerated,
      jumpToReview
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
