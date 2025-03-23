import React from "react";
import { Check } from "lucide-react";

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  // Calculate progress percentage
  const progressPercentage = ((currentStep) / (steps.length - 1)) * 100;
  
  return (
    <div className="w-full mb-8">
      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-1/2 left-0 h-1 bg-gray-700 w-full -translate-y-1/2 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center z-10 mb-2
                      ${isCompleted 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                        : isCurrent 
                          ? 'bg-afghan-background-dark border-2 border-purple-500 text-white' 
                          : 'bg-afghan-background-dark border border-gray-700 text-gray-500'
                      }
                      transition-all duration-300
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span 
                    className={`
                      text-sm font-medium whitespace-nowrap
                      ${isCompleted || isCurrent ? 'text-white' : 'text-gray-500'}
                    `}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-white">
            {steps[currentStep]}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;
