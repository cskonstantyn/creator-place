import React from "react";
import { Users, Instagram, Film, Hash, LinkIcon, Copy, MapPin } from "lucide-react";
import { AtSign } from "../Icons";

interface RequirementsTabProps {
  totalCreatorsNeeded: number;
  followersRequired: number;
  contentType: string;
  accountsToMention: string[];
  hashtags: string[];
  location: string;
  specialInstructions: string;
  guestsAllowed: number;
  copyToClipboard: (text: string, message: string) => void;
}

export const RequirementsTab: React.FC<RequirementsTabProps> = ({
  totalCreatorsNeeded,
  followersRequired,
  contentType,
  accountsToMention,
  hashtags,
  location,
  specialInstructions,
  guestsAllowed,
  copyToClipboard
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="content-card flex flex-col items-center justify-center text-center">
          <Users className="h-8 w-8 mb-2 text-purple-400" />
          <h3 className="text-sm font-medium text-gray-400">Total Creators Needed</h3>
          <p className="text-2xl font-bold text-white">{totalCreatorsNeeded}</p>
        </div>
        
        <div className="content-card flex flex-col items-center justify-center text-center">
          <Instagram className="h-8 w-8 mb-2 text-purple-400" />
          <h3 className="text-sm font-medium text-gray-400">Followers Required</h3>
          <p className="text-2xl font-bold text-white">{followersRequired.toLocaleString()}+</p>
        </div>
        
        <div className="content-card flex flex-col items-center justify-center text-center">
          <Film className="h-8 w-8 mb-2 text-purple-400" />
          <h3 className="text-sm font-medium text-gray-400">Content Type</h3>
          <p className="text-2xl font-bold text-white">{contentType}</p>
        </div>
      </div>
      
      <div className="content-card">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <AtSign className="mr-2" />
          <span>Accounts to Mention</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {accountsToMention.map((account, index) => (
            <div 
              key={index}
              className="flex items-center bg-purple-900/30 rounded-full px-3 py-1.5 text-sm"
            >
              <span className="text-white">{account}</span>
              <button 
                onClick={() => copyToClipboard(account, `${account} copied to clipboard!`)}
                className="ml-2 text-gray-400 hover:text-white"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="content-card">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <Hash className="h-5 w-5 mr-2 text-purple-400" />
          Hashtags to Include
        </h2>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((hashtag, index) => (
            <div 
              key={index}
              className="flex items-center bg-blue-900/30 rounded-full px-3 py-1.5 text-sm"
            >
              <span className="text-white">{hashtag}</span>
              <button 
                onClick={() => copyToClipboard(hashtag, `${hashtag} copied to clipboard!`)}
                className="ml-2 text-gray-400 hover:text-white"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="content-card">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <LinkIcon className="h-5 w-5 mr-2 text-purple-400" />
          Location Details
        </h2>
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Address</h3>
            <p className="text-white bg-afghan-background-dark/50 p-3 rounded-md">
              123 Coffee Street, Downtown Seattle, WA 98101
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Special Instructions</h3>
            <p className="text-white bg-afghan-background-dark/50 p-3 rounded-md">
              {specialInstructions}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Guests Allowed</h3>
            <p className="text-white bg-afghan-background-dark/50 p-3 rounded-md">
              {guestsAllowed} guest per creator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
