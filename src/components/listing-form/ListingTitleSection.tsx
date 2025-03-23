
import { Input } from "@/components/ui/input";

interface ListingTitleSectionProps {
  title: string;
  setTitle: (title: string) => void;
  error?: string;
}

const ListingTitleSection = ({ title, setTitle, error }: ListingTitleSectionProps) => {
  return (
    <div className="mb-6">
      <label htmlFor="title" className="block text-sm font-medium mb-2">
        Title <span className="text-red-500">*</span>
      </label>
      <Input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter listing title"
        className="bg-afghan-background-dark border-white/10 focus:border-afghan-purple"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
    </div>
  );
};

export default ListingTitleSection;
