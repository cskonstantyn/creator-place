
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    document.title = "Page Not Found - CreatorDeals";
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-afghan-background p-4">
      <div className="glassmorphism rounded-xl p-8 md:p-12 max-w-lg w-full text-center">
        <div className="bg-red-500/10 p-6 rounded-full inline-flex mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400">
          Page Not Found
        </h1>
        
        <p className="text-gray-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
          <br />We suggest you go back to home.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-gray-700">
            <Link to="/browse">
              Browse Deals
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
