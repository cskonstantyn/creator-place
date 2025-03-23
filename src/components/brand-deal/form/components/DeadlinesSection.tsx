
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { BrandDealFormData } from "../types/BrandDealTypes";

interface DeadlinesSectionProps {
  formData: BrandDealFormData;
  updateFormData: (data: Partial<BrandDealFormData>) => void;
}

const DeadlinesSection: React.FC<DeadlinesSectionProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deadline to Apply */}
        <div className="space-y-2">
          <label htmlFor="deadlineToApply" className="block text-sm font-medium">
            Deadline to Apply <span className="text-red-500">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex justify-between bg-afghan-background-dark border-white/10 text-left font-normal"
              >
                {formData.deadlineToApply ? (
                  <span>{format(formData.deadlineToApply, "PPP")}</span>
                ) : (
                  <span className="text-gray-400">Select deadline to apply</span>
                )}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.deadlineToApply}
                onSelect={(date) => updateFormData({ deadlineToApply: date })}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Deadline to Post */}
        <div className="space-y-2">
          <label htmlFor="deadlineToPost" className="block text-sm font-medium">
            Deadline to Post <span className="text-red-500">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex justify-between bg-afghan-background-dark border-white/10 text-left font-normal"
              >
                {formData.deadlineToPost ? (
                  <span>{format(formData.deadlineToPost, "PPP")}</span>
                ) : (
                  <span className="text-gray-400">Select deadline to post</span>
                )}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.deadlineToPost}
                onSelect={(date) => updateFormData({ deadlineToPost: date })}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </section>
  );
};

export default DeadlinesSection;
