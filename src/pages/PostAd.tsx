import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PostAdTabs from "../components/listing-form/PostAdTabs";

const PostAd = () => {
  const [currentTab, setCurrentTab] = useState("listing");

  // Change page title on component mount
  useEffect(() => {
    document.title = currentTab === "listing" 
      ? "Advertise Discount - CreatorDeals" 
      : "Create a Brand Deal - CreatorDeals";
  }, [currentTab]);

  return (
    <div className="min-h-screen flex flex-col bg-afghan-background">
      <Navbar />
      
      <div className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero section for the post ad page */}
            <div className="mb-10 text-center">
              <h1 className="section-title text-3xl md:text-4xl mb-4">
                Promote Your Business with CreatorDeals
              </h1>
              <p className="section-description">
                Connect with influencers and creators or advertise special discounts to attract new customers
              </p>
            </div>
            
            <PostAdTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PostAd;
