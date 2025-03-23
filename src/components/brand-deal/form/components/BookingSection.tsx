
import React from "react";
import { Input } from "@/components/ui/input";
import { BrandDealFormData } from "../types/BrandDealTypes";

interface BookingSectionProps {
  formData: BrandDealFormData;
  updateFormData: (data: Partial<BrandDealFormData>) => void;
}

const BookingSection: React.FC<BookingSectionProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Booking Link */}
        <div className="space-y-2">
          <label htmlFor="bookingLink" className="block text-sm font-medium">
            Booking Link
          </label>
          <Input
            id="bookingLink"
            value={formData.bookingLink || ""}
            onChange={(e) => updateFormData({ bookingLink: e.target.value })}
            placeholder="Add a link to an external booking page (optional)"
            className="bg-afghan-background-dark border-white/10 focus:border-afghan-purple"
          />
          <p className="text-xs text-gray-400">
            Optional: Add a link to a booking page or calendar if applicable
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
