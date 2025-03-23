
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface ListingLocationSectionProps {
  location: string;
  setLocation: (location: string) => void;
  error?: string;
}

const ListingLocationSection = ({
  location,
  setLocation,
  error
}: ListingLocationSectionProps) => {
  return (
    <div className="mb-6">
      <label htmlFor="location" className="block text-sm font-medium mb-2">
        Location <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="pl-10 bg-afghan-background-dark border-white/10 focus:border-afghan-purple"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ListingLocationSection;
