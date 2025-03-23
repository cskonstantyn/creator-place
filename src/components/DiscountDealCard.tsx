import { Link } from "react-router-dom";
import { MapPin, Clock, Eye, Tag, Store, Heart } from "lucide-react";
import { DiscountDeal } from "@/services/discountDealService";
import { format } from "date-fns";
import { useFavorites } from "@/hooks/use-favorites";

interface DiscountDealCardProps {
  deal: DiscountDeal;
}

const DiscountDealCard = ({ deal }: DiscountDealCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favoriteItem = {
      id: deal.id,
      type: 'discount-deal' as const,
      title: deal.title,
      imageUrl: deal.image_url,
      createdAt: new Date().toISOString()
    };
    
    toggleFavorite(favoriteItem);
  };
  
  // Format campaign period
  const formatCampaignPeriod = () => {
    if (!deal.campaign_period_start || !deal.campaign_period_end) return "";
    
    const startDate = new Date(deal.campaign_period_start);
    const endDate = new Date(deal.campaign_period_end);
    
    return `${format(startDate, "yyyy-MM-dd")} to ${format(endDate, "yyyy-MM-dd")}`;
  };
  
  const dealIsFavorite = isFavorite(deal.id, 'discount-deal');

  // Safely handle missing properties
  const tags = deal.tags || [];
  const storeName = deal.store_name || deal.company_name || "Store";
  const couponCode = deal.coupon_code || deal.discount_code || "DISCOUNT";
  const originalPrice = deal.original_price || 0;
  const discountedPrice = deal.discounted_price || 0;
  const location = deal.location || "Online";
  const views = deal.views || 0;
  const itemsSold = deal.items_sold || 0;
  const usageLimit = deal.usage_limit || "Unlimited";
  const discountPercentage = deal.discount_percentage || 0;

  return (
    <Link to={`/discount-deal/${deal.id}`} className="block h-full">
      <div className="rounded-xl overflow-hidden h-full flex flex-col bg-afghan-background-dark border border-white/5 hover:opacity-90 transition-all duration-300">
        {/* Image container */}
        <div className="relative">
          {/* Discount badge */}
          <span className="absolute top-2 left-2 bg-green-500 text-black text-xs px-2 py-1 rounded-full font-medium z-10">
            {discountPercentage}% OFF
          </span>
          
          {/* Category badges */}
          <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end max-w-[70%]">
            {tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="bg-purple-900/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md z-10">
                {tag}
              </span>
            ))}
          </div>
          
          {/* Image */}
          <div className="relative h-40 sm:h-44 overflow-hidden">
            <img 
              src={deal.image_url || "https://placehold.co/600x400?text=No+Image"} 
              alt={deal.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image";
              }}
            />
            
            {/* Favorite button */}
            <button 
              className="absolute bottom-2 right-2 bg-black/30 backdrop-blur-sm p-1.5 rounded-full transition-colors hover:bg-black/50 z-10"
              onClick={handleToggleFavorite}
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
            <h3 className="font-medium text-sm line-clamp-1">{deal.title}</h3>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-400 font-semibold text-sm">${discountedPrice.toFixed(2)}</span>
            <span className="text-gray-400 text-xs line-through">${originalPrice.toFixed(2)}</span>
          </div>
          
          <div className="text-xs text-purple-400 mb-1.5 flex items-center gap-1">
            <Store className="h-3 w-3" />
            <span>{storeName}</span>
          </div>
          
          <div className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded mb-2 inline-flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span>Code: {couponCode}</span>
          </div>
          
          <div className="flex flex-col gap-0.5 mt-auto pt-1.5">
            {/* Location */}
            <div className="flex items-center text-xs text-gray-400">
              <MapPin className="h-3 w-3 mr-1 opacity-70" /> 
              <span className="line-clamp-1">{location}</span>
            </div>
            
            {/* Views */}
            <div className="flex items-center text-xs text-gray-400">
              <Eye className="h-3 w-3 mr-1 opacity-70" />
              <span>{views} views • {itemsSold} sold</span>
            </div>
            
            {/* Campaign period */}
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="h-3 w-3 mr-1 opacity-70" />
              <span className="line-clamp-1">{formatCampaignPeriod()}</span>
            </div>
          </div>
        </div>
        
        {/* Usage limit */}
        <div className="px-3 pb-2">
          <span className="text-xs text-orange-400">Limit: {usageLimit} per person</span>
        </div>
      </div>
    </Link>
  );
};

export default DiscountDealCard;
