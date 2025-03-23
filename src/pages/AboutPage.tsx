
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const AboutPage = () => {
  useEffect(() => {
    document.title = "About Us - CreatorDeals";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-afghan-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              About CreatorDeals
            </h1>
            
            <div className="content-card mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-300 mb-6">
                CreatorDeals was founded with a simple mission: to bridge the gap between talented content creators and innovative brands in Afghanistan. We believe that authentic partnerships lead to meaningful content that resonates with audiences.
              </p>
              <p className="text-gray-300">
                In a rapidly evolving digital landscape, we provide a platform where creators can discover exclusive brand partnership opportunities, and where businesses can connect with the perfect voices to amplify their message.
              </p>
            </div>
            
            <div className="content-card mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-gray-300 mb-6">
                Founded in 2023 by a team of digital marketing enthusiasts and former content creators, CreatorDeals was born from the frustration of seeing disconnection between brands and creators in the Afghan market.
              </p>
              <p className="text-gray-300 mb-6">
                We noticed that while international markets had established platforms for influencer marketing, local Afghan creators often struggled to find legitimate partnership opportunities. Similarly, local businesses couldn't easily identify and collaborate with relevant content creators.
              </p>
              <p className="text-gray-300">
                CreatorDeals was created to solve this problem - offering a transparent, easy-to-use platform that helps both sides succeed in the creator economy.
              </p>
            </div>
            
            <div className="content-card">
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-purple-400">Authenticity</h3>
                  <p className="text-gray-300">
                    We believe in fostering genuine connections between brands and creators, leading to authentic content that audiences trust.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-purple-400">Transparency</h3>
                  <p className="text-gray-300">
                    Our platform provides clear information about deals, requirements, and compensation, ensuring all parties are on the same page.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-purple-400">Innovation</h3>
                  <p className="text-gray-300">
                    We continuously evolve our platform to meet the changing needs of the creator economy and digital marketing landscape.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-purple-400">Community</h3>
                  <p className="text-gray-300">
                    We're building a supportive ecosystem where creators and brands can grow together and elevate the Afghan digital content space.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
