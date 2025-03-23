
import React from "react";
import { useFormContext } from "../context/FormContext";

// Import steps
import GeneralInfoStep from "../steps/GeneralInfoStep";
import CollaborationInfoStep from "../steps/CollaborationInfoStep";
import RequirementsStep from "../steps/RequirementsStep";
import BriefDetailsStep from "../steps/BriefDetailsStep";
import GuestInfoStep from "../steps/GuestInfoStep";
import ReviewStep from "../steps/ReviewStep";

const StepRenderer: React.FC = () => {
  const { currentStep, formData, updateFormData } = useFormContext();

  switch (currentStep) {
    case 1:
      return <GeneralInfoStep formData={formData} updateFormData={updateFormData} />;
    case 2:
      return <CollaborationInfoStep formData={formData} updateFormData={updateFormData} />;
    case 3:
      return <RequirementsStep formData={formData} updateFormData={updateFormData} />;
    case 4:
      return <BriefDetailsStep formData={formData} updateFormData={updateFormData} />;
    case 5:
      return <GuestInfoStep formData={formData} updateFormData={updateFormData} />;
    case 6:
      return <ReviewStep formData={formData} />;
    default:
      return null;
  }
};

export default StepRenderer;
