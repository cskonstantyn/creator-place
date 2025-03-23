
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandDealFormData } from "../types/BrandDealTypes";
import { FileText, Hash, AtSign, ListChecks, Sparkles } from "lucide-react";
import { ContentBriefGenerator } from "@/components/ai-features/ContentBriefGenerator";
import { useFormContext } from "../context/FormContext";

interface BriefDetailsStepProps {
  formData: BrandDealFormData;
  updateFormData: (data: Partial<BrandDealFormData>) => void;
}

const BriefDetailsStep: React.FC<BriefDetailsStepProps> = ({ formData, updateFormData }) => {
  const [showBriefGenerator, setShowBriefGenerator] = React.useState(false);
  const { setShowAITools } = useFormContext();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center">
          <FileText className="mr-3 h-7 w-7 text-purple-500" />
          Brief Details
        </h2>
        <p className="text-gray-400">
          Provide detailed instructions and guidelines for creators to follow
        </p>
      </div>
      
      <div className="glassmorphism rounded-xl p-7 space-y-7">
        {/* Brief */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label htmlFor="brief" className="flex items-center text-sm font-medium">
              <FileText className="h-4 w-4 mr-2 text-purple-500" />
              Brief Description
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs bg-gray-800/80 hover:bg-gray-700 border-purple-500 text-purple-400 hover:text-white shadow-sm transition-all"
              onClick={() => setShowBriefGenerator(!showBriefGenerator)}
            >
              <Sparkles className="mr-2 h-3 w-3" />
              {showBriefGenerator ? "Hide AI Generator" : "Generate with AI"}
            </Button>
          </div>
          
          {showBriefGenerator ? (
            <ContentBriefGenerator
              initialBrief={formData.brief}
              onGenerate={(generatedBrief) => {
                updateFormData({ brief: generatedBrief });
                setShowBriefGenerator(false);
              }}
            />
          ) : (
            <Textarea
              id="brief"
              value={formData.brief}
              onChange={(e) => updateFormData({ brief: e.target.value })}
              placeholder="Describe what the creator should do in detail..."
              className="min-h-32 bg-gray-900/60 border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          )}
        </div>
        
        {/* Instructions */}
        <div className="space-y-3">
          <label htmlFor="instructions" className="flex items-center text-sm font-medium">
            <ListChecks className="h-4 w-4 mr-2 text-purple-500" />
            Special Instructions
          </label>
          <Textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) => updateFormData({ instructions: e.target.value })}
            placeholder="Any specific instructions or requirements..."
            className="min-h-24 bg-gray-900/60 border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>
        
        {/* Hashtags */}
        <div className="space-y-3">
          <label htmlFor="hashtags" className="flex items-center text-sm font-medium">
            <Hash className="h-4 w-4 mr-2 text-purple-500" />
            Hashtags to Include
          </label>
          <Input
            id="hashtags"
            value={formData.hashtags}
            onChange={(e) => updateFormData({ hashtags: e.target.value })}
            placeholder="e.g. #BrandDeal #Sponsored #YourBrand"
            className="bg-gray-900/60 border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
          <p className="text-xs text-gray-500">Separate hashtags with spaces</p>
        </div>
        
        {/* Social Accounts */}
        <div className="space-y-3">
          <label htmlFor="socialAccounts" className="flex items-center text-sm font-medium">
            <AtSign className="h-4 w-4 mr-2 text-purple-500" />
            Social Accounts to Tag
          </label>
          <Input
            id="socialAccounts"
            value={formData.socialAccounts}
            onChange={(e) => updateFormData({ socialAccounts: e.target.value })}
            placeholder="e.g. @yourbrand @youraccount"
            className="bg-gray-900/60 border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
          <p className="text-xs text-gray-500">Separate accounts with spaces</p>
        </div>
        
        {/* Dos and Don'ts */}
        <div className="space-y-3">
          <label htmlFor="dosAndDonts" className="flex items-center text-sm font-medium">
            <ListChecks className="h-4 w-4 mr-2 text-purple-500" />
            Dos and Don'ts
          </label>
          <Textarea
            id="dosAndDonts"
            value={formData.dosAndDonts}
            onChange={(e) => updateFormData({ dosAndDonts: e.target.value })}
            placeholder="List important dos and don'ts for creators..."
            className="min-h-24 bg-gray-900/60 border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>
        
        <div className="rounded-lg bg-purple-900/20 border border-purple-800/30 p-5 shadow-inner">
          <Button
            type="button"
            variant="outline"
            className="w-full bg-gray-800/80 hover:bg-gray-700 border-purple-500 text-purple-400 hover:text-white shadow-sm hover:shadow-purple-500/10 transition-all rounded-lg"
            onClick={() => setShowAITools(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Access All AI Creation Tools
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BriefDetailsStep;
