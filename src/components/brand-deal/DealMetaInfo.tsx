
import React from "react";
import { DollarSign, Calendar, Globe, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DealMetaInfoProps {
  dealValue: string;
  expires: string;
  platform: string;
  publishedBy: string;
  totalCreatorsNeeded: number;
  location: string;
  handleApply: () => void;
}

export const DealMetaInfo: React.FC<DealMetaInfoProps> = ({
  dealValue,
  expires,
  platform,
  publishedBy,
  totalCreatorsNeeded,
  location,
  handleApply
}) => {
  return (
    <div className="space-y-4">
      <Button 
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 font-medium text-lg"
        onClick={handleApply}
      >
        Apply for This Deal
      </Button>
      
      {/* Deal value */}
      <div className="glassmorphism rounded-xl p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Deal Value</p>
          <p className="text-2xl font-bold text-amber-400 flex items-center">
            <DollarSign className="h-5 w-5 mr-1" />
            {dealValue}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-400">Expires</p>
          <p className="text-sm text-orange-400 flex items-center justify-end">
            <Calendar className="h-4 w-4 mr-1" />
            {expires}
          </p>
        </div>
      </div>
      
      {/* Platform info */}
      <div className="glassmorphism rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-300">Publish on</h3>
          <Badge variant="outline" className="text-white border-purple-500">{platform}</Badge>
        </div>
        
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <Globe className="h-4 w-4 mr-2 text-purple-400" />
          <span>Published by {publishedBy}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-400">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-purple-400" />
            <span>{totalCreatorsNeeded} creators needed</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-purple-400" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
