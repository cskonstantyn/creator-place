
import React from "react";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  message?: string;
  redirectPath?: string;
  redirectLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "The item you're looking for doesn't exist or has been removed.",
  redirectPath = "/browse",
  redirectLabel = "Browse All Deals"
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Not Found</h2>
      <p className="text-gray-400 mb-6">{message}</p>
      <button 
        onClick={() => navigate(redirectPath)}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
      >
        {redirectLabel}
      </button>
    </div>
  );
};
