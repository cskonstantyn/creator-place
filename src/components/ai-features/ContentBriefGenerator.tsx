
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface ContentBriefGeneratorProps {
  initialBrief?: string;
  onGenerate: (generatedBrief: string) => void;
  showGenerateFormButton?: boolean;
  isGenerating?: boolean;
}

export const ContentBriefGenerator: React.FC<ContentBriefGeneratorProps> = ({
  initialBrief = "",
  onGenerate,
  showGenerateFormButton = false,
  isGenerating = false
}) => {
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedBrief, setGeneratedBrief] = useState(initialBrief);

  const generateBrief = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some information about what you want in the brief.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingBrief(true);

    try {
      // This is a mock implementation that would be replaced with an actual API call
      // In a real implementation, this would call a Supabase edge function with OpenAI integration
      setTimeout(() => {
        const mockBrief = `# ${prompt.split(" ").slice(0, 3).join(" ")} Campaign Brief

## Objective
${prompt}

## Key Messages
- Highlight the unique features of the product/service
- Connect with the target audience authentically
- Create engaging content that drives conversions

## Content Guidelines
- Keep the tone casual yet professional
- Include at least one lifestyle photo with the product
- End with a clear call-to-action
- Use brand colors as accents in the content

## Delivery Requirements
- Post must be published during business hours
- Tag the brand account in both the image and caption
- Use the approved hashtags in the first comment`;

        setGeneratedBrief(mockBrief);
        setIsGeneratingBrief(false);
        
        if (!showGenerateFormButton) {
          onGenerate(mockBrief);
          toast({
            title: "Brief Generated",
            description: "Your content brief has been created successfully! Review and submit when ready.",
          });
        }
      }, 1500);
    } catch (error) {
      console.error("Error generating brief:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content brief. Please try again.",
        variant: "destructive",
      });
      setIsGeneratingBrief(false);
    }
  };

  const handleApply = () => {
    if (!showGenerateFormButton) {
      onGenerate(generatedBrief);
      toast({
        title: "Brief Applied",
        description: "The generated brief has been applied to your form.",
      });
    } else {
      onGenerate(generatedBrief);
    }
  };

  return (
    <div className="space-y-5 glassmorphism rounded-xl p-6 shadow-lg shadow-purple-500/5">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Generate from Text Description</h3>
        <p className="text-sm text-gray-400">
          Describe what you want in your brand deal and our AI will generate the complete form for you.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder="E.g., I need a summer coffee promotion targeting young professionals"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-gray-900/60 border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
          <Button 
            onClick={generateBrief} 
            disabled={isGeneratingBrief || !prompt.trim()}
            className="bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-purple-500/20 transition-all"
          >
            {isGeneratingBrief ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Brief
              </>
            )}
          </Button>
        </div>

        {generatedBrief && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Generated Brief:</h4>
              <Textarea
                value={generatedBrief}
                onChange={(e) => setGeneratedBrief(e.target.value)}
                className="min-h-[150px] bg-gray-900/60 border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
            
            <div className="flex justify-end">
              {showGenerateFormButton ? (
                <Button 
                  onClick={handleApply}
                  disabled={isGenerating}
                  className="btn-gradient rounded-lg"
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
              ) : (
                <Button 
                  onClick={handleApply}
                  className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-green-500/20 transition-all"
                >
                  Apply to Form
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
