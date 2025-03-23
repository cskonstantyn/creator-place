
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, Check, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BrandDealFormData } from "@/components/brand-deal/form/types/BrandDealTypes";

interface FormExtractorProps {
  onExtract: (extractedData: Partial<BrandDealFormData>) => void;
  showGenerateButton?: boolean;
  isGenerating?: boolean;
}

export const FormExtractor: React.FC<FormExtractorProps> = ({
  onExtract,
  showGenerateButton = false,
  isGenerating = false
}) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDataExtracted, setIsDataExtracted] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<BrandDealFormData>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsDataExtracted(false);
    }
  };

  const extractFormData = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to extract information from.",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);

    try {
      // This is a mock implementation that would be replaced with an actual API call
      // In a real implementation, this would upload the file to a Supabase edge function
      // and use an AI model to extract information
      
      setTimeout(() => {
        const fileType = file.type;
        let extracted: Partial<BrandDealFormData> = {};
        
        if (fileType.includes("image")) {
          // Mock image extraction result
          extracted = {
            title: "Summer Coffeehouse Collaboration",
            industry: "Food & Beverage",
            promotionType: "Product Review",
            description: "Looking for lifestyle creators to showcase our new summer drinks menu in a relaxed coffeehouse setting.",
            platform: "Instagram",
            collaborationType: "offline",
            offlineCollaborationType: "in_store_visit",
            address: "123 Coffee Street, Downtown Seattle, WA 98101",
            minFollowers: 2500,
            creatorsNeeded: 5,
          };
        } else if (fileType.includes("pdf") || fileType.includes("document")) {
          // Mock document extraction result
          extracted = {
            title: "Seasonal Coffee Campaign",
            industry: "Food & Beverage",
            promotionType: "Brand Awareness",
            description: "We're launching our seasonal menu and looking for creators to help spread the word about our new flavors.",
            brief: "Creators will visit our store, sample our new drinks, and create content showcasing the experience.",
            hashtags: "#SummerSips #CoffeeLovers #SeasonalMenu",
            socialAccounts: "@CoffeeHouse @CoffeeBrand",
          };
        }
        
        setExtractedData(extracted);
        setIsDataExtracted(true);
        setIsExtracting(false);
        
        toast({
          title: "Data Extracted",
          description: "Successfully extracted information from your file! Review and apply to form.",
        });
      }, 2000);
    } catch (error) {
      console.error("Error extracting data:", error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract information from the file. Please try again.",
        variant: "destructive",
      });
      setIsExtracting(false);
    }
  };

  const applyExtractedData = () => {
    onExtract(extractedData);
    
    if (!showGenerateButton) {
      toast({
        title: "Data Applied",
        description: "The extracted data has been applied to your form.",
      });
    }
  };

  return (
    <div className="glassmorphism rounded-xl p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Extract from File</h3>
        <p className="text-sm text-gray-400">
          Upload an image or document containing your brand deal information, and our AI will automatically extract and fill the form fields.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-900/30 border-gray-700 hover:bg-gray-900/50"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, Word, or Image files (MAX. 10MB)
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {file && (
          <div className="text-sm text-gray-300">
            Selected file: <span className="font-medium">{file.name}</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={extractFormData}
            disabled={isExtracting || !file}
            className="bg-purple-600 hover:bg-purple-700 flex-1"
          >
            {isExtracting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting...
              </>
            ) : (
              "Extract Data"
            )}
          </Button>
          
          {isDataExtracted && !showGenerateButton && (
            <Button
              onClick={applyExtractedData}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Apply to Form
            </Button>
          )}
        </div>
        
        {isDataExtracted && showGenerateButton && (
          <Button
            onClick={applyExtractedData}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 mt-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Complete Form...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Complete Form
              </>
            )}
          </Button>
        )}
        
        {isDataExtracted && (
          <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <h4 className="text-sm font-medium mb-2">Extracted Data:</h4>
            <ul className="text-xs space-y-1 text-gray-300">
              {Object.entries(extractedData).map(([key, value]) => (
                <li key={key}>
                  <span className="font-medium text-purple-400">{key}:</span> {String(value)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
