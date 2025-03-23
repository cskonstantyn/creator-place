
import { Textarea } from "@/components/ui/textarea";

interface ListingDescriptionSectionProps {
  description: string;
  setDescription: (description: string) => void;
  error?: string;
}

const ListingDescriptionSection = ({
  description,
  setDescription,
  error
}: ListingDescriptionSectionProps) => {
  return (
    <div className="mb-6">
      <label htmlFor="description" className="block text-sm font-medium mb-2">
        Description <span className="text-red-500">*</span>
      </label>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your listing"
        className="bg-afghan-background-dark border-white/10 focus:border-afghan-purple min-h-[120px]"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <p className="text-xs text-gray-500 mt-1">Minimum 30 characters</p>
    </div>
  );
};

export default ListingDescriptionSection;
