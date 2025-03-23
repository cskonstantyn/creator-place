
import React from "react";
import { ShoppingBag, AlertCircle, CheckCircle } from "lucide-react";
import { Star } from "../Icons";

interface DetailsTabProps {
  description: string;
  benefits: string;
  dosAndDonts: string[];
}

export const DetailsTab: React.FC<DetailsTabProps> = ({
  description,
  benefits,
  dosAndDonts
}) => {
  return (
    <div className="space-y-4">
      <div className="content-card">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2 text-purple-400" />
          Product/Service Description
        </h2>
        <p className="text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="content-card">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <Star className="h-5 w-5 mr-2 text-purple-400" />
          Creator's Benefits
        </h2>
        <p className="text-gray-300 leading-relaxed">
          {benefits}
        </p>
      </div>
      
      <div className="content-card">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-purple-400" />
          Do's and Don'ts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-400">Do's:</h3>
            <ul className="space-y-1">
              {dosAndDonts.slice(0, 2).map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">{item.replace("Do ", "")}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-red-400">Don'ts:</h3>
            <ul className="space-y-1">
              {dosAndDonts.slice(2).map((item, index) => (
                <li key={index} className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">{item.replace("Don't ", "")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
