import React from "react";
import { BrandDeal } from "@/services/brandDealService";
import { DealHeader } from "./DealHeader";
import { DealImage } from "./DealImage";
import { DealMetaInfo } from "./DealMetaInfo";
import { BrandDealTabs } from "./BrandDealTabs";
import { CallToAction } from "./CallToAction";

interface BrandDealContentProps {
  brandDeal: BrandDeal;
  isFavorite: boolean;
  toggleFavorite: () => void;
  onShare: () => void;
  handleApply: () => void;
}

export const BrandDealContent: React.FC<BrandDealContentProps> = ({
  brandDeal,
  isFavorite,
  toggleFavorite,
  onShare,
  handleApply
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <DealHeader 
        title={brandDeal.title}
        brandName={brandDeal.brand_name}
        createdAt={brandDeal.created_at}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
        onShare={onShare}
      />

      <DealImage 
        imageUrl={brandDeal.image_url}
        title={brandDeal.title}
        status={brandDeal.status}
        category={brandDeal.category}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
        onShare={onShare}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <DealMetaInfo 
            dealValue={brandDeal.deal_value}
            expires={brandDeal.expires}
            platform={brandDeal.platform}
            publishedBy={brandDeal.brand_name}
            totalCreatorsNeeded={brandDeal.creators_needed}
            location={brandDeal.location}
            handleApply={handleApply}
          />
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <BrandDealTabs 
            brandDeal={brandDeal}
          />
          
          <CallToAction handleApply={handleApply} />
        </div>
      </div>
    </div>
  );
};
