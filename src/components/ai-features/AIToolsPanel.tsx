
import React, { useState } from "react";
import { Sparkles, X, Zap, FileUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentBriefGenerator } from "./ContentBriefGenerator";
import { FormExtractor } from "./FormExtractor";
import { PerformancePredictor } from "./PerformancePredictor";
import { BrandDealFormData } from "@/components/brand-deal/form/types/BrandDealTypes";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AIToolsPanelProps {
  formData: BrandDealFormData;
  updateFormData: (data: Partial<BrandDealFormData>) => void;
  onClose: () => void;
  setCurrentStep?: (step: number) => void;
}

export const AIToolsPanel: React.FC<AIToolsPanelProps> = ({
  formData,
  updateFormData,
  onClose,
  setCurrentStep,
}) => {
  const [activeTab, setActiveTab] = useState<string>("extract"); // Default to extract tab
  const [isGenerating, setIsGenerating] = useState(false);
  const [textPrompt, setTextPrompt] = useState("");

  const handleGenerateCompletedForm = (method: "extract" | "text", data?: Partial<BrandDealFormData>) => {
    setIsGenerating(true);
    
    // Build upon any existing data provided (from extractor) or use current form data
    const baseData = data || formData;
    
    // Generate a complete form with all required fields
    const today = new Date();
    const applyDeadline = new Date();
    applyDeadline.setDate(today.getDate() + 14); // Two weeks from now
    
    const postDeadline = new Date();
    postDeadline.setDate(today.getDate() + 30); // One month from now
    
    // Industry-specific content based on the selected industry or a default
    const industry = baseData.industry || "Food & Beverage";
    
    // Platform selection based on industry best practices
    let platform = "instagram";
    let collaborationType = "remote";
    if (industry === "Technology") {
      platform = "youtube";
    } else if (industry === "Fashion & Apparel") {
      platform = "tiktok";
      collaborationType = "offline";
    }
    
    const generatedData: BrandDealFormData = {
      // General Info
      title: baseData.title || `${industry} Promotional Campaign`,
      industry: industry,
      promotionType: baseData.promotionType || "Brand Awareness",
      description: baseData.description || `A collaborative campaign to showcase our products/services to new audiences through authentic creator content.`,
      
      // Collaboration Info
      platform: baseData.platform || platform,
      collaborationType: baseData.collaborationType || collaborationType,
      offlineCollaborationType: baseData.collaborationType === "offline" ? (baseData.offlineCollaborationType || "in_store_visit") : "",
      
      // Requirements
      address: baseData.address || "123 Main Street, New York, NY 10001",
      deadlineToApply: baseData.deadlineToApply || applyDeadline,
      deadlineToPost: baseData.deadlineToPost || postDeadline,
      minFollowers: baseData.minFollowers || 2500,
      creatorsNeeded: baseData.creatorsNeeded || 3,
      bookingLink: baseData.bookingLink || "https://calendly.com/yourbrand/creator-meeting",
      
      // Brief Details
      brief: baseData.brief || `# ${baseData.title || industry} Collaboration Brief

## Objectives
- Increase brand awareness among ${industry} audience
- Drive engagement with our new products/services
- Generate authentic content for our marketing channels

## Content Guidelines
- Maintain brand voice while allowing for creator authenticity
- Include at least one lifestyle image featuring our product
- Emphasize the unique benefits of our offering

## Requirements
- Post must be published during peak hours (10am-2pm)
- Tag our official account in both image and caption
- Include required hashtags in the first comment`,
      
      instructions: baseData.instructions || "Please ensure all content meets our brand guidelines. Let us know if you need any clarification before posting.",
      hashtags: baseData.hashtags || "#sponsored #ad #brandpartner",
      socialAccounts: baseData.socialAccounts || "@yourbrand @yourproduct",
      dosAndDonts: baseData.dosAndDonts || "DO: Show the product in use\nDO: Highlight your genuine experience\nDON'T: Make claims not supported by product\nDON'T: Use competitors in the same content",
      
      // Guest Info
      guestsAllowed: baseData.guestsAllowed || "1",
      guestInstructions: baseData.guestInstructions || "Guests must follow the same guidelines as creators. Please inform us in advance if you plan to bring guests.",
      
      // Media
      images: baseData.images || [],
    };
    
    updateFormData(generatedData);
    
    setTimeout(() => {
      setIsGenerating(false);
      
      toast({
        title: "Complete Form Generated",
        description: method === "extract" 
          ? "Form fields have been populated based on your file and AI suggestions." 
          : "All form fields have been populated based on your input and AI suggestions.",
      });
      
      // Navigate to review step
      if (setCurrentStep) {
        setCurrentStep(6); // Navigate to review step
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
            AI Creation Tools
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-8">
          <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-500/30">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-400" />
              Generate Complete Brand Deal Form
            </h3>
            
            <p className="text-sm text-gray-300 mb-6">
              Let AI create a complete brand deal form for you. Choose your preferred method below:
            </p>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="extract" className="data-[state=active]:bg-purple-600">
                  <FileUp className="mr-2 h-4 w-4" />
                  Extract from File
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-purple-600">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Generate from Text
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="extract" className="space-y-4">
                <FormExtractor 
                  onExtract={(extractedData) => {
                    updateFormData(extractedData);
                    handleGenerateCompletedForm("extract", extractedData);
                  }} 
                  showGenerateButton={true}
                  isGenerating={isGenerating}
                />
              </TabsContent>
              
              <TabsContent value="text" className="space-y-4">
                <ContentBriefGenerator 
                  initialBrief=""
                  onGenerate={(generatedBrief) => {
                    updateFormData({ brief: generatedBrief });
                    handleGenerateCompletedForm("text", { brief: generatedBrief });
                  }}
                  showGenerateFormButton={true}
                  isGenerating={isGenerating}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <PerformancePredictor 
              industry={formData.industry}
              promotionType={formData.promotionType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
