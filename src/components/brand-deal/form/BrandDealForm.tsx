
import React from "react";
import { toast } from "@/hooks/use-toast";
import { FormProvider } from "./context/FormContext";
import FormStepper from "./components/FormStepper";
import StepRenderer from "./components/StepRenderer";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BrandDealFormData } from "./types/BrandDealTypes";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useFormContext } from "./context/FormContext";
import { AIToolsPanel } from "@/components/ai-features/AIToolsPanel";

const AIToolsButton = () => {
  const { showAITools, setShowAITools } = useFormContext();
  
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="absolute top-0 right-0 m-6 bg-gradient-to-r from-purple-800/80 to-indigo-800/80 hover:from-purple-700 hover:to-indigo-700 border-purple-500 text-white"
        onClick={() => setShowAITools(true)}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        AI Form Generator
      </Button>
      
      {showAITools && (
        <AIToolsIntegration />
      )}
    </>
  );
};

const AIToolsIntegration = () => {
  const { formData, updateFormData, showAITools, setShowAITools, setIsAIGenerated, setCurrentStep } = useFormContext();
  
  const handleAIUpdate = (updatedData: Partial<BrandDealFormData>) => {
    updateFormData(updatedData);
    
    // If significant data was added by AI, mark as AI generated
    if (Object.keys(updatedData).length > 3) {
      setIsAIGenerated(true);
      toast({
        title: "AI Content Generated",
        description: "Your form has been populated with AI-generated content. Review and submit when ready.",
      });
    }
  };
  
  return (
    showAITools ? (
      <AIToolsPanel
        formData={formData}
        updateFormData={handleAIUpdate}
        onClose={() => setShowAITools(false)}
        setCurrentStep={setCurrentStep}
      />
    ) : null
  );
};

const BrandDealForm: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: BrandDealFormData) => {
    try {
      console.log("Brand deal form submitted with data:", formData);
      
      // Process hashtags, social accounts, and other list fields
      const processedHashtags = formData.hashtags.split(/\s+/).filter(tag => tag.startsWith('#') || tag.length > 0).map(tag => tag.startsWith('#') ? tag : `#${tag}`);
      const processedAccounts = formData.socialAccounts.split(/\s+/).filter(acc => acc.length > 0);
      const processedDosAndDonts = formData.dosAndDonts.split(/\n/).filter(item => item.trim().length > 0);
      
      // Example of how to upload the form data to Supabase
      // This is commented out since we need to adjust the schema to match
      // our brand_deals table properly
      /*
      const { data, error } = await supabase
        .from('brand_deals')
        .insert({
          title: formData.title,
          brand_name: "Your Brand Name", // Replace with actual brand name
          industry: formData.industry,
          category: formData.industry, // Map to appropriate category
          description: formData.description,
          benefits: formData.description, // Need separate benefits field
          promotion_type: formData.promotionType,
          platform: formData.platform,
          collaboration_type: formData.collaborationType,
          location: formData.address,
          followers_required: formData.minFollowers,
          creators_needed: formData.creatorsNeeded,
          price: 0, // Set appropriate price
          deal_value: "$0", // Set appropriate value
          expires: "Dec 31, 2023", // Format date properly
          status: "Active",
          is_featured: false,
          image_url: "https://placeholder.com/image.jpg", // Need image upload
          dos_and_donts: processedDosAndDonts, // Parse from form
          hashtags: processedHashtags, // Parse from form
          accounts_to_mention: processedAccounts, // Parse from form
          content_type: "Post",
          special_instructions: formData.instructions,
          guests_allowed: parseInt(formData.guestsAllowed) || 0,
          deadline_to_apply: formData.deadlineToApply?.toISOString() || "",
          deadline_to_post: formData.deadlineToPost?.toISOString() || "",
          reference_images: [],
          reference_videos: []
        })
        .select();

      if (error) {
        throw error;
      }
      */
      
      // Show success toast
      toast({
        title: "Brand Deal Created",
        description: "Your brand deal has been created successfully!",
      });
      
      // Navigate to browse page
      navigate("/browse");
    } catch (error) {
      console.error("Error submitting brand deal:", error);
      toast({
        title: "Error Creating Brand Deal",
        description: "There was an error creating your brand deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <FormProvider>
      <div className="flex flex-col min-h-[60vh] relative">
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Create Your Collaboration</h3>
          <p className="text-gray-400 text-sm">
            Fill in the details below to create a brand deal for creators
          </p>
        </div>
        
        <AIToolsButton />
        
        <FormStepper onSubmit={handleSubmit}>
          <StepRenderer />
        </FormStepper>
      </div>
    </FormProvider>
  );
};

export default BrandDealForm;
