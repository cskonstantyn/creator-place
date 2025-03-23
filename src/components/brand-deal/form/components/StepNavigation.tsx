import React from "react";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isLastStep: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  isLastStep,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-10 pt-6 border-t border-white/10">
      <div className="mb-4 sm:mb-0">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0 || isSubmitting}
          className="flex items-center gap-2 bg-transparent border-white/10 hover:bg-afghan-background-light"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
      </div>
      
      <div className="flex gap-3">
        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Submit Deal</span>
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white min-w-[120px]"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
