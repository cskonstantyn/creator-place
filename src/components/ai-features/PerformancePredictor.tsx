
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PerformancePredictionData {
  engagementRate: number;
  estimatedReach: number;
  potentialClicks: number;
  conversionLikelihood: number;
  audienceMatch: number;
}

interface PerformancePredictorProps {
  industry: string;
  promotionType: string;
  onPredict?: (prediction: PerformancePredictionData) => void;
}

export const PerformancePredictor: React.FC<PerformancePredictorProps> = ({
  industry,
  promotionType,
  onPredict,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [audienceSize, setAudienceSize] = useState("10000");
  const [contentQuality, setContentQuality] = useState("medium");
  const [prediction, setPrediction] = useState<PerformancePredictionData | null>(null);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  const handlePredict = () => {
    setIsLoading(true);

    // This is a mock implementation that would be replaced with an actual API call
    setTimeout(() => {
      // Generate some realistic-looking metrics based on the inputs
      const audSize = parseInt(audienceSize);
      const qualityFactor = contentQuality === "high" ? 1.5 : contentQuality === "medium" ? 1 : 0.7;
      
      const engagementRate = Math.min(8 + Math.random() * 5, 15) * qualityFactor;
      const estimatedReach = Math.round(audSize * (0.3 + Math.random() * 0.4));
      const potentialClicks = Math.round(estimatedReach * (0.05 + Math.random() * 0.1));
      const conversionLikelihood = Math.min(15 + Math.random() * 15, 35) * qualityFactor;
      const audienceMatch = Math.min(60 + Math.random() * 30, 95);
      
      const predictionData = {
        engagementRate,
        estimatedReach,
        potentialClicks,
        conversionLikelihood,
        audienceMatch,
      };
      
      setPrediction(predictionData);
      if (onPredict) {
        onPredict(predictionData);
      }
      
      setIsLoading(false);
      toast({
        title: "Prediction Complete",
        description: "Performance prediction has been generated based on your inputs.",
      });
    }, 1500);
  };

  const chartData = prediction ? [
    { name: 'Engagement Rate', value: prediction.engagementRate },
    { name: 'Conversion Likelihood', value: prediction.conversionLikelihood },
    { name: 'Audience Match', value: prediction.audienceMatch / 3 }, // Scaled down to fit with other metrics
  ] : [];

  return (
    <div className="glassmorphism rounded-xl p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-purple-500" />
          AI Performance Predictor
        </h3>
        <p className="text-sm text-gray-400">
          Predict the potential performance of your brand deal based on your inputs.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Creator Audience Size</label>
            <Select
              value={audienceSize}
              onValueChange={setAudienceSize}
            >
              <SelectTrigger className="bg-gray-900/60 border-gray-700">
                <SelectValue placeholder="Select audience size" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="5000">Micro (5K followers)</SelectItem>
                <SelectItem value="10000">Small (10K followers)</SelectItem>
                <SelectItem value="50000">Medium (50K followers)</SelectItem>
                <SelectItem value="100000">Large (100K followers)</SelectItem>
                <SelectItem value="500000">XL (500K+ followers)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Expected Content Quality</label>
            <Select
              value={contentQuality}
              onValueChange={setContentQuality}
            >
              <SelectTrigger className="bg-gray-900/60 border-gray-700">
                <SelectValue placeholder="Select content quality" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="high">High Quality</SelectItem>
                <SelectItem value="medium">Medium Quality</SelectItem>
                <SelectItem value="basic">Basic Quality</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handlePredict}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Predict Performance"
          )}
        </Button>

        {prediction && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-xs text-gray-400">Estimated Reach</h4>
                <p className="text-2xl font-bold">{prediction.estimatedReach.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-xs text-gray-400">Potential Clicks</h4>
                <p className="text-2xl font-bold">{prediction.potentialClicks.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-xs text-gray-400">Engagement Rate</h4>
                <p className="text-2xl font-bold">{prediction.engagementRate.toFixed(1)}%</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-xs text-gray-400">Conversion Likelihood</h4>
                <p className="text-2xl font-bold">{prediction.conversionLikelihood.toFixed(1)}%</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
