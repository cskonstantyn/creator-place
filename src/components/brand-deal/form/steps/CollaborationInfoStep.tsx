
import React from "react";
import { BrandDealFormData } from "../types/BrandDealTypes";
import { LinkIcon, UsersRound, Store, Users, Mail } from "lucide-react";

interface CollaborationInfoStepProps {
  formData: BrandDealFormData;
  updateFormData: (data: Partial<BrandDealFormData>) => void;
}

// Platform options
const platforms = [
  { id: "instagram", name: "Instagram", icon: "/public/lovable-uploads/3aa068af-351e-44a0-9d28-e980ded30c87.png" },
  { id: "tiktok", name: "TikTok", icon: "/public/lovable-uploads/379fde76-f384-479d-92ab-5c09a8af8a62.png" },
  { id: "youtube", name: "YouTube", icon: "/public/lovable-uploads/4edef6be-386e-42cd-b141-5964c8dc167a.png" },
  { id: "xiaohongshu", name: "Xiaohongshu", icon: "/public/lovable-uploads/10a74911-5816-48b0-8d34-02a0089526b2.png" }
];

// Collaboration types
const collaborationTypes = [
  { id: "online", name: "Online", icon: <LinkIcon className="h-5 w-5 text-white" /> },
  { id: "offline", name: "Offline", icon: <Store className="h-5 w-5 text-white" /> }
];

// Offline collaboration types
const offlineTypes = [
  { id: "store_visit", name: "Store Visiting", icon: <Store className="h-5 w-5 text-white" /> },
  { id: "event_guests", name: "Event Guests", icon: <Users className="h-5 w-5 text-white" /> },
  { id: "grand_opening", name: "Grand Opening", icon: <Mail className="h-5 w-5 text-white" /> }
];

const CollaborationInfoStep: React.FC<CollaborationInfoStepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center">
          <UsersRound className="mr-3 h-7 w-7 text-purple-500" />
          Collaboration Info
        </h2>
        <p className="text-gray-400">
          This section will help define content you want creator to post and set a collaboration type
        </p>
      </div>
      
      <div className="glassmorphism rounded-xl p-7 space-y-10">
        {/* Platform Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Choose Platform
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`relative rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover-lift ${
                  formData.platform === platform.id
                    ? "bg-purple-900/60 border-2 border-purple-500 shadow-lg shadow-purple-500/10"
                    : "bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                }`}
                onClick={() => updateFormData({ platform: platform.id })}
              >
                <img src={platform.icon} alt={platform.name} className="w-12 h-12 mb-3" />
                <span className="text-sm font-medium">{platform.name}</span>
                {formData.platform === platform.id && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Collaboration Type */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Choose collaboration type
          </label>
          <div className="grid grid-cols-2 gap-5">
            {collaborationTypes.map((type) => (
              <div
                key={type.id}
                className={`relative rounded-xl p-6 flex flex-col items-center cursor-pointer transition-all duration-300 hover-lift ${
                  formData.collaborationType === type.id
                    ? "bg-purple-900/60 border-2 border-purple-500 shadow-lg shadow-purple-500/10"
                    : "bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                }`}
                onClick={() => updateFormData({ collaborationType: type.id })}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-3 shadow-md">
                  {type.icon}
                </div>
                <span className="text-base font-medium">{type.name}</span>
                {formData.collaborationType === type.id && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Offline Collaboration Type (conditionally shown) */}
        {formData.collaborationType === "offline" && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Choose Offline Collaboration Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              {offlineTypes.map((type) => (
                <div
                  key={type.id}
                  className={`relative rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover-lift ${
                    formData.offlineCollaborationType === type.id
                      ? "bg-purple-900/60 border-2 border-purple-500 shadow-lg shadow-purple-500/10"
                      : "bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                  }`}
                  onClick={() => updateFormData({ offlineCollaborationType: type.id })}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-3 shadow-md">
                    {type.icon}
                  </div>
                  <span className="text-xs font-medium text-center">{type.name}</span>
                  {formData.offlineCollaborationType === type.id && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationInfoStep;
