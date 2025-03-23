
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

interface ListingPriceSectionProps {
  price: string;
  setPrice: (price: string) => void;
  error?: string;
}

const ListingPriceSection = ({ price, setPrice, error }: ListingPriceSectionProps) => {
  return (
    <div className="mb-6">
      <label htmlFor="price" className="block text-sm font-medium mb-2">
        Price <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <DollarSign className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          className="bg-afghan-background-dark border-white/10 focus:border-afghan-purple pl-10"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ListingPriceSection;
