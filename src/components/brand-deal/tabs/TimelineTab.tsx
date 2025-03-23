
import React from "react";
import { Calendar, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TimelineTabProps {
  deadlineToApply: string;
  deadlineToPost: string;
  paymentDetails: string;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  deadlineToApply,
  deadlineToPost,
  paymentDetails
}) => {
  return (
    <div className="space-y-4">
      <div className="content-card">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-purple-400" />
          Brand Deal Timeline
        </h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-purple-800/50"></div>
          
          {/* Timeline items */}
          <div className="space-y-12">
            <div className="relative pl-16">
              <div className="absolute left-0 flex items-center justify-center w-16 h-16">
                <div className="absolute w-4 h-4 bg-purple-600 rounded-full"></div>
                <div className="absolute w-4 h-4 bg-purple-600 rounded-full animate-pulse-subtle"></div>
              </div>
              <div className="bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-600">
                <h3 className="font-semibold text-white">Deadline To Apply</h3>
                <div className="bg-afghan-background-dark/30 p-2 mt-2 rounded flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                  <span className="text-sm text-gray-300">{deadlineToApply}</span>
                </div>
                <button 
                  className="mt-2 text-sm flex items-center text-purple-400 hover:text-purple-300"
                  onClick={() => {
                    // Add to Google Calendar logic would go here
                    toast({
                      title: "Added to calendar",
                      description: "Deadline to apply has been added to your Google Calendar",
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add to Google Calendar
                </button>
              </div>
            </div>
            
            <div className="relative pl-16">
              <div className="absolute left-0 flex items-center justify-center w-16 h-16">
                <div className="absolute w-4 h-4 bg-purple-600 rounded-full"></div>
                <div className="absolute w-4 h-4 bg-purple-600 rounded-full animate-pulse-subtle"></div>
              </div>
              <div className="bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-600">
                <h3 className="font-semibold text-white">Deadline To Post</h3>
                <div className="bg-afghan-background-dark/30 p-2 mt-2 rounded flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                  <span className="text-sm text-gray-300">{deadlineToPost}</span>
                </div>
                <button 
                  className="mt-2 text-sm flex items-center text-purple-400 hover:text-purple-300"
                  onClick={() => {
                    // Add to Google Calendar logic would go here
                    toast({
                      title: "Added to calendar",
                      description: "Deadline to post has been added to your Google Calendar",
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add to Google Calendar
                </button>
              </div>
            </div>
            
            <div className="relative pl-16">
              <div className="absolute left-0 flex items-center justify-center w-16 h-16">
                <div className="absolute w-4 h-4 bg-purple-600 rounded-full"></div>
                <div className="absolute w-4 h-4 bg-purple-600 rounded-full animate-pulse-subtle"></div>
              </div>
              <div className="bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-600">
                <h3 className="font-semibold text-white">Payment Processing</h3>
                <div className="mt-2 text-sm text-gray-300">
                  <p>{paymentDetails}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
