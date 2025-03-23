
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { discountCategories } from "./ListingCategories";

interface ListingCategorySectionProps {
  category: string;
  setCategory: (category: string) => void;
  subcategory: string;
  setSubcategory: (subcategory: string) => void;
  getSubcategories: () => string[];
  errors: Record<string, string>;
}

const ListingCategorySection = ({
  category,
  setCategory,
  subcategory,
  setSubcategory,
  getSubcategories,
  errors
}: ListingCategorySectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-afghan-background-dark border-white/10">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {discountCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>
      
      <div>
        <label htmlFor="subcategory" className="block text-sm font-medium mb-2">
          Subcategory <span className="text-red-500">*</span>
        </label>
        <Select 
          value={subcategory} 
          onValueChange={setSubcategory}
          disabled={!category}
        >
          <SelectTrigger className="bg-afghan-background-dark border-white/10">
            <SelectValue placeholder="Select a subcategory" />
          </SelectTrigger>
          <SelectContent>
            {getSubcategories().map((subcat) => (
              <SelectItem key={subcat} value={subcat}>
                {subcat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory}</p>}
      </div>
    </div>
  );
};

export default ListingCategorySection;
