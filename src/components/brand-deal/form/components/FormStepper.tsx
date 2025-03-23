import React, { useState } from "react";
import { useFormContext } from "../context/FormContext";
import { validateStep } from "../utils/formValidation";
import ProgressStepper from "./ProgressStepper";
import StepNavigation from "./StepNavigation";
import StepRenderer from "./StepRenderer";
import { BrandDealFormData } from "../types/BrandDealTypes";

interface FormStepperProps {
  onSubmit: (data: BrandDealFormData) => void | Promise<void>;
  children: React.ReactNode;
}

const FormStepper: React.FC<FormStepperProps> = ({ onSubmit, children }) => {
  const { currentStep, setCurrentStep, steps, formData } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = () => {
    if (validateStep(currentStep, formData)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="w-full">
      <ProgressStepper steps={steps} currentStep={currentStep} />
      
      <div className="bg-afghan-background-dark rounded-xl p-6 border border-white/10">
        <StepRenderer />
        
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={handlePrevStep}
          onNext={handleNextStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isLastStep={isLastStep}
        />
      </div>
    </div>
  );
};

export default FormStepper;
