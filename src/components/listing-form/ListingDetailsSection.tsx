
import { Input } from "@/components/ui/input";

interface ListingDetailsSectionProps {
  brand: string;
  setBrand: (brand: string) => void;
  model: string;
  setModel: (model: string) => void;
  year: string;
  setYear: (year: string) => void;
  mileage: string;
  setMileage: (mileage: string) => void;
}

const ListingDetailsSection = ({
  brand,
  setBrand,
  model,
  setModel,
  year,
  setYear,
  mileage,
  setMileage
}: ListingDetailsSectionProps) => {
  return (
    <>
      {/* Brand & Model (for vehicles and electronics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium mb-2">
            Brand
          </label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter brand"
            className="bg-afghan-background-dark border-white/10 focus:border-afghan-purple"
          />
        </div>
        
        <div>
          <label htmlFor="model" className="block text-sm font-medium mb-2">
            Model
          </label>
          <Input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Enter model"
            className="bg-afghan-background-dark border-white/10 focus:border-afghan-purple"
          />
        </div>
      </div>
      
      {/* Year & Mileage (for vehicles) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-2">
            Year
          </label>
          <Input
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year"
            className="bg-afghan-background-dark border-white/10 focus:border-afghan-purple"
          />
        </div>
        
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium mb-2">
            Mileage
          </label>
          <Input
            id="mileage"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="Enter mileage"
            className="bg-afghan-background-dark border-white/10 focus:border-afghan-purple"
          />
        </div>
      </div>
    </>
  );
};

export default ListingDetailsSection;
