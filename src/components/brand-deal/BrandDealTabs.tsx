import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailsTab } from "./tabs/DetailsTab";
import { RequirementsTab } from "./tabs/RequirementsTab";
import { ReferencesTab } from "./tabs/ReferencesTab";
import { TimelineTab } from "./tabs/TimelineTab";
import { BrandDeal } from "@/services/brandDealService";

interface BrandDealTabsProps {
  brandDeal: BrandDeal;
}

export const BrandDealTabs: React.FC<BrandDealTabsProps> = ({
  brandDeal
}) => {
  // Function to handle copying text to clipboard within tabs
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    // You would typically show a toast notification here
    console.log(message);
  };

  return (
    <Tabs defaultValue="details" className="space-y-4">
      <TabsList className="glassmorphism w-full">
        <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
        <TabsTrigger value="requirements" className="flex-1">Requirements</TabsTrigger>
        <TabsTrigger value="references" className="flex-1">References</TabsTrigger>
        <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <DetailsTab 
          description={brandDeal.description}
          benefits={brandDeal.benefits}
          dosAndDonts={brandDeal.dos_and_donts}
        />
      </TabsContent>

      <TabsContent value="requirements">
        <RequirementsTab 
          totalCreatorsNeeded={brandDeal.creators_needed}
          followersRequired={brandDeal.followers_required}
          contentType={brandDeal.content_type}
          accountsToMention={brandDeal.accounts_to_mention}
          hashtags={brandDeal.hashtags}
          location={brandDeal.location}
          specialInstructions={brandDeal.special_instructions || ""}
          guestsAllowed={brandDeal.guests_allowed}
          copyToClipboard={copyToClipboard}
        />
      </TabsContent>

      <TabsContent value="references">
        <ReferencesTab 
          referenceImages={brandDeal.reference_images}
          referenceVideos={brandDeal.reference_videos}
          hashtags={brandDeal.hashtags}
          accountsToMention={brandDeal.accounts_to_mention}
          location={brandDeal.location}
          copyToClipboard={copyToClipboard}
        />
      </TabsContent>

      <TabsContent value="timeline">
        <TimelineTab 
          deadlineToApply={brandDeal.deadline_to_apply}
          deadlineToPost={brandDeal.deadline_to_post}
          paymentDetails={`Payment will be processed within 14 days after successful content submission and verification. ${brandDeal.promotion_type === 'Paid Collaboration' ? 'The agreed amount is $' + brandDeal.price + '.' : ''}`}
        />
      </TabsContent>
    </Tabs>
  );
};
