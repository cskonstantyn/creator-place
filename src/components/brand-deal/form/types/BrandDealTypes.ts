
export interface BrandDealFormData {
  // General Info
  title: string;
  industry: string;
  promotionType: string;
  description: string;
  
  // Collaboration Info
  platform: string;
  collaborationType: string;
  offlineCollaborationType: string;
  
  // Requirements
  address: string;
  deadlineToApply: Date | undefined;
  deadlineToPost: Date | undefined;
  minFollowers: number;
  creatorsNeeded: number;
  bookingLink: string;
  
  // Brief Details
  brief: string;
  instructions: string;
  hashtags: string;
  socialAccounts: string;
  dosAndDonts: string;
  
  // Guest Info
  guestsAllowed: string;
  guestInstructions: string;
  
  // Media
  images: File[];
}
