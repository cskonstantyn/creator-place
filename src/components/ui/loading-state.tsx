
import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="h-8 bg-gray-800 rounded animate-pulse mb-4"></div>
        <div className="h-12 bg-gray-800 rounded animate-pulse mb-8"></div>
        <div className="h-80 bg-gray-800 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="h-64 bg-gray-800 rounded animate-pulse"></div>
          </div>
          <div className="md:col-span-2">
            <div className="h-64 bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
