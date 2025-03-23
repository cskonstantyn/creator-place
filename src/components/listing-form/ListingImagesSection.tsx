
import { Upload } from "lucide-react";

interface ListingImagesSectionProps {
  images: File[];
  imagePreviewUrls: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  error?: string;
}

const ListingImagesSection = ({
  images,
  imagePreviewUrls,
  handleImageChange,
  removeImage,
  error
}: ListingImagesSectionProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        Images <span className="text-red-500">*</span>
      </label>
      
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 mb-4 text-center">
        <input
          type="file"
          id="images"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          disabled={images.length >= 5}
        />
        <label
          htmlFor="images"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-400">
            {images.length === 0 
              ? "Drag and drop images here or click to browse" 
              : "Upload more images (maximum 5)"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Upload at least one image (maximum 5)
          </p>
        </label>
      </div>
      
      {/* Image previews */}
      {imagePreviewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
          {imagePreviewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ListingImagesSection;
