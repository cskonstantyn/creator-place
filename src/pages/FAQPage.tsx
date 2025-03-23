
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  useEffect(() => {
    document.title = "FAQ - CreatorDeals";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-afghan-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Frequently Asked Questions
            </h1>
            
            <div className="content-card p-8">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border-white/10">
                  <AccordionTrigger className="text-lg font-medium">
                    What is CreatorDeals?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    CreatorDeals is a platform that connects content creators and influencers with brands looking for partnerships. We help creators find exclusive deals and collaborations, while enabling businesses to work with relevant voices for their marketing campaigns.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-white/10">
                  <AccordionTrigger className="text-lg font-medium">
                    How do I apply for a brand deal?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    To apply for a brand deal, browse our available opportunities, click on one that interests you, and hit the "Apply Now" button. You'll need to complete an application form that highlights your relevant experience and audience demographics.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-white/10">
                  <AccordionTrigger className="text-lg font-medium">
                    Is it free to use CreatorDeals?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Yes, CreatorDeals is completely free for content creators to use. Brands pay a fee to list their opportunities, but all creators can browse and apply for deals at no cost.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-white/10">
                  <AccordionTrigger className="text-lg font-medium">
                    How do I post a brand deal as a business?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    To post a brand deal, click on "Advertise Deal" in the navigation bar. You'll need to create a business account if you don't have one already, then follow the guided process to create and publish your deal.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-white/10">
                  <AccordionTrigger className="text-lg font-medium">
                    What types of deals can I find on CreatorDeals?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    You'll find a variety of collaboration opportunities, including paid promotions, content creation partnerships, brand ambassador roles, product exchanges, event participation, and more. We cater to creators of all sizes and niches.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="border-white/10">
                  <AccordionTrigger className="text-lg font-medium">
                    How are creators vetted?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Creators provide information about their platforms, audience demographics, and engagement metrics during registration. Brands can review this information before approving applications. We also have measures to detect fake followers and engagement.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7" className="border-white/10">
                  <AccordionTrigger className="text-lg font-medium">
                    What happens after I apply for a deal?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    After applying, the brand will review your application and decide if you're a good fit for their campaign. You'll receive a notification if you're selected, along with next steps for proceeding with the collaboration.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8" className="border-white/10">
                  <AccordionTrigger className="text-lg font-medium">
                    How does payment work?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Payment terms are set by each brand and will be clearly outlined in the deal description. Some brands may pay through our platform, while others will arrange payment directly with creators after the collaboration is complete.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
