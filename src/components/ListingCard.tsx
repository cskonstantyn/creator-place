import { Heart, MapPin, Clock, Eye, Percent } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/use-favorites";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  category: string;
  isFeatured?: boolean;
  createdAt: string;
  dealValue?: string;
  brandName?: string;
  expires?: string;
  views?: number;
  // Add missing properties that are used in HomePage
  rooms?: number;
  bathrooms?: number;
}

const ListingCard = ({
  id,
  title,
  price,
  location,
  imageUrl,
  category,
  isFeatured = false,
  createdAt,
  dealValue,
  brandName,
  expires,
  views = 0,
}: ListingCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favoriteItem = {
      id,
      type: 'brand-deal' as const,
      title,
      imageUrl,
      createdAt: new Date().toISOString()
    };
    
    toggleFavorite(favoriteItem);
  };
  
  // Format relative time (simple implementation)
  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const categoryClass = category.toLowerCase().replace(/\s+/g, '-');
  const dealIsFavorite = isFavorite(id, 'brand-deal');

  return (
    <Link to={`/brand-deal/${id}`} className="block h-full">
      <div className="rounded-xl overflow-hidden h-full flex flex-col bg-afghan-background-dark border border-white/5 hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10">
        {/* Image container */}
        <div className="relative">
          {/* Featured badge */}
          {isFeatured && (
            <span className="absolute top-2 left-2 bg-amber-500 text-black text-xs px-2 py-0.5 rounded-md font-medium z-10">
              Featured
            </span>
          )}
          
          {/* Category badge */}
          <span className={`absolute top-2 right-2 bg-purple-900/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md z-10 category-${categoryClass}`}>
            {category}
          </span>
          
          {/* Image */}
          <div className="relative h-40 sm:h-44 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fallback image if the original fails to load
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
              }}
            />
            
            {/* Favorite button */}
            <button 
              className="absolute bottom-2 right-2 bg-black/30 backdrop-blur-sm p-1.5 rounded-full transition-colors hover:bg-black/50 z-10"
              onClick={handleToggleFavorite}
              aria-label={dealIsFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={`h-4 w-4 ${dealIsFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} 
              />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
            <div className="flex items-center ml-1">
              <Percent className="h-3.5 w-3.5 text-amber-400 mr-0.5" />
              <span className="text-amber-400 font-semibold text-sm">${price.toLocaleString()}</span>
            </div>
          </div>
          
          {brandName && (
            <div className="text-xs text-purple-400 mb-1.5">
              {brandName}
            </div>
          )}
          
          {dealValue && (
            <div className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded mb-2 inline-block">
              Value: {dealValue}
            </div>
          )}
          
          <div className="flex flex-col gap-0.5 mt-auto pt-1.5">
            {/* Location */}
            <div className="flex items-center text-xs text-gray-400">
              <MapPin className="h-3 w-3 mr-1 opacity-70" /> 
              <span className="line-clamp-1">{location}</span>
            </div>
            
            {/* Views */}
            <div className="flex items-center text-xs text-gray-400">
              <Eye className="h-3 w-3 mr-1 opacity-70" />
              <span>{views} views</span>
            </div>
            
            {/* Time */}
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="h-3 w-3 mr-1 opacity-70" />
              <span>{formatRelativeTime(createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Expiry date if available */}
        {expires && (
          <div className="px-3 pb-2">
            <span className="text-xs text-orange-400">Expires: {expires}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ListingCard;
