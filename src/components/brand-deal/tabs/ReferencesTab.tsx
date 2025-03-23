
import React from "react";
import { ImageIcon, Film, ExternalLink, Download, Copy, Clipboard, Plus } from "lucide-react";

interface ReferencesTabProps {
  referenceImages: string[];
  referenceVideos: {
    title: string;
    url: string;
  }[];
  hashtags: string[];
  accountsToMention: string[];
  location: string;
  copyToClipboard: (text: string, message: string) => void;
}

export const ReferencesTab: React.FC<ReferencesTabProps> = ({
  referenceImages,
  referenceVideos,
  hashtags,
  accountsToMention,
  location,
  copyToClipboard
}) => {
  return (
    <div className="space-y-4">
      <div className="content-card">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <ImageIcon className="h-5 w-5 mr-2 text-purple-400" />
          Reference Images
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {referenceImages.map((image, index) => (
            <div key={index} className="relative group aspect-video rounded-md overflow-hidden">
              <img src={image} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a 
                  href={image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20"
                >
                  <ExternalLink className="h-4 w-4 text-white" />
                </a>
                <button 
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = image;
                    link.download = `reference-${index + 1}.jpg`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Add more button */}
          <div className="relative group aspect-video rounded-md overflow-hidden bg-afghan-background-light/30 flex items-center justify-center cursor-pointer hover:bg-afghan-background-light/50">
            <Plus className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="content-card">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <Film className="h-5 w-5 mr-2 text-purple-400" />
          Reference Videos
        </h2>
        <div className="space-y-3">
          {referenceVideos.map((video, index) => (
            <div key={index} className="bg-afghan-background-dark/50 rounded-md p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-purple-900/50 p-2 rounded-md mr-3">
                  <Film className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{video.title}</h3>
                  <p className="text-xs text-gray-400 truncate max-w-xs">{video.url}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20"
                >
                  <ExternalLink className="h-4 w-4 text-white" />
                </a>
                <button 
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20"
                  onClick={() => copyToClipboard(video.url, `Video URL copied to clipboard!`)}
                >
                  <Copy className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Add video button */}
          <div className="bg-afghan-background-light/30 rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-afghan-background-light/50">
            <Plus className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-400">Add reference video</span>
          </div>
        </div>
      </div>
      
      <div className="content-card">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <Clipboard className="h-5 w-5 mr-2 text-purple-400" />
          Content Template
        </h2>
        <div className="bg-afghan-background-dark/50 p-4 rounded-md">
          <p className="text-sm text-gray-300">
            Hashtags: {hashtags.join(", ")}<br />
            Brand Mention: {accountsToMention.join(", ")}<br />
            Brand's Location: {location}
          </p>
          <button 
            className="mt-3 flex items-center text-sm text-purple-400 hover:text-purple-300"
            onClick={() => copyToClipboard(`Hashtags: ${hashtags.join(", ")}\nBrand Mention: ${accountsToMention.join(", ")}\nBrand's Location: ${location}`, "Content template copied to clipboard!")}
          >
            <Copy className="h-3.5 w-3.5 mr-1" />
            Copy template
          </button>
        </div>
      </div>
    </div>
  );
};
