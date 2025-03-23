import React from "react";
import { Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DealImageProps {
  imageUrl: string;
  title: string;
  status: string;
  category: string;
  isFavorite: boolean;
  toggleFavorite: () => void;
  onShare: () => void;
}

export const DealImage: React.FC<DealImageProps> = ({
  imageUrl,
  title,
  status,
  category,
  isFavorite,
  toggleFavorite,
  onShare
}) => {
  return (
    <div className="relative rounded-xl overflow-hidden mx-auto max-w-2xl h-64 sm:h-80 md:h-[400px] mb-4">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-contain"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      
      {/* Status badge */}
      <div className="absolute top-4 left-4">
        <Badge className="bg-green-600 hover:bg-green-700">{status}</Badge>
      </div>
      
      {/* Favorite button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm p-2 rounded-full transition-colors hover:bg-black/50"
      >
        <Heart
          className={`h-5 w-5 ${isFavorite ? "text-red-500 fill-red-500" : "text-white"}`}
        />
      </button>
      
      {/* Category */}
      <div className="absolute bottom-4 left-4">
        <Badge className="bg-purple-600 hover:bg-purple-700">{category}</Badge>
      </div>
      
      {/* Share button */}
      <button
        onClick={onShare}
        className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm p-2 rounded-full transition-colors hover:bg-black/50"
      >
        <Share2 className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};
