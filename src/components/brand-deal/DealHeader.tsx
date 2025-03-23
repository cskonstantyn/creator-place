import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DealHeaderProps {
  title: string;
  brandName: string;
  createdAt: string;
  isFavorite: boolean;
  toggleFavorite: () => void;
  onShare: () => void;
}

export const DealHeader: React.FC<DealHeaderProps> = ({
  title,
  brandName,
  createdAt,
  isFavorite,
  toggleFavorite,
  onShare
}) => {
  return (
    <>
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Deals
        </Link>
      </div>
      
      {/* Title and basic info */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 gradient-text">{title}</h1>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="outline" className="bg-afghan-purple/30 text-white">
            {brandName}
          </Badge>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-400 flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Posted on {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </>
  );
};
